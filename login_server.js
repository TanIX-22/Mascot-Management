// server.js
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // serve frontend files

// === MySQL connection - EDIT password/user as needed ===
const db = mysql.createConnection({
  host: "localhost",
  user: "root",          // change if needed
  password: "",          // <-- PUT your MySQL password here
  database: "login_system"
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connect error:", err.message);
    process.exit(1); // stop server if DB connection fails
  }
  console.log("✅ MySQL Connected!");
});

// === POST /login
app.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password required" });
    }

    db.query(
      "SELECT id, username, password, login_count, last_login FROM users WHERE username = ? AND password = ? LIMIT 1",
      [username, password],
      (err, results) => {
        if (err) {
          console.error("DB query error:", err.message);
          return res.status(500).json({ success: false, message: "Database error: " + err.message });
        }

        if (results.length === 0) {
          return res.status(401).json({ success: false, message: "Invalid username or password" });
        }

        const user = results[0];

        // Update login_count and last_login, then return updated row
        db.query(
          "UPDATE users SET login_count = login_count + 1, last_login = NOW() WHERE id = ?",
          [user.id],
          (err2) => {
            if (err2) {
              console.error("DB update error:", err2.message);
              // still return success? we should return DB error
              return res.status(500).json({ success: false, message: "Database error: " + err2.message });
            }

            // fetch updated row to send back
            db.query(
              "SELECT id, username, password, login_count, last_login FROM users WHERE id = ?",
              [user.id],
              (err3, updatedRows) => {
                if (err3) {
                  console.error("DB select after update error:", err3.message);
                  return res.status(500).json({ success: false, message: "Database error: " + err3.message });
                }
                const updatedUser = updatedRows[0];
                return res.json({
                  success: true,
                  message: `✅ Login successful! (times logged in: ${updatedUser.login_count})`,
                  user: updatedUser
                });
              }
            );
          }
        );
      }
    );
  } catch (ex) {
    console.error("Unexpected error:", ex.message);
    res.status(500).json({ success: false, message: "Unexpected server error: " + ex.message });
  }
});

// === GET /users (admin view) - shows id, username, password, login_count, last_login
app.get("/users", (req, res) => {
  db.query("SELECT id, username, password, login_count, last_login FROM users", (err, rows) => {
    if (err) {
      console.error("DB error:", err.message);
      return res.status(500).json({ success: false, message: "Database error: " + err.message });
    }
    res.json(rows);
  });
});

// === Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
