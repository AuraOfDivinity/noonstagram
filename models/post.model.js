// models/post.model.js

const db = require("../config/db.config");

// Create Post table if not exists
const Post = db
  .promise()
  .query(
    `
  CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`
  )
  .catch((err) => console.error("Error creating Post table: ", err));

// Create a new post
Post.create = async (userId, title, description, imageUrl) => {
  const [rows] = await db
    .promise()
    .query(
      "INSERT INTO posts (user_id, title, description, image_url) VALUES (?, ?, ?, ?)",
      [userId, title, description, imageUrl]
    );
  return rows;
};

// Get all posts
Post.getAll = async () => {
  const [rows] = await db
    .promise()
    .query("SELECT * FROM posts ORDER BY created_at DESC");
  return rows;
};

// Export Post...
module.exports = Post;
