const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// registrar guía
exports.registerGuia = async (req, res) => {

    try {

        const { nombre, apeP, apeM, email, password, telefono } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            `INSERT INTO guias
            (nombre, apeP, apeM, email, password, telefono)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre, apeP, apeM, email, hashedPassword, telefono]
        );

        res.json({
            mensaje: "Guía registrado correctamente",
            id_guia: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al registrar guía"
        });

    }

};


// login guía
exports.loginGuia = async (req, res) => {

    try {

        const { email, password } = req.body;

        const [rows] = await db.query(
            "SELECT * FROM guias WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                error: "Usuario no encontrado"
            });
        }

        const guia = rows[0];

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
            token,
            guia: {
                id: guia.id_guia,
                nombre: guia.nombre
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error del servidor"
        });

    }

};