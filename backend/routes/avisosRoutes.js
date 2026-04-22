const express = require("express");
const router = express.Router();
const avisosController = require("../controllers/avisosController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/crear", authMiddleware, avisosController.crearAviso);
router.get("/:id", avisosController.obtenerAvisos);

module.exports = router;