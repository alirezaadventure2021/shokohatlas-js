const express = require("express");
const pool = require("../config/db");

const router = express.Router();

function parseLangField(val, lang) {
  if (!val) return "";
  try {
    const obj = typeof val === "string" ? JSON.parse(val) : val;
    return obj[lang] || obj.en || Object.values(obj)[0] || "";
  } catch {
    return val;
  }
}

function parseAllLangFields(val) {
  if (!val) return {};
  try {
    return typeof val === "string" ? JSON.parse(val) : val;
  } catch {
    return {};
  }
}

// GET /api/headerProducts?lang=en
router.get("/headerProducts", async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const [rows] = await pool.query(
      "SELECT id, slug, name, photo, status FROM products WHERE status = 1 ORDER BY created_at DESC"
    );
    const products = rows.map((p) => ({
      id: p.id,
      slug: parseLangField(p.slug, lang),
      slug_all: parseAllLangFields(p.slug),
      name: parseLangField(p.name, lang),
      photo: p.photo,
    }));
    res.json(products);
  } catch (err) {
    console.error("Header products error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/headerServices?lang=en
router.get("/headerServices", async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const [rows] = await pool.query(
      "SELECT id, slug, title, description, card_image, page_image, status FROM services WHERE status = 1 ORDER BY created_at DESC"
    );
    const services = rows.map((s) => ({
      id: s.id,
      slug: parseLangField(s.slug, lang),
      slug_all: parseAllLangFields(s.slug),
      name: parseLangField(s.title, lang),
      description: parseLangField(s.description, lang),
      photo: s.card_image,
      page_image: s.page_image,
    }));
    res.json(services);
  } catch (err) {
    console.error("Header services error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/getAllBlogs?lang=en
router.get("/getAllBlogs", async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const [rows] = await pool.query(
      "SELECT * FROM blogs WHERE status = 1 ORDER BY published_date DESC"
    );
    const blogs = rows.map((b) => ({
      id: b.id,
      title: parseLangField(b.title, lang),
      slug: parseLangField(b.slug, lang),
      slug_all: parseAllLangFields(b.slug),
      description: parseLangField(b.description, lang),
      photo: b.card_image,
      card_bg: b.card_bg,
      published_date: b.published_date,
    }));
    res.json(blogs);
  } catch (err) {
    console.error("Get all blogs error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/getLatestBlogs?lang=en
router.get("/getLatestBlogs", async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const [rows] = await pool.query(
      "SELECT * FROM blogs WHERE status = 1 ORDER BY published_date DESC LIMIT 5"
    );
    const blogs = rows.map((b) => ({
      id: b.id,
      title: parseLangField(b.title, lang),
      slug: parseLangField(b.slug, lang),
      slug_all: parseAllLangFields(b.slug),
      description: parseLangField(b.description, lang),
      photo: b.card_image,
      card_bg: b.card_bg,
      published_date: b.published_date,
    }));
    res.json(blogs);
  } catch (err) {
    console.error("Get latest blogs error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/getProduct/:slug?lang=en
router.get("/getProduct/:slug", async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const [rows] = await pool.query("SELECT * FROM products WHERE status = 1");
    const product = rows.find(
      (p) => parseLangField(p.slug, lang) === req.params.slug
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const [images] = await pool.query(
      "SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order",
      [product.id]
    );

    res.json({
      id: product.id,
      name: parseLangField(product.name, lang),
      slug: parseLangField(product.slug, lang),
      slug_all: parseAllLangFields(product.slug),
      description: parseLangField(product.description, lang),
      article: parseLangField(product.article, lang),
      properties: parseLangField(product.properties, lang),
      meta_title: parseLangField(product.meta_title, lang),
      meta_description: parseLangField(product.meta_description, lang),
      canonical: parseLangField(product.canonical, lang),
      photo: product.photo,
      images: images.map((img) => ({
        id: img.id,
        path: img.path,
        alt: img.alt,
      })),
    });
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/getService/:slug?lang=en
router.get("/getService/:slug", async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const [rows] = await pool.query("SELECT * FROM services WHERE status = 1");
    const service = rows.find(
      (s) => parseLangField(s.slug, lang) === req.params.slug
    );
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({
      id: service.id,
      title: parseLangField(service.title, lang),
      slug: parseLangField(service.slug, lang),
      slug_all: parseAllLangFields(service.slug),
      description: parseLangField(service.description, lang),
      article: parseLangField(service.article, lang),
      meta_title: parseLangField(service.meta_title, lang),
      meta_description: parseLangField(service.meta_description, lang),
      canonical: parseLangField(service.canonical, lang),
      photo: service.page_image,
      card_image: service.card_image,
    });
  } catch (err) {
    console.error("Get service error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/getBlog/:slug?lang=en
router.get("/getBlog/:slug", async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const [rows] = await pool.query("SELECT * FROM blogs WHERE status = 1");
    const blog = rows.find(
      (b) => parseLangField(b.slug, lang) === req.params.slug
    );
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({
      id: blog.id,
      title: parseLangField(blog.title, lang),
      slug: parseLangField(blog.slug, lang),
      slug_all: parseAllLangFields(blog.slug),
      description: parseLangField(blog.description, lang),
      article: parseLangField(blog.article, lang),
      meta_title: parseLangField(blog.meta_title, lang),
      meta_description: parseLangField(blog.meta_description, lang),
      canonical: parseLangField(blog.canonical, lang),
      photo: blog.card_image,
      card_bg: blog.card_bg,
      published_date: blog.published_date,
      selva_generator: parseLangField(blog.selva_generator, lang),
    });
  } catch (err) {
    console.error("Get blog error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
