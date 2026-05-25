const db = require("../config/db");

exports.createTanaman = async (req, res) => {
  try {
    const { nama_tanaman, jenis_tanaman, tanggal_tanam, status, user_id } = req.body;

    await db.query(
      "INSERT INTO tanaman (nama_tanaman, jenis_tanaman, tanggal_tanam, status, user_id) VALUES (?, ?, ?, ?, ?)",
      [nama_tanaman, jenis_tanaman, tanggal_tanam, status, user_id]
    );

    res.status(201).json({ message: "Data tanaman berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTanaman = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tanaman ORDER BY id DESC");
    res.json({ message: "Data tanaman", data: rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTanamanById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tanaman WHERE id = ?", [req.params.id]);
    res.json({ message: "Detail tanaman", data: rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTanaman = async (req, res) => {
  try {
    const { nama_tanaman, jenis_tanaman, tanggal_tanam, status, user_id } = req.body;

    await db.query(
      "UPDATE tanaman SET nama_tanaman=?, jenis_tanaman=?, tanggal_tanam=?, status=?, user_id=? WHERE id=?",
      [nama_tanaman, jenis_tanaman, tanggal_tanam, status, user_id, req.params.id]
    );

    res.json({ message: "Data tanaman berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTanaman = async (req, res) => {
  try {
    await db.query("DELETE FROM tanaman WHERE id = ?", [req.params.id]);
    res.json({ message: "Data tanaman berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};