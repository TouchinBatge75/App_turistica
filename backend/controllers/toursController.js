const db = require("../config/db");
const QRCode = require("qrcode");

// Crear un tour
exports.crearTour = async (req, res) => {

    const { nombre, descripcion, fecha, hora } = req.body;
    const id_guia = req.guiaId; // Esto lo sacaremos del token JWT

    const sql = `
        INSERT INTO tours
        (id_guia, nombre, descripcion, fecha, hora)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [id_guia, nombre, descripcion, fecha, hora], async (err, result) => {

        if (err) return res.status(500).json({ error: "Error al crear tour" });

        const id_tour = result.insertId;

        // Generar QR apuntando a la URL del tour
        const urlTour = `${process.env.BASE_URL}/web-turista/tour.html?id=${id_tour}`;

        try {
            const qrDataURL = await QRCode.toDataURL(urlTour);

            // Guardar código QR en la BD
            db.query(
                "UPDATE tours SET codigo_qr = ? WHERE id_tour = ?",
                [qrDataURL, id_tour],
                (err2) => {
                    if (err2) console.error(err2);
                    // Retornar datos
                    res.json({
                        mensaje: "Tour creado con éxito",
                        id_tour,
                        qr: qrDataURL,
                        url: urlTour
                    });
                }
            );

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al generar QR" });
        }

    });

};