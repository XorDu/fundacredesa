-- Script de creación de la base de datos y tablas de Fundacredesa
-- Base de Datos: fundacredesa_db

CREATE DATABASE IF NOT EXISTS fundacredesa_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fundacredesa_db;

-- Tabla de categorías para organizar los PDFs (ej. 'Salud Mental', 'Estudios de Crecimiento', 'Informes')
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Inserción de categorías predeterminadas
INSERT IGNORE INTO categorias (nombre) VALUES 
('Línea de Vida'),
('Línea Transversal: Nutrición'),
('Línea Transversal: Condiciones de Vida'),
('Línea Transversal: Desigualdades Sociales'),
('Boletines Técnicos'),
('Artículos Científicos');

-- Tabla principal de publicaciones (PDF)
CREATE TABLE IF NOT EXISTS publicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    portada_url VARCHAR(255) NOT NULL, -- Ruta a la imagen de portada
    pdf_url VARCHAR(255) NOT NULL,     -- Ruta al archivo PDF
    id_categoria INT,
    prioridad INT DEFAULT 0,           -- Campo para poder ordenar. Mayor = más arriba
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE SET NULL
);
