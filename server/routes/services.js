const express = require("express");
const fs = require("fs");
const path = require("path");
const pool = require("../config/db");
const authMiddleware = require("../middleware/auth");
const { createUpload } = require("../utils/multer");

const router = express.Router();
const SUBFOLDER = "services";
const upload = createUpload(SUBFOLDER);

function deleteFileIfExists(relativePath) {
  if (!relativePath) return;
  const fullPath = path.join(__dirname, "..", relativePath);
  fs.unlink(fullPath, () => {});
}

const UPLOAD_FIELDS = [
  { name: "card_image", maxCount: 1 },
  { name: "page_image", maxCount: 1 },
];

// GET /api/services — public list with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [countResult] = await pool.query("SELECT COUNT(*) AS total FROM services");
    const total = countResult[0].total;

    const [rows] = await pool.query(
      "SELECT * FROM services ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.json({ data: rows, total, page, limit });
  } catch (err) {
    console.error("Services list error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/services/:id — public single service
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM services WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Service get error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/services — protected create
router.post("/", authMiddleware, upload.fields(UPLOAD_FIELDS), async (req, res) => {
  try {
    const body = req.body;
    const card_image = req.files?.card_image?.[0]
      ? `uploads/${SUBFOLDER}/${req.files.card_image[0].filename}`
      : null;
    const page_image = req.files?.page_image?.[0]
      ? `uploads/${SUBFOLDER}/${req.files.page_image[0].filename}`
      : null;

    const parseJSON = (val) => {
      if (val === undefined || val === null || val === "") return null;
      return JSON.stringify(typeof val === "string" ? JSON.parse(val) : val);
    };

    const title = parseJSON(body.title);
    const slug = parseJSON(body.slug);
    const description = parseJSON(body.description);
    const article = parseJSON(body.article);
    const meta_title = parseJSON(body.meta_title);
    const meta_description = parseJSON(body.meta_description);
    const canonical = parseJSON(body.canonical);

    const [result] = await pool.query(
      `INSERT INTO services (card_image, page_image, title, slug, description, article, meta_title, meta_description, canonical, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [card_image, page_image, title, slug, description, article, meta_title, meta_description, canonical, body.status || 0]
    );

    const [created] = await pool.query("SELECT * FROM services WHERE id = ?", [result.insertId]);
    res.status(201).json(created[0]);
  } catch (err) {
    console.error("Service create error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/services/:id — protected update
router.put("/:id", authMiddleware, upload.fields(UPLOAD_FIELDS), async (req, res) => {
  try {
    const [existing] = await pool.query("SELECT * FROM services WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    const body = req.body;
    const ex = existing[0];

    const newCardFile = req.files?.card_image?.[0];
    const newPageFile = req.files?.page_image?.[0];
    const card_image = newCardFile
      ? `uploads/${SUBFOLDER}/${newCardFile.filename}`
      : ex.card_image;
    const page_image = newPageFile
      ? `uploads/${SUBFOLDER}/${newPageFile.filename}`
      : ex.page_image;

    // Clean up old files if replaced
    if (newCardFile && ex.card_image) deleteFileIfExists(ex.card_image);
    if (newPageFile && ex.page_image) deleteFileIfExists(ex.page_image);

    const parseJSON = (val, fallback) => {
      if (val === undefined) return fallback;
      if (val === null || val === "") return null;
      return JSON.stringify(typeof val === "string" ? JSON.parse(val) : val);
    };

    const title = parseJSON(body.title, ex.title);
    const slug = parseJSON(body.slug, ex.slug);
    const description = parseJSON(body.description, ex.description);
    const article = parseJSON(body.article, ex.article);
    const meta_title = parseJSON(body.meta_title, ex.meta_title);
    const meta_description = parseJSON(body.meta_description, ex.meta_description);
    const canonical = parseJSON(body.canonical, ex.canonical);
    const status = body.status !== undefined ? body.status : ex.status;

    await pool.query(
      `UPDATE services SET card_image=?, page_image=?, title=?, slug=?, description=?, article=?, meta_title=?, meta_description=?, canonical=?, status=? WHERE id=?`,
      [card_image, page_image, title, slug, description, article, meta_title, meta_description, canonical, status, req.params.id]
    );

    const [updated] = await pool.query("SELECT * FROM services WHERE id = ?", [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error("Service update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/services/:id — protected delete
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const [existing] = await pool.query("SELECT * FROM services WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (existing[0].card_image) deleteFileIfExists(existing[0].card_image);
    if (existing[0].page_image) deleteFileIfExists(existing[0].page_image);

    await pool.query("DELETE FROM services WHERE id = ?", [req.params.id]);
    res.json({ message: "Service deleted" });
  } catch (err) {
    console.error("Service delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
