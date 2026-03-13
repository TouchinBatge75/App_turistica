const express = require("express");
const router = express.Router();
const toursController = require("../controllers/toursController");
const authMiddleware = require("../middleware/authMiddleware");

// Crear tour
router.post("/crear", authMiddleware, toursController.crearTour);

module.exports = router;