const express = require("express");
const router = express.Router();
const toursController = require("../controllers/toursController");
const authMiddleware = require("../middleware/authMiddleware");

// Crear tour
router.post("/crear", authMiddleware, toursController.crearTour);
router.get("/:id/puntos", toursController.obtenerPuntosTour);

module.exports = router;