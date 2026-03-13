const db = require("../config/db");

exports.crearPunto = async (req, res) => {
    const { id_tour, id_lugar, orden, punto_reunion } = req.body;

    try {
        const [result] = await db.query(
            "INSERT INTO puntos_tour (id_tour, id_lugar, orden, punto_reunion, visitado) VALUES (?, ?, ?, ?, false)",
            [id_tour, id_lugar, orden, punto_reunion]
        );
        res.json({
            mensaje: "Punto agregado al tour",
            id_punto: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al agregar punto" });
    }
};