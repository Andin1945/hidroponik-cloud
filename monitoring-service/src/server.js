const express = require("express");
const cors = require("cors");
require("dotenv").config();

const tanamanRoutes = require("./routes/tanamanRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const monitoringRoutes = require("./routes/monitoringRoutes");
const nutrisiRoutes = require("./routes/nutrisiRoutes");
const jadwalRoutes = require("./routes/jadwalRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Monitoring Service Hidroponik berjalan",
  });
});

app.use("/api/tanaman", tanamanRoutes);
app.use("/api/sensor", sensorRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use("/api/nutrisi", nutrisiRoutes);
app.use("/api/jadwal", jadwalRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Monitoring Service running on port ${PORT}`);
});