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