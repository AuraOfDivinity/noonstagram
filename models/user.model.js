// models/user.model.js

const db = require("../config/db.config");

// Create User table if not exists
const User = db
  .promise()
  .query(
    `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    google_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`
  )
  .catch((err) => {
    console.error("Error creating User table: ", err);
    console.log(err);
  });

// Insert a new user into the database
User.create = async (name, email, hashedPassword, googleId = null) => {
  const [rows] = await db
    .promise()
    .query(
      "INSERT INTO users (name, email, password, google_id) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, googleId]
    );
  return rows;
};

// Find user by email
User.findByEmail = async (email) => {
  const [rows] = await db
    .promise()
    .query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

// Find user by ID
User.findById = async (id) => {
  const [rows] = await db
    .promise()
    .query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

module.exports = User;
