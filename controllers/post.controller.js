// controllers/post.controller.js

const Post = require("../models/post.model");
const Like = require("../models/like.model");
const User = require("../models/user.model");

const { upload } = require("../config/aws.config");

// Upload image and create a post
exports.createPost = (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error uploading image", error: err });
    }

    const { title, description } = req.body;
    const imageUrl = req.file ? req.file.location : null;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "Image is required" });
    }
    const newPost = {
      title,
      description: description || null,
      imageUrl,
      userId: req.user.id,
    };
    Post.create(newPost)
      .then((post) =>
        res.status(201).json({ message: "Post successfully created!" })
      )
      .catch((err) =>
        res.status(500).json({ message: "Server error", error: err.message })
      );
  });
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
