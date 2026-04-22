const db = require("../config/db");

exports.crearAviso = async (req, res) => {
    const { id_tour, mensaje, tipo } = req.body;
    const fecha_envio = new Date();

    try {
        const [result] = await db.query(
            "INSERT INTO avisos (id_tour, mensaje, tipo, fecha_envio) VALUES (?, ?, ?, ?)",
            [id_tour, mensaje, tipo, fecha_envio]
        );
        res.json({
            mensaje: "Aviso creado",
            id_aviso: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear aviso" });
    }
};

exports.obtenerAvisos = async (req, res) => {
    const id_tour = req.params.id;

    try {
        const [rows] = await db.query(
            `SELECT id_aviso, mensaje, tipo, fecha_envio
             FROM avisos
             WHERE id_tour = ?
             ORDER BY fecha_envio DESC`,
            [id_tour]
        );

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener avisos" });
    }
};