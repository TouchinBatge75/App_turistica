-- =========================
-- BASE DE DATOS
-- =========================
CREATE DATABASE IF NOT EXISTS tours_db;
USE tours_db;

-- =========================
-- TABLA: guias
-- =========================
CREATE TABLE guias (
    id_guia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    apeP VARCHAR(100),
    apeM VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    telefono VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA: tours
-- =========================
CREATE TABLE tours (
    id_tour INT AUTO_INCREMENT PRIMARY KEY,
    id_guia INT,
    nombre VARCHAR(150),
    descripcion TEXT,
    fecha DATE,
    hora TIME,
    codigo_qr LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_guia) REFERENCES guias(id_guia)
);

-- =========================
-- TABLA: lugares
-- =========================
CREATE TABLE lugares (
    id_lugar INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150),
    descripcion TEXT,
    latitud DECIMAL(10,7),
    longitud DECIMAL(10,7)
);

-- =========================
-- TABLA: puntos_tour
-- =========================
CREATE TABLE puntos_tour (
    id_punto INT AUTO_INCREMENT PRIMARY KEY,
    id_tour INT,
    id_lugar INT,
    orden INT,
    punto_reunion VARCHAR(255),
    visitado BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (id_tour) REFERENCES tours(id_tour),
    FOREIGN KEY (id_lugar) REFERENCES lugares(id_lugar)
);

-- =========================
-- TABLA: avisos
-- =========================
CREATE TABLE avisos (
    id_aviso INT AUTO_INCREMENT PRIMARY KEY,
    id_tour INT,
    mensaje TEXT,
    tipo VARCHAR(50),
    fecha_envio DATETIME,

    FOREIGN KEY (id_tour) REFERENCES tours(id_tour)
);

-- =========================
-- TABLA: progreso_tour
-- =========================
CREATE TABLE progreso_tour (
    id_progreso INT AUTO_INCREMENT PRIMARY KEY,
    id_tour INT UNIQUE,
    id_punto_actual INT,
    latitud_actual DECIMAL(10,7),
    longitud_actual DECIMAL(10,7),
    fecha_cambio DATETIME,

    FOREIGN KEY (id_tour) REFERENCES tours(id_tour)
);