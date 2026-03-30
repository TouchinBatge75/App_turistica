const db = require("../config/db");

exports.actualizarProgreso = async (req, res) => {

    const id_tour = req.params.id;
    const { id_punto_actual, latitud_actual, longitud_actual } = req.body;

    try {

        const sql = `
        INSERT INTO progreso_tour 
        (id_tour, id_punto_actual, latitud_actual, longitud_actual, fecha_cambio)
        VALUES (?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
        id_punto_actual = VALUES(id_punto_actual),
        latitud_actual = VALUES(latitud_actual),
        longitud_actual = VALUES(longitud_actual),
        fecha_cambio = NOW()
        `;

        const [result] = await db.query(sql, [
            id_tour,
            id_punto_actual,
            latitud_actual,
            longitud_actual
        ]);

        res.json({
            mensaje: "Progreso actualizado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al actualizar progreso"
        });

    }

};