const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "Token requerido" });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) return res.status(401).json({ error: "Token inválido" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.guiaId = decoded.id_guia;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido" });
    }

};