const express = require("express");
const router = express.Router();
const monitoringController = require("../controllers/monitoringController");

router.post("/", monitoringController.createMonitoring);
router.get("/", monitoringController.getMonitoring);
router.get("/:id", monitoringController.getMonitoringById);
router.put("/:id", monitoringController.updateMonitoring);
router.delete("/:id", monitoringController.deleteMonitoring);

module.exports = router;