// middlewares/auth.middleware.js

const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  // Extract the token from "Bearer <token>"
  const tokenParts = token.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(400).json({ message: "Invalid token format." });
  }

  const jwtToken = tokenParts[1];

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log({ err });
    res.status(400).json({ message: "Invalid token." });
  }
};
