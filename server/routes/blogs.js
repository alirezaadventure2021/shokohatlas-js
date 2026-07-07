const express = require("express");
const fs = require("fs");
const path = require("path");
const pool = require("../config/db");
const authMiddleware = require("../middleware/auth");
const { createUpload } = require("../utils/multer");

const router = express.Router();
const SUBFOLDER = "blogs";
const BG_DIR = path.join(__dirname, "..", "uploads", "blogs", "bg");
const upload = createUpload(SUBFOLDER);

function deleteFileIfExists(relativePath) {
  if (!relativePath) return;
  const fullPath = path.join(__dirname, "..", relativePath);
  fs.unlink(fullPath, () => {});
}

const UPLOAD_FIELDS = [
  { name: "card_image", maxCount: 1 },
  { name: "card_bg", maxCount: 1 },
];

// GET /api/blogs/backgrounds — list available bg images
router.get("/backgrounds", authMiddleware, (req, res) => {
  try {
    if (!fs.existsSync(BG_DIR)) {
      return res.json([]);
    }
    const files = fs.readdirSync(BG_DIR).filter((f) =>
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f)
    );
    const images = files.map((f) => ({
      name: f,
      url: `http://localhost:3000/uploads/blogs/bg/${f}`,
    }));
    res.json(images);
  } catch (err) {
    console.error("Backgrounds list error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/blogs — public list with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [countResult] = await pool.query("SELECT COUNT(*) AS total FROM blogs");
    const total = countResult[0].total;

    const [rows] = await pool.query(
      "SELECT * FROM blogs ORDER BY published_date DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.json({ data: rows, total, page, limit });
  } catch (err) {
    console.error("Blogs list error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/blogs/:id — public single blog
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM blogs WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Blog get error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/blogs — protected create
router.post("/", authMiddleware, upload.fields(UPLOAD_FIELDS), async (req, res) => {
  try {
    const body = req.body;
    const card_image = req.files?.card_image?.[0]
      ? `uploads/${SUBFOLDER}/${req.files.card_image[0].filename}`
      : null;
    const card_bg = req.files?.card_bg?.[0]
      ? `uploads/${SUBFOLDER}/${req.files.card_bg[0].filename}`
      : body.card_bg_path || null;

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
    const selva_generator = parseJSON(body.selva_generator);

    const [result] = await pool.query(
      `INSERT INTO blogs (card_image, card_bg, status, title, slug, description, article, published_date, meta_title, meta_description, canonical, selva_generator)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [card_image, card_bg, body.status || 0, title, slug, description, article, body.published_date || null, meta_title, meta_description, canonical, selva_generator]
    );

    const [created] = await pool.query("SELECT * FROM blogs WHERE id = ?", [result.insertId]);
    res.status(201).json(created[0]);
  } catch (err) {
    console.error("Blog create error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/blogs/:id — protected update
router.put("/:id", authMiddleware, upload.fields(UPLOAD_FIELDS), async (req, res) => {
  try {
    const [existing] = await pool.query("SELECT * FROM blogs WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const body = req.body;
    const ex = existing[0];

    const newCardFile = req.files?.card_image?.[0];
    const newBgFile = req.files?.card_bg?.[0];
    const card_image = newCardFile
      ? `uploads/${SUBFOLDER}/${newCardFile.filename}`
      : ex.card_image;
    const card_bg = newBgFile
      ? `uploads/${SUBFOLDER}/${newBgFile.filename}`
      : body.card_bg_path || ex.card_bg;

    // Clean up old files if replaced
    if (newCardFile && ex.card_image) deleteFileIfExists(ex.card_image);
    if (newBgFile && ex.card_bg) deleteFileIfExists(ex.card_bg);

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
    const selva_generator = parseJSON(body.selva_generator, ex.selva_generator);
    const status = body.status !== undefined ? body.status : ex.status;
    const published_date = body.published_date !== undefined ? body.published_date : ex.published_date;

    await pool.query(
      `UPDATE blogs SET card_image=?, card_bg=?, status=?, title=?, slug=?, description=?, article=?, published_date=?, meta_title=?, meta_description=?, canonical=?, selva_generator=? WHERE id=?`,
      [card_image, card_bg, status, title, slug, description, article, published_date, meta_title, meta_description, canonical, selva_generator, req.params.id]
    );

    const [updated] = await pool.query("SELECT * FROM blogs WHERE id = ?", [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error("Blog update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/blogs/:id — protected delete
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const [existing] = await pool.query("SELECT * FROM blogs WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (existing[0].card_image) deleteFileIfExists(existing[0].card_image);
    if (existing[0].card_bg) deleteFileIfExists(existing[0].card_bg);

    await pool.query("DELETE FROM blogs WHERE id = ?", [req.params.id]);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    console.error("Blog delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
