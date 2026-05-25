const db = require("../config/db");

exports.createMonitoring = async (req, res) => {
  try {
    const { tanaman_id, sensor_id, ph, suhu_air, ppm, kelembaban, waktu_monitoring } = req.body;

    await db.query(
      "INSERT INTO monitoring (tanaman_id, sensor_id, ph, suhu_air, ppm, kelembaban, waktu_monitoring) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [tanaman_id, sensor_id, ph, suhu_air, ppm, kelembaban, waktu_monitoring]
    );

    res.status(201).json({ message: "Data monitoring berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMonitoring = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT monitoring.*, tanaman.nama_tanaman, sensor.nama_sensor
      FROM monitoring
      LEFT JOIN tanaman ON monitoring.tanaman_id = tanaman.id
      LEFT JOIN sensor ON monitoring.sensor_id = sensor.id
      ORDER BY monitoring.id DESC
    `);

    res.json({ message: "Data monitoring", data: rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMonitoringById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM monitoring WHERE id = ?", [req.params.id]);
    res.json({ message: "Detail monitoring", data: rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMonitoring = async (req, res) => {
  try {
    const { tanaman_id, sensor_id, ph, suhu_air, ppm, kelembaban, waktu_monitoring } = req.body;

    await db.query(
      "UPDATE monitoring SET tanaman_id=?, sensor_id=?, ph=?, suhu_air=?, ppm=?, kelembaban=?, waktu_monitoring=? WHERE id=?",
      [tanaman_id, sensor_id, ph, suhu_air, ppm, kelembaban, waktu_monitoring, req.params.id]
    );

    res.json({ message: "Data monitoring berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMonitoring = async (req, res) => {
  try {
    await db.query("DELETE FROM monitoring WHERE id = ?", [req.params.id]);
    res.json({ message: "Data monitoring berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};