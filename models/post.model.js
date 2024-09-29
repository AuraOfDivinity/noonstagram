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

Post.create = async (data) => {
  const { userId, title, description, imageUrl } = data;
  const [result] = await db
    .promise()
    .query(
      "INSERT INTO posts (user_id, title, description, image_url) VALUES (?, ?, ?, ?)",
      [userId, title, description, imageUrl]
    );
  const [rows] = await db
    .promise()
    .query("SELECT * FROM posts WHERE id = LAST_INSERT_ID()");

  return rows[0]; // Return the first (and only) row, which is the newly created post
};

Post.getAllPosts = async (userId, limit = 3, offset = 0) => {
  const query = `
    SELECT 
      posts.*, 
      post_users.name AS post_user_name,
      EXISTS (
        SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?
      ) AS isLiked
    FROM posts
    JOIN users AS post_users ON posts.user_id = post_users.id
    ORDER BY posts.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await db.promise().query(query, [userId, limit, offset]);

  const posts = rows.map((post) => ({
    id: post.id,
    user_id: post.user_id,
    user_name: post.post_user_name,
    title: post.title,
    description: post.description,
    image_url: post.image_url,
    created_at: post.created_at,
    likes: post.likes,
    isLiked: !!post.isLiked, // Convert 1 or 0 to true/false
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

Post.getAll = async (userId, limit = 3, offset = 0) => {
  const posts = await Post.getAllPosts(userId, limit, offset);

  const postIds = posts.map((post) => post.id);
  const comments = await Post.getCommentsForPosts(postIds);

  posts.forEach((post) => {
    post.comments = comments.filter((comment) => comment.post_id === post.id);
  });

  return posts;
};

Post.getPostById = async (postId, userId) => {
  // Get the post by postId
  const query = `
    SELECT 
      posts.*, 
      post_users.name AS post_user_name,
      IF(likes.user_id IS NOT NULL, 1, 0) AS isLiked
    FROM posts
    JOIN users AS post_users ON posts.user_id = post_users.id
    LEFT JOIN likes ON likes.post_id = posts.id AND likes.user_id = ?
    WHERE posts.id = ?
  `;

  const [rows] = await db.promise().query(query, [userId, postId]);

  if (rows.length === 0) {
    throw new Error("Post not found");
  }

  const post = {
    id: rows[0].id,
    user_id: rows[0].user_id,
    user_name: rows[0].post_user_name,
    title: rows[0].title,
    description: rows[0].description,
    image_url: rows[0].image_url,
    created_at: rows[0].created_at,
    likes: rows[0].likes,
    isLiked: rows[0].isLiked === 1, // Convert MySQL tinyint to boolean
    comments: [],
  };

  // Get the comments for the specific post
  const commentsQuery = `
    SELECT 
      comments.*, 
      comment_users.name AS comment_user_name 
    FROM comments
    JOIN users AS comment_users ON comments.user_id = comment_users.id
    WHERE comments.post_id = ?
    ORDER BY comments.created_at ASC
  `;

  const [commentRows] = await db.promise().query(commentsQuery, [postId]);

  post.comments = commentRows.map((comment) => ({
    id: comment.id,
    text: comment.text,
    created_at: comment.created_at,
    user_name: comment.comment_user_name,
  }));

  return post;
};

module.exports = Post;
