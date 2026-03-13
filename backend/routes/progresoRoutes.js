const express = require("express");
const router = express.Router();
const progresoController = require("../controllers/progresoController");
const authMiddleware = require("../middleware/authMiddleware"); // si aplica

// actualizar progreso de un tour
router.patch("/:id", authMiddleware, progresoController.actualizarProgreso);

// exportar correctamente el router
module.exports = router;