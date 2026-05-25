const db = require("../config/db");

exports.createNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        message: "Title dan message wajib diisi",
      });
    }

    await db.query(
      "INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)",
      [title, message, type || "info"]
    );

    res.status(201).json({
      message: "Notifikasi berhasil dibuat",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat notifikasi",
      error: error.message,
    });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM notifications ORDER BY id DESC LIMIT 20"
    );

    res.json({
      message: "Data notifikasi",
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil notifikasi",
      error: error.message,
    });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS total FROM notifications WHERE is_read = 0"
    );

    res.json({
      message: "Jumlah notifikasi belum dibaca",
      total: rows[0].total,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil jumlah notifikasi",
      error: error.message,
    });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await db.query("UPDATE notifications SET is_read = 1 WHERE is_read = 0");

    res.json({
      message: "Semua notifikasi sudah dibaca",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal update notifikasi",
      error: error.message,
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    await db.query("DELETE FROM notifications WHERE id = ?", [req.params.id]);

    res.json({
      message: "Notifikasi berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus notifikasi",
      error: error.message,
    });
  }
};