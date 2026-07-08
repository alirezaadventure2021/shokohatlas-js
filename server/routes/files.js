const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const authMiddleware = require("../middleware/auth");
const { compressImage } = require("../utils/compress");

const router = express.Router();
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

// Helper: validate and resolve path to prevent directory traversal
function safePath(relativePath) {
  if (!relativePath) return UPLOADS_DIR;

  // Normalize and strip leading slashes
  const cleaned = relativePath.replace(/^\/+/, "").replace(/\.\./g, "");

  const resolved = path.resolve(UPLOADS_DIR, cleaned);

  // Ensure resolved path is within uploads directory
  if (!resolved.startsWith(UPLOADS_DIR)) {
    return null;
  }

  return resolved;
}

// Multer storage for file manager uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const targetPath = req.query.path || "";
    const dest = path.join(UPLOADS_DIR, targetPath);
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    // Preserve original filename, add timestamp if exists
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// Helper: validate and resolve path to prevent directory traversal
function safePath(relativePath) {
  if (!relativePath) return UPLOADS_DIR;

  // Normalize and strip leading slashes
  const cleaned = relativePath.replace(/^\/+/, "").replace(/\.\./g, "");

  const resolved = path.resolve(UPLOADS_DIR, cleaned);

  // Ensure resolved path is within uploads directory
  if (!resolved.startsWith(UPLOADS_DIR)) {
    return null;
  }

  return resolved;
}

// Helper: get file info
function getFileInfo(filePath, relativePath) {
  const stats = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const imageExts = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".bmp",
    ".ico",
  ];

  return {
    name: path.basename(filePath),
    path: relativePath.replace(/\\/g, "/"),
    type: "file",
    size: stats.size,
    modified: stats.mtime.toISOString(),
    isImage: imageExts.includes(ext),
  };
}

// Helper: get folder info
function getFolderInfo(folderPath, relativePath) {
  const stats = fs.statSync(folderPath);
  let itemCount = 0;
  try {
    itemCount = fs.readdirSync(folderPath).length;
  } catch (e) {}

  return {
    name: path.basename(folderPath),
    path: relativePath.replace(/\\/g, "/"),
    type: "folder",
    itemCount,
    modified: stats.mtime.toISOString(),
  };
}

// GET /api/files — list folders and files
router.get("/", authMiddleware, (req, res) => {
  try {
    const relativePath = req.query.path || "";
    const targetDir = safePath(relativePath);

    if (!targetDir) {
      return res.status(400).json({ message: "Invalid path" });
    }

    if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const entries = fs.readdirSync(targetDir);
    const items = [];

    for (const entry of entries) {
      // Skip hidden files
      if (entry.startsWith(".")) continue;

      const fullPath = path.join(targetDir, entry);
      const entryRelative = relativePath ? `${relativePath}/${entry}` : entry;

      try {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          items.push(getFolderInfo(fullPath, entryRelative));
        } else {
          items.push(getFileInfo(fullPath, entryRelative));
        }
      } catch (e) {
        // Skip inaccessible entries
      }
    }

    // Sort: folders first, then files, alphabetically
    items.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    res.json({
      path: relativePath || "/",
      items,
    });
  } catch (err) {
    console.error("Files list error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/files — delete a file or folder
router.delete("/", authMiddleware, (req, res) => {
  try {
    const filePath = req.query.path;
    if (!filePath) {
      return res.status(400).json({ message: "Path is required" });
    }

    // Prevent deleting the uploads root
    if (filePath === "" || filePath === "/") {
      return res.status(400).json({ message: "Cannot delete root folder" });
    }

    const fullPath = safePath(filePath);
    if (!fullPath) {
      return res.status(400).json({ message: "Invalid path" });
    }

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: "Not found" });
    }

    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      // Delete folder and all its contents recursively
      fs.rmSync(fullPath, { recursive: true, force: true });
      res.json({ message: "Folder deleted" });
    } else {
      fs.unlinkSync(fullPath);
      res.json({ message: "File deleted" });
    }
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/files/move — move a file to another folder
router.post("/move", authMiddleware, (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res
        .status(400)
        .json({ message: "Both 'from' and 'to' paths are required" });
    }

    const fromPath = safePath(from);
    const toDir = safePath(to);

    if (!fromPath || !toDir) {
      return res.status(400).json({ message: "Invalid path" });
    }

    if (!fs.existsSync(fromPath)) {
      return res.status(404).json({ message: "Source file not found" });
    }

    if (!fs.existsSync(toDir) || !fs.statSync(toDir).isDirectory()) {
      return res.status(404).json({ message: "Destination folder not found" });
    }

    const fileName = path.basename(fromPath);
    const destPath = path.join(toDir, fileName);

    // Prevent overwriting existing file
    if (fs.existsSync(destPath)) {
      return res
        .status(409)
        .json({ message: "File already exists in destination" });
    }

    fs.renameSync(fromPath, destPath);
    res.json({
      message: "File moved",
      from: from.replace(/\\/g, "/"),
      to: `${to}/${fileName}`.replace(/\\/g, "/"),
    });
  } catch (err) {
    console.error("File move error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/files/mkdir — create a new folder
router.post("/mkdir", authMiddleware, (req, res) => {
  try {
    const { path: folderPath } = req.body;

    if (!folderPath) {
      return res.status(400).json({ message: "Folder path is required" });
    }

    const fullPath = safePath(folderPath);
    if (!fullPath) {
      return res.status(400).json({ message: "Invalid path" });
    }

    if (fs.existsSync(fullPath)) {
      return res.status(409).json({ message: "Folder already exists" });
    }

    fs.mkdirSync(fullPath, { recursive: true });
    res.status(201).json({ message: "Folder created" });
  } catch (err) {
    console.error("Folder create error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/files/upload — upload file(s) to a folder
router.post(
  "/upload",
  authMiddleware,
  upload.array("files", 20),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const targetPath = req.query.path || "";
      const uploaded = [];

      for (const file of req.files) {
        const filePath = path.join(UPLOADS_DIR, targetPath, file.filename);

        // Try to compress image if over 150KB
        const compressionResult = await compressImage(filePath);

        const finalStats = fs.statSync(filePath);

        uploaded.push({
          name: file.filename,
          originalName: file.originalname,
          path: targetPath ? `${targetPath}/${file.filename}` : file.filename,
          size: finalStats.size,
          originalSize: compressionResult
            ? compressionResult.originalSize
            : file.size,
          compressed: !!compressionResult,
        });
      }

      res.status(201).json({ message: "Files uploaded", files: uploaded });
    } catch (err) {
      console.error("File upload error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
);

module.exports = router;
