// routes/post.routes.js
const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Protected routes
router.post("/", verifyToken, postController.createPost); // Create a post
router.get("/", verifyToken, postController.getAllPosts); // Get all posts
router.post("/:postId/like", verifyToken, postController.likePost); // Like a post
router.post("/:postId/unlike", verifyToken, postController.unlikePost); // Unlike a post
router.get("/liked", verifyToken, postController.getLikedPosts); // Get liked posts

module.exports = router;
