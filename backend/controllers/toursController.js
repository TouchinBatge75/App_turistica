const db = require("../config/db");
const QRCode = require("qrcode");

// Crear un tour
exports.crearTour = async (req, res) => {

    try {

        const { nombre, descripcion, fecha, hora } = req.body;
        const id_guia = req.guiaId;

        const sql = `
        INSERT INTO tours
        (id_guia, nombre, descripcion, fecha, hora)
        VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            id_guia,
            nombre,
            descripcion,
            fecha,
            hora
        ]);

        const id_tour = result.insertId;

        // URL del tour
        const urlTour = `${process.env.BASE_URL}/web-turista/tour.html?id=${id_tour}`;

        // generar QR
        const qrDataURL = await QRCode.toDataURL(urlTour);

        // guardar QR en BD
        await db.query(
            "UPDATE tours SET codigo_qr = ? WHERE id_tour = ?",
            [qrDataURL, id_tour]
        );

        res.json({
            mensaje: "Tour creado con éxito",
            id_tour,
            qr: qrDataURL,
            url: urlTour
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al crear tour"
        });

    }

};


// Obtener puntos de un tour
exports.obtenerPuntosTour = async (req, res) => {

    try {

        const { id } = req.params;

        const [puntos] = await db.query(`
            SELECT 
                p.id_punto,
                p.orden,
                p.punto_reunion,
                l.id_lugar,
                l.nombre,
                l.descripcion,
                l.latitud,
                l.longitud
            FROM puntos_tour p
            JOIN lugares l ON p.id_lugar = l.id_lugar
            WHERE p.id_tour = ?
            ORDER BY p.orden ASC
        `, [id]);

        res.json(puntos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al obtener puntos del tour"
        });

    }

};