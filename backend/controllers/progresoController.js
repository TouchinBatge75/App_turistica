const db = require("../config/db");

exports.actualizarProgreso = async (req, res) => {
    const id_tour = req.params.id;
    const { id_punto_actual, latitud_actual, longitud_actual } = req.body;

    try {
        // Verificar si ya existe un progreso para este tour
        const [rows] = await db.query("SELECT * FROM progreso_tour WHERE id_tour = ?", [id_tour]);

        if(rows.length > 0){
            await db.query(
                "UPDATE progreso_tour SET id_punto_actual = ?, latitud_actual = ?, longitud_actual = ?, fecha_cambio = NOW() WHERE id_tour = ?",
                [id_punto_actual, latitud_actual, longitud_actual, id_tour]
            );
        } else {
            await db.query(
                "INSERT INTO progreso_tour (id_tour, id_punto_actual, latitud_actual, longitud_actual, fecha_cambio) VALUES (?, ?, ?, ?, NOW())",
                [id_tour, id_punto_actual, latitud_actual, longitud_actual]
            );
        }

        res.json({ mensaje: "Progreso del tour actualizado" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar progreso" });
    }
};