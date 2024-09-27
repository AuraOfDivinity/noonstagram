// config/aws.config.js

const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

// Configure AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Set up multer storage for S3 without ACL
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: (req, file, cb) => {
      cb(null, file.mimetype);
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}_${file.originalname}`);
    },
  }),
});

module.exports = { s3Client, upload };
