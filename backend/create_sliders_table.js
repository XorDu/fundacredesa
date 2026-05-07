const db = require('./config/db');

async function createTable() {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS hero_sliders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titulo VARCHAR(255) NOT NULL,
                descripcion TEXT NOT NULL,
                imagen_url VARCHAR(255) NOT NULL,
                prioridad INT DEFAULT 0,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await db.query(query);
        console.log("Tabla hero_sliders creada correctamente.");
        process.exit(0);
    } catch (error) {
        console.error("Error creando tabla hero_sliders:", error);
        process.exit(1);
    }
}

createTable();
