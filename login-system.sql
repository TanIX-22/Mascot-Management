-- 1) Create database if not exists
CREATE DATABASE IF NOT EXISTS login_system;
USE login_system;

-- 2) Create users table (only if not exists)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  login_count INT NOT NULL DEFAULT 0,
  last_login DATETIME DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3) Ensure password column is wide enough
ALTER TABLE users MODIFY password VARCHAR(255) NOT NULL;

-- 4) Ensure login_count and last_login columns exist (safe re-checks)
-- (if they already exist, MySQL will throw error — just ignore those errors)
ALTER TABLE users ADD COLUMN login_count INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN last_login DATETIME DEFAULT NULL;

-- 5) Fix existing rows where login_count is NULL
UPDATE users SET login_count = 0 WHERE login_count IS NULL;

-- 6) Insert a test user (tanishq/1234) only if not already present
INSERT INTO users (username, password)
SELECT 'tanishq','1234' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='tanishq');

-- 7) Analysis / verification queries
-- a) Users with empty password
SELECT id, username FROM users WHERE password = '' OR password IS NULL;

-- b) Duplicate usernames
SELECT username, COUNT(*) AS cnt FROM users GROUP BY username HAVING cnt > 1;

-- c) Show final data
SELECT id, username, password, login_count, last_login, created_at FROM users;
