const express = require("express");
const router = express.Router();

const guiasController = require("../controllers/guiasController");

// prueba
router.get("/", (req, res) => {
    res.json({ mensaje: "Ruta de guías funcionando" });
});

// registro de guía
router.post("/register", guiasController.registerGuia);

router.post("/login", guiasController.loginGuia);

module.exports = router;