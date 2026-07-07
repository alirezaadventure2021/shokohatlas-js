const express = require("express");
const fs = require("fs");
const path = require("path");
const pool = require("../config/db");
const authMiddleware = require("../middleware/auth");
const { createUpload } = require("../utils/multer");

const router = express.Router();
const SUBFOLDER = "products";
const upload = createUpload(SUBFOLDER);

function deleteFileIfExists(relativePath) {
  if (!relativePath) return;
  const fullPath = path.join(__dirname, "..", relativePath);
  fs.unlink(fullPath, () => {});
}

const UPLOAD_FIELDS = [
  { name: "photo", maxCount: 1 },
  { name: "images", maxCount: 20 },
];

// GET /api/products — public list with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [countResult] = await pool.query(
      "SELECT COUNT(*) AS total FROM products",
    );
    const total = countResult[0].total;

    const [rows] = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset],
    );

    // Attach images to each product
    for (const product of rows) {
      const [images] = await pool.query(
        "SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order",
        [product.id],
      );
      product.images = images;
    }

    res.json({ data: rows, total, page, limit });
  } catch (err) {
    console.error("Products list error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/products/:id — public single product
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = rows[0];
    const [images] = await pool.query(
      "SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order",
      [product.id],
    );
    product.images = images;

    res.json(product);
  } catch (err) {
    console.error("Product get error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/products — protected create
router.post(
  "/",
  authMiddleware,
  upload.fields(UPLOAD_FIELDS),
  async (req, res) => {
    try {
      const body = req.body;
      const photo = req.files?.photo?.[0]
        ? `uploads/products/${req.files.photo[0].filename}`
        : null;

      const name = body.name
        ? JSON.stringify(
            typeof body.name === "string" ? JSON.parse(body.name) : body.name,
          )
        : null;
      const slug = body.slug
        ? JSON.stringify(
            typeof body.slug === "string" ? JSON.parse(body.slug) : body.slug,
          )
        : null;
      const properties = body.properties
        ? JSON.stringify(
            typeof body.properties === "string"
              ? JSON.parse(body.properties)
              : body.properties,
          )
        : null;
      const description = body.description
        ? JSON.stringify(
            typeof body.description === "string"
              ? JSON.parse(body.description)
              : body.description,
          )
        : null;
      const article = body.article
        ? JSON.stringify(
            typeof body.article === "string"
              ? JSON.parse(body.article)
              : body.article,
          )
        : null;
      const meta_title = body.meta_title
        ? JSON.stringify(
            typeof body.meta_title === "string"
              ? JSON.parse(body.meta_title)
              : body.meta_title,
          )
        : null;
      const meta_description = body.meta_description
        ? JSON.stringify(
            typeof body.meta_description === "string"
              ? JSON.parse(body.meta_description)
              : body.meta_description,
          )
        : null;
      const canonical = body.canonical
        ? JSON.stringify(
            typeof body.canonical === "string"
              ? JSON.parse(body.canonical)
              : body.canonical,
          )
        : null;

      const [result] = await pool.query(
        `INSERT INTO products (photo, status, name, slug, properties, description, article, meta_title, meta_description, canonical)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          photo,
          body.status || 0,
          name,
          slug,
          properties,
          description,
          article,
          meta_title,
          meta_description,
          canonical,
        ],
      );

      const productId = result.insertId;

      // Handle additional images
      const images = req.files?.images || [];
      for (let i = 0; i < images.length; i++) {
        await pool.query(
          "INSERT INTO product_images (product_id, path, alt, display_order) VALUES (?, ?, ?, ?)",
          [
            productId,
            "uploads/products/" + images[i].filename,
            body.image_alt?.[i] || "",
            i,
          ],
        );
      }

      const [created] = await pool.query(
        "SELECT * FROM products WHERE id = ?",
        [productId],
      );
      res.status(201).json(created[0]);
    } catch (err) {
      console.error("Product create error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
);

// PUT /api/products/:id — protected update
router.put(
  "/:id",
  authMiddleware,
  upload.fields(UPLOAD_FIELDS),
  async (req, res) => {
    try {
      const [existing] = await pool.query(
        "SELECT * FROM products WHERE id = ?",
        [req.params.id],
      );
      if (existing.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      const body = req.body;
      const newPhotoFile = req.files?.photo?.[0];
      const photo =
        body.photo_remove === "true"
          ? null
          : newPhotoFile
            ? "uploads/products/" + newPhotoFile.filename
            : existing[0].photo;

      // Clean up old photo file if replaced or removed
      if (existing[0].photo && photo !== existing[0].photo) {
        deleteFileIfExists(existing[0].photo);
      }

      const name =
        body.name !== undefined
          ? JSON.stringify(
              typeof body.name === "string" ? JSON.parse(body.name) : body.name,
            )
          : existing[0].name;
      const slug =
        body.slug !== undefined
          ? JSON.stringify(
              typeof body.slug === "string" ? JSON.parse(body.slug) : body.slug,
            )
          : existing[0].slug;
      const properties =
        body.properties !== undefined
          ? JSON.stringify(
              typeof body.properties === "string"
                ? JSON.parse(body.properties)
                : body.properties,
            )
          : existing[0].properties;
      const description =
        body.description !== undefined
          ? JSON.stringify(
              typeof body.description === "string"
                ? JSON.parse(body.description)
                : body.description,
            )
          : existing[0].description;
      const article =
        body.article !== undefined
          ? JSON.stringify(
              typeof body.article === "string"
                ? JSON.parse(body.article)
                : body.article,
            )
          : existing[0].article;
      const meta_title =
        body.meta_title !== undefined
          ? body.meta_title
            ? JSON.stringify(
                typeof body.meta_title === "string"
                  ? JSON.parse(body.meta_title)
                  : body.meta_title,
              )
            : null
          : existing[0].meta_title;
      const meta_description =
        body.meta_description !== undefined
          ? body.meta_description
            ? JSON.stringify(
                typeof body.meta_description === "string"
                  ? JSON.parse(body.meta_description)
                  : body.meta_description,
              )
            : null
          : existing[0].meta_description;
      const canonical =
        body.canonical !== undefined
          ? body.canonical
            ? JSON.stringify(
                typeof body.canonical === "string"
                  ? JSON.parse(body.canonical)
                  : body.canonical,
              )
            : null
          : existing[0].canonical;
      const status =
        body.status !== undefined ? body.status : existing[0].status;

      await pool.query(
        `UPDATE products SET photo=?, status=?, name=?, slug=?, properties=?, description=?, article=?, meta_title=?, meta_description=?, canonical=? WHERE id=?`,
        [
          photo,
          status,
          name,
          slug,
          properties,
          description,
          article,
          meta_title,
          meta_description,
          canonical,
          req.params.id,
        ],
      );

      // Handle gallery: only update if explicitly sent or new files uploaded
      const newImages = req.files?.images || [];
      const galleryPaths = body.gallery_paths !== undefined
        ? JSON.parse(body.gallery_paths)
        : undefined;

      if (galleryPaths !== undefined || newImages.length > 0) {
        // Fetch current images to compare
        const [currentImages] = await pool.query(
          "SELECT path FROM product_images WHERE product_id = ? ORDER BY display_order",
          [req.params.id],
        );
        const currentPaths = currentImages.map((img) => img.path);

        // Normalize existing paths from frontend (they come as "uploads/products/..." or just filename)
        const normalizedKept = (galleryPaths || []).map((p) =>
          p.startsWith("uploads/products/") ? p : "uploads/products/" + p,
        );

        // Check if gallery actually changed
        const normalizedNewFiles = newImages.map(
          (f) => "uploads/products/" + f.filename,
        );
        const newGallery = [...normalizedKept, ...normalizedNewFiles];
        const galleryChanged =
          newGallery.length !== currentPaths.length ||
          newGallery.some((path, i) => path !== currentPaths[i]) ||
          normalizedNewFiles.length > 0;

        if (galleryChanged) {
          // Clean up files that are no longer in the gallery
          for (const oldPath of currentPaths) {
            if (!newGallery.includes(oldPath)) {
              deleteFileIfExists(oldPath);
            }
          }
          await pool.query("DELETE FROM product_images WHERE product_id = ?", [
            req.params.id,
          ]);
          for (let i = 0; i < newGallery.length; i++) {
            await pool.query(
              "INSERT INTO product_images (product_id, path, alt, display_order) VALUES (?, ?, ?, ?)",
              [req.params.id, newGallery[i], body.image_alt?.[i] || "", i],
            );
          }
        }
      }

      const [updated] = await pool.query(
        "SELECT * FROM products WHERE id = ?",
        [req.params.id],
      );
      res.json(updated[0]);
    } catch (err) {
      console.error("Product update error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
);

// DELETE /api/products/:id — protected delete
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const [existing] = await pool.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Clean up all files: gallery images + main photo
    const [galleryImages] = await pool.query(
      "SELECT path FROM product_images WHERE product_id = ?",
      [req.params.id],
    );
    for (const img of galleryImages) {
      deleteFileIfExists(img.path);
    }
    if (existing[0].photo) {
      deleteFileIfExists(existing[0].photo);
    }

    await pool.query("DELETE FROM product_images WHERE product_id = ?", [
      req.params.id,
    ]);
    await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Product delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- Product Images sub-routes ---

// GET /api/products/:id/images
router.get("/:id/images", async (req, res) => {
  try {
    const [images] = await pool.query(
      "SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order",
      [req.params.id],
    );
    res.json(images);
  } catch (err) {
    console.error("Product images list error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/products/:id/images — protected add image
router.post(
  "/:id/images",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      const [maxOrder] = await pool.query(
        "SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order FROM product_images WHERE product_id = ?",
        [req.params.id],
      );

      const [result] = await pool.query(
        "INSERT INTO product_images (product_id, path, alt, display_order) VALUES (?, ?, ?, ?)",
        [
          req.params.id,
          req.file.filename,
          req.body.alt || "",
          maxOrder[0].next_order,
        ],
      );

      const [image] = await pool.query(
        "SELECT * FROM product_images WHERE id = ?",
        [result.insertId],
      );
      res.status(201).json(image[0]);
    } catch (err) {
      console.error("Product image add error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
);

// PUT /api/products/:id/images/:imageId — protected update image
router.put(
  "/:id/images/:imageId",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const [existing] = await pool.query(
        "SELECT * FROM product_images WHERE id = ? AND product_id = ?",
        [req.params.imageId, req.params.id],
      );
      if (existing.length === 0) {
        return res.status(404).json({ message: "Image not found" });
      }

      const path_val = req.file ? req.file.filename : existing[0].path;
      const alt = req.body.alt !== undefined ? req.body.alt : existing[0].alt;
      const display_order =
        req.body.display_order !== undefined
          ? req.body.display_order
          : existing[0].display_order;

      // Clean up old file if image was replaced
      if (req.file && existing[0].path) {
        deleteFileIfExists(existing[0].path);
      }

      await pool.query(
        "UPDATE product_images SET path=?, alt=?, display_order=? WHERE id=?",
        [path_val, alt, display_order, req.params.imageId],
      );

      const [updated] = await pool.query(
        "SELECT * FROM product_images WHERE id = ?",
        [req.params.imageId],
      );
      res.json(updated[0]);
    } catch (err) {
      console.error("Product image update error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
);

// DELETE /api/products/:id/images/:imageId — protected delete image
router.delete("/:id/images/:imageId", authMiddleware, async (req, res) => {
  try {
    const [existing] = await pool.query(
      "SELECT * FROM product_images WHERE id = ? AND product_id = ?",
      [req.params.imageId, req.params.id],
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    deleteFileIfExists(existing[0].path);
    await pool.query("DELETE FROM product_images WHERE id = ?", [
      req.params.imageId,
    ]);
    res.json({ message: "Image deleted" });
  } catch (err) {
    console.error("Product image delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
