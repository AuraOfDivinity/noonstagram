// routes/post.routes.js
const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Protected routes
router.post("/:post_id", verifyToken, commentController.createComment);

module.exports = router;
