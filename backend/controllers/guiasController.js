const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// registrar guía
exports.registerGuia = async (req, res) => {

    const { nombre, apeP, apeM, email, password, telefono } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO guias 
            (nombre, apeP, apeM, email, password, telefono) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [nombre, apeP, apeM, email, hashedPassword, telefono],
            (err, result) => {

                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        error: "Error al registrar guía"
                    });
                }

                res.json({
                    mensaje: "Guía registrado correctamente",
                    id_guia: result.insertId
                });

            }
        );

    } catch (error) {

        res.status(500).json({
            error: "Error en el servidor"
        });

    }

};


// login guía
exports.loginGuia = (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM guias WHERE email = ?";

    db.query(sql, [email], async (err, results) => {

        if (err) {
            return res.status(500).json({
                error: "Error del servidor"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                error: "Usuario no encontrado"
            });
        }

        const guia = results[0];

        const passwordValida = await bcrypt.compare(password, guia.password);

        if (!passwordValida) {
            return res.status(401).json({
                error: "Contraseña incorrecta"
            });
        }

        const token = jwt.sign(
            { id_guia: guia.id_guia },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.json({
            mensaje: "Login correcto",
            token: token,
            guia: {
                id: guia.id_guia,
                nombre: guia.nombre
            }
        });

    });

};