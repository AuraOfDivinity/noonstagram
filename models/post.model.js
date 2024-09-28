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

Post.getAllPosts = async (limit = 3, offset = 0) => {
  const query = `
    SELECT 
      posts.*, 
      post_users.name AS post_user_name
    FROM posts
    JOIN users AS post_users ON posts.user_id = post_users.id
    ORDER BY posts.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await db.promise().query(query, [limit, offset]);

  const posts = rows.map((post) => ({
    id: post.id,
    user_id: post.user_id,
    user_name: post.post_user_name,
    title: post.title,
    description: post.description,
    image_url: post.image_url,
    created_at: post.created_at,
    likes: post.likes,
    comments: [],
  }));

  return posts;
};

Post.getCommentsForPosts = async (postIds) => {
  if (postIds.length === 0) return [];

  const query = `
    SELECT 
      comments.*, 
      comment_users.name AS comment_user_name
    FROM comments
    JOIN users AS comment_users ON comments.user_id = comment_users.id
    WHERE comments.post_id IN (?)
  `;

  const [rows] = await db.promise().query(query, [postIds]);

  const comments = rows.map((comment) => ({
    post_id: comment.post_id,
    id: comment.id,
    text: comment.text,
    created_at: comment.created_at,
    user_name: comment.comment_user_name,
  }));

  return comments;
};

Post.getAll = async (limit = 3, offset = 0) => {
  const posts = await Post.getAllPosts(limit, offset);

  const postIds = posts.map((post) => post.id);
  const comments = await Post.getCommentsForPosts(postIds);

  posts.forEach((post) => {
    post.comments = comments.filter((comment) => comment.post_id === post.id);
  });

  return posts;
};

module.exports = Post;
