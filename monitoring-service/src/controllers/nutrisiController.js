const db = require("../config/db");

exports.createNutrisi = async (req, res) => {
  try {
    const { tanaman_id, jenis_nutrisi, jumlah_ml, tanggal_pemberian, keterangan } = req.body;

    await db.query(
      "INSERT INTO nutrisi (tanaman_id, jenis_nutrisi, jumlah_ml, tanggal_pemberian, keterangan) VALUES (?, ?, ?, ?, ?)",
      [tanaman_id, jenis_nutrisi, jumlah_ml, tanggal_pemberian, keterangan]
    );

    res.status(201).json({ message: "Data nutrisi berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNutrisi = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT nutrisi.*, tanaman.nama_tanaman
      FROM nutrisi
      LEFT JOIN tanaman ON nutrisi.tanaman_id = tanaman.id
      ORDER BY nutrisi.id DESC
    `);

    res.json({ message: "Data nutrisi", data: rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNutrisiById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM nutrisi WHERE id = ?", [req.params.id]);
    res.json({ message: "Detail nutrisi", data: rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateNutrisi = async (req, res) => {
  try {
    const { tanaman_id, jenis_nutrisi, jumlah_ml, tanggal_pemberian, keterangan } = req.body;

    await db.query(
      "UPDATE nutrisi SET tanaman_id=?, jenis_nutrisi=?, jumlah_ml=?, tanggal_pemberian=?, keterangan=? WHERE id=?",
      [tanaman_id, jenis_nutrisi, jumlah_ml, tanggal_pemberian, keterangan, req.params.id]
    );

    res.json({ message: "Data nutrisi berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteNutrisi = async (req, res) => {
  try {
    await db.query("DELETE FROM nutrisi WHERE id = ?", [req.params.id]);
    res.json({ message: "Data nutrisi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};