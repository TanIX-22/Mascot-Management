// Mobile menu toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Form submission (demo alert)
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    this.reset();
});

// Simple visit counter animation (static for demo)
// In production, fetch from server
setInterval(() => {
    const counter = document.getElementById('visit-counter');
    let count = parseInt(counter.textContent.replace(/,/g, ''));
    counter.textContent = (count + 1).toLocaleString();
}, 5000); // Increment every 5 seconds for demo

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
});
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Mobile Menu Toggle
document.getElementById('mobile-menu-btn').addEventListener('click', () => {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
});

// Optional: Increment visit counter
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('#visit-counter, .text-sm.text-gray-500');
  counters.forEach(counter => {
    const text = counter.textContent;
    if (text.includes('Times Visited')) {
      let num = parseInt(text.replace(/[^0-9]/g, '')) || 0;
      counter.innerHTML = `Visited <strong>${(num + 1).toLocaleString()}</strong> times`;
    }
  });
});
