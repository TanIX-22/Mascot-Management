document.getElementById("loginBtn").addEventListener("click", login);

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("message");
  const userInfoDiv = document.getElementById("userInfo");
  const userJson = document.getElementById("userJson");

  userInfoDiv.style.display = "none";
  userJson.textContent = "";

  if (!username || !password) {
    msg.style.color = "red";
    msg.textContent = "Username and password are required";
    return;
  }

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.style.color = "red";
      msg.textContent = data.message || "Error occurred";
      return;
    }

    // success
    msg.style.color = "green";
    msg.textContent = data.message || "Login successful";

    // show user details (id, username, password, login_count, last_login)
    if (data.user) {
      userInfoDiv.style.display = "block";
      userJson.textContent = JSON.stringify(data.user, null, 2);
    }
  } catch (err) {
    msg.style.color = "red";
    msg.textContent = "Network error: " + err.message;
    console.error(err);
  }
}