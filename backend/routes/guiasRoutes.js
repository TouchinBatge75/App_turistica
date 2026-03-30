const express = require("express");
const router = express.Router();

const guiasController = require("../controllers/guiasController");

console.log("GUIAS CONTROLLER:", guiasController);

router.get("/", (req, res) => {
    res.json({ mensaje: "Ruta de guías funcionando" });
});

router.post("/register", guiasController.registerGuia);
router.post("/login", guiasController.loginGuia);

module.exports = router;