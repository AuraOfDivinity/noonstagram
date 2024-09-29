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

  // Insert the new comment into the database
  const [result] = await db
    .promise()
    .query("INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)", [
      post_id,
      user_id,
      text,
    ]);

  const insertId = result.insertId; // The ID of the newly inserted comment

  // Fetch the newly inserted comment using the insertId
  const [rows] = await db.promise().query(
    `
        SELECT comments.*, users.name AS user_name
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.id = ?
      `,
    [insertId]
  );

  // Return the newly created comment record
  return rows[0];
};

// Export Post...
module.exports = Comment;
