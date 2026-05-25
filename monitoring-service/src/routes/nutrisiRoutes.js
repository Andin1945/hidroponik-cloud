const express = require("express");
const router = express.Router();
const nutrisiController = require("../controllers/nutrisiController");

router.post("/", nutrisiController.createNutrisi);
router.get("/", nutrisiController.getNutrisi);
router.get("/:id", nutrisiController.getNutrisiById);
router.put("/:id", nutrisiController.updateNutrisi);
router.delete("/:id", nutrisiController.deleteNutrisi);

module.exports = router;