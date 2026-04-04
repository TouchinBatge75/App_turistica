const db = require("../config/db");

exports.actualizarProgreso = async (req, res) => {

    const id_tour = req.params.id;
    const { id_punto_actual, latitud_actual, longitud_actual } = req.body;

    try {

        await db.query(`
            INSERT INTO progreso_tour 
            (id_tour, id_punto_actual, latitud_actual, longitud_actual, fecha_cambio)
            VALUES (?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE
                id_punto_actual = VALUES(id_punto_actual),
                latitud_actual = VALUES(latitud_actual),
                longitud_actual = VALUES(longitud_actual),
                fecha_cambio = NOW()
        `, [id_tour, id_punto_actual, latitud_actual, longitud_actual]);

        res.json({ mensaje: "Progreso actualizado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar progreso" });
    }

};

exports.obtenerProgreso = async (req, res) => {

    const id_tour = req.params.id;

    try {

        const [rows] = await db.query(
            "SELECT * FROM progreso_tour WHERE id_tour = ?",
            [id_tour]
        );

        res.json(rows[0] || null);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener progreso" });
    }

};