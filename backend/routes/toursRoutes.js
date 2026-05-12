const express = require("express");
const router = express.Router();

const toursController = require("../controllers/toursController");
const authMiddleware = require("../middleware/authMiddleware");

// Crear tour
router.post("/crear", authMiddleware, toursController.crearTour);

// Obtener info de un tour
router.get('/:id', toursController.obtenerTourPorId);

// Obtener puntos del tour
router.get("/:id/puntos", toursController.obtenerPuntosTour);

router.patch("/:id/estado", authMiddleware, toursController.actualizarEstadoTour);

module.exports = router;