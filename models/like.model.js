// models/like.model.js

const db = require("../config/db.config");

// Create Likes table if not exists
const Like = db
  .promise()
  .query(
    `
  CREATE TABLE IF NOT EXISTS likes (
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
  )
`
  )
  .catch((err) => console.error("Error creating Likes table: ", err));

// Add like to a post
Like.add = async (userId, postId) => {
  const [rows] = await db
    .promise()
    .query("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [
      userId,
      postId,
    ]);
  return rows;
};

// Remove like from a post
Like.remove = async (userId, postId) => {
  const [rows] = await db
    .promise()
    .query("DELETE FROM likes WHERE user_id = ? AND post_id = ?", [
      userId,
      postId,
    ]);
  return rows;
};

// Export Like...
module.exports = Like;
