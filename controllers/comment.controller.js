const Comment = require("../models/comment.model");

exports.createComment = async (req, res) => {
  const { text } = req.body;
  const { post_id } = req.params;

  const newComment = {
    post_id,
    user_id: req.user.id,
    text,
  };

  if (!post_id) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  Comment.create(newComment)
    .then((comment) => {
      res
        .status(201)
        .json({ message: "Comment created succesfully.", comment });
    })
    .catch((err) =>
      res.status(500).json({ message: "Server error", error: err.message })
    );
};
