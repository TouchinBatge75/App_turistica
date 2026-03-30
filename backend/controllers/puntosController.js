const db = require("../config/db");

exports.crearPunto = async (req, res) => {

    try {

        const { id_tour, id_lugar, orden, punto_reunion } = req.body;

        if (!id_tour || !id_lugar || !orden) {
            return res.status(400).json({
                error: "Faltan datos obligatorios"
            });
        }

        const [existe] = await db.query(
            "SELECT id_punto FROM puntos_tour WHERE id_tour = ? AND orden = ?",
            [id_tour, orden]
        );

        if (existe.length > 0) {
            return res.status(400).json({
                error: "Ya existe un punto con ese orden"
            });
        }

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

        res.status(500).json({
            error: "Error al agregar punto"
        });

    }

};