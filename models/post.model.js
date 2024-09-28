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
Post.create = async (data) => {
  const { userId, title, description, imageUrl } = data;
  const [rows] = await db
    .promise()
    .query(
      "INSERT INTO posts (user_id, title, description, image_url) VALUES (?, ?, ?, ?)",
      [userId, title, description, imageUrl]
    );
  return rows;
};

// Get all posts
Post.getAll = async (limit = 3, offset = 0) => {
  const query = `
    SELECT 
      posts.*, 
      post_users.name AS post_user_name, 
      comments.id AS comment_id,
      comments.text AS comment_text,
      comments.created_at AS comment_created_at,
      comment_users.name AS comment_user_name
    FROM posts
    JOIN users AS post_users ON posts.user_id = post_users.id
    LEFT JOIN comments ON comments.post_id = posts.id
    LEFT JOIN users AS comment_users ON comments.user_id = comment_users.id
    ORDER BY posts.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await db.promise().query(query, [limit, offset]);

  // Transform the rows into the desired format
  const posts = rows.reduce((acc, row) => {
    const {
      id,
      user_id,
      post_user_name,
      image_url,
      description,
      created_at,
      likes,
      comment_id,
      comment_text,
      comment_created_at,
      comment_user_name,
    } = row;

    // Find the post or create a new one
    let post = acc.find((p) => p.id === id);
    if (!post) {
      post = {
        id,
        user_id,
        user_name: post_user_name,
        image_url,
        description,
        created_at,
        likes,
        comments: [],
      };
      acc.push(post);
    }

    // If there's a comment, add it to the post
    if (comment_id) {
      post.comments.push({
        id: comment_id,
        text: comment_text,
        created_at: comment_created_at,
        user_name: comment_user_name, // Add the comment user name
      });
    }

    return acc;
  }, []);

  return posts;
};

// Export Post...
module.exports = Post;
