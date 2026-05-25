const express = require("express");
const router = express.Router();
const sensorController = require("../controllers/sensorController");

router.post("/", sensorController.createSensor);
router.get("/", sensorController.getSensor);
router.get("/:id", sensorController.getSensorById);
router.put("/:id", sensorController.updateSensor);
router.delete("/:id", sensorController.deleteSensor);

module.exports = router;