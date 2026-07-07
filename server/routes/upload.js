const express = require("express");
const { createUpload } = require("../utils/multer");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const upload = createUpload("editor");

router.post("/", authMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const url = `${process.env.BASE_URL + req.file.filename}`;
  res.json({ url });
});

module.exports = router;
