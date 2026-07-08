const express = require("express");
const { createUpload } = require("../utils/multer");
const { compressFiles } = require("../utils/compress");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const upload = createUpload("editor");

router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  // Compress image if over 150KB
  await compressFiles([req.file]);

  const url = `${process.env.BASE_URL}uploads/editor/${req.file.filename}`;
  res.json({ url });
});

module.exports = router;
