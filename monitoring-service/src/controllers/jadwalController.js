const db = require("../config/db");

exports.createJadwal = async (req, res) => {
  try {
    const { tanaman_id, kegiatan, tanggal_jadwal, status, catatan } = req.body;

    await db.query(
      "INSERT INTO jadwal_perawatan (tanaman_id, kegiatan, tanggal_jadwal, status, catatan) VALUES (?, ?, ?, ?, ?)",
      [tanaman_id, kegiatan, tanggal_jadwal, status, catatan]
    );

    res.status(201).json({ message: "Jadwal perawatan berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJadwal = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT jadwal_perawatan.*, tanaman.nama_tanaman
      FROM jadwal_perawatan
      LEFT JOIN tanaman ON jadwal_perawatan.tanaman_id = tanaman.id
      ORDER BY jadwal_perawatan.id DESC
    `);

    res.json({ message: "Data jadwal perawatan", data: rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJadwalById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM jadwal_perawatan WHERE id = ?", [req.params.id]);
    res.json({ message: "Detail jadwal", data: rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateJadwal = async (req, res) => {
  try {
    const { tanaman_id, kegiatan, tanggal_jadwal, status, catatan } = req.body;

    await db.query(
      "UPDATE jadwal_perawatan SET tanaman_id=?, kegiatan=?, tanggal_jadwal=?, status=?, catatan=? WHERE id=?",
      [tanaman_id, kegiatan, tanggal_jadwal, status, catatan, req.params.id]
    );

    res.json({ message: "Jadwal perawatan berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteJadwal = async (req, res) => {
  try {
    await db.query("DELETE FROM jadwal_perawatan WHERE id = ?", [req.params.id]);
    res.json({ message: "Jadwal perawatan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};