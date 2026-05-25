const express = require("express");
const router = express.Router();
const tanamanController = require("../controllers/tanamanController");

router.post("/", tanamanController.createTanaman);
router.get("/", tanamanController.getTanaman);
router.get("/:id", tanamanController.getTanamanById);
router.put("/:id", tanamanController.updateTanaman);
router.delete("/:id", tanamanController.deleteTanaman);

module.exports = router;