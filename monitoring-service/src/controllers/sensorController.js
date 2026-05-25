const db = require("../config/db");

exports.createSensor = async (req, res) => {
  try {
    const { nama_sensor, tipe_sensor, lokasi, status } = req.body;

    await db.query(
      "INSERT INTO sensor (nama_sensor, tipe_sensor, lokasi, status) VALUES (?, ?, ?, ?)",
      [nama_sensor, tipe_sensor, lokasi, status]
    );

    res.status(201).json({ message: "Data sensor berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSensor = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM sensor ORDER BY id DESC");
    res.json({ message: "Data sensor", data: rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSensorById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM sensor WHERE id = ?", [req.params.id]);
    res.json({ message: "Detail sensor", data: rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSensor = async (req, res) => {
  try {
    const { nama_sensor, tipe_sensor, lokasi, status } = req.body;

    await db.query(
      "UPDATE sensor SET nama_sensor=?, tipe_sensor=?, lokasi=?, status=? WHERE id=?",
      [nama_sensor, tipe_sensor, lokasi, status, req.params.id]
    );

    res.json({ message: "Data sensor berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSensor = async (req, res) => {
  try {
    await db.query("DELETE FROM sensor WHERE id = ?", [req.params.id]);
    res.json({ message: "Data sensor berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};