const express = require("express");
const router = express.Router();
const puntosController = require("../controllers/puntosController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/crear", authMiddleware, puntosController.crearPunto);

module.exports = router;