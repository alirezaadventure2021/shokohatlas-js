const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// POST /api/messages — save new message (public)
router.post("/", async (req, res) => {
  try {
    const { full_name, email, message } = req.body;

    if (!full_name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO messages (full_name, email, message) VALUES (?, ?, ?)",
      [full_name, email, message]
    );

    res.status(201).json({ id: result.insertId, message: "Message sent" });
  } catch (err) {
    console.error("Message create error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/messages/unread-count — get unread count (protected)
router.get("/unread-count", authMiddleware, async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT COUNT(*) AS count FROM messages WHERE is_read = 0"
    );
    res.json({ count: result[0].count });
  } catch (err) {
    console.error("Unread count error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/messages — list all messages (protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search, unread_only } = req.query;

    let query = "SELECT * FROM messages";
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push("(full_name LIKE ? OR email LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    if (unread_only === "true") {
      conditions.push("is_read = 0");
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Messages list error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/messages/:id — get single message + mark as read (protected)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM messages WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Mark as read
    await pool.query("UPDATE messages SET is_read = 1 WHERE id = ?", [
      req.params.id,
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error("Message get error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/messages/:id — delete message (protected)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM messages WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ message: "Message deleted" });
  } catch (err) {
    console.error("Message delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
