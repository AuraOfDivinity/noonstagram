// controllers/post.controller.js

const Post = require("../models/post.model");
const Like = require("../models/like.model");
const User = require("../models/user.model");

// Create a new post
exports.createPost = async (req, res) => {
  const { title, description, imageUrl } = req.body;
  const userId = req.user.id; // Assume req.user contains the authenticated user's ID

  try {
    const newPost = await Post.create(userId, title, description, imageUrl);
    res.status(201).json({
      message: "Post created successfully.",
      postId: newPost.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.getAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    await Like.add(userId, postId);
    res.status(200).json({ message: "Post liked successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    await Like.remove(userId, postId);
    res.status(200).json({ message: "Post unliked successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// Get liked posts for a user
exports.getLikedPosts = async (req, res) => {
  const userId = req.user.id;

  try {
    const likedPosts = await User.getLikedPosts(userId);
    res.json(likedPosts);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};
