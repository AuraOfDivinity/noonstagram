const db = require("../config/db.config");

// Create comments table if not exists
const Comment = db
  .promise()
  .query(
    `CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)`
  )
  .catch((err) => console.error("Error creating Comments table: ", err));

// Create a new comment
Comment.create = async (data) => {
  const { post_id, user_id, text } = data;
  const [result] = await db
    .promise()
    .query("INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)", [
      post_id,
      user_id,
      text,
    ]);
  return result;
};

// Export Post...
module.exports = Comment;
