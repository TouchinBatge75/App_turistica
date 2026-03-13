const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tours_db"
});

db.connect((err) => {
    if (err) {
        console.error("Error de conexión:", err);
        return;
    }

    console.log("Conectado a MySQL");
});

module.exports = db;