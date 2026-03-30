// cargar variables de entorno
require("dotenv").config();

// importar librerías
const express = require("express");
const cors = require("cors");
const path = require("path");

// importar conexión a base de datos
const db = require("./config/db");

// importar rutas
const guiasRoutes = require("./routes/guiasRoutes");
const toursRoutes = require("./routes/toursRoutes");
const avisosRoutes = require("./routes/avisosRoutes");
const puntosRoutes = require("./routes/puntosRoutes");
const progresoRoutes = require("./routes/progresoRoutes");

// crear app
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/web-turista")));

// puerto del servidor
const PORT = process.env.PORT || 3000;

// prueba de servidor
app.get("/", (req, res) => {
    res.json({
        mensaje: "API de App Turística funcionando 🚀"
    });
});

// rutas del API
app.use("/api/guias", guiasRoutes);
app.use("/api/tours", toursRoutes);
app.use("/api/avisos", avisosRoutes);
app.use("/api/puntos", puntosRoutes);
app.use("/api/progreso", progresoRoutes);

// iniciar servidor
app.listen(PORT, () => {
    console.log("=================================");
    console.log("Servidor iniciado correctamente");
    console.log("Puerto:", PORT);
    console.log("URL: http://localhost:" + PORT);
    console.log("=================================");
});