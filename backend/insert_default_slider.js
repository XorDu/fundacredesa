const db = require('./config/db');

async function insertDefaultSlider() {
    try {
        const query = `
            INSERT INTO hero_sliders (titulo, descripcion, imagen_url, prioridad) 
            VALUES (?, ?, ?, ?);
        `;
        await db.query(query, [
            '¡Abuelos atendidos en Ciudad Caribia! 👵🏻👴🏾✨',
            'Jornada de Atención Nutricional Antropométrica dirigida al Círculo de Abuelos. Operativo a cielo abierto en Charallave',
            '../assets/images/ciudad_caribia.png',
            1
        ]);
        console.log("Slider por defecto agregado a la DB.");
        process.exit(0);
    } catch (error) {
        console.error("Error al insertar el slider por defecto:", error);
        process.exit(1);
    }
}

insertDefaultSlider();
