/**
 * FUNDACREDESA Backend Server
 * -----------------------------
 * Módulo Principal (Entrypoint) de la API RESTful.
 * Desarrollado con Node.js y Express.
 * 
 * Funciones Principales:
 * 1. Inicialización y Conexión Automática a Base de Datos MySQL (Pool).
 * 2. Carga y Mantenimiento del Sistema de Chatbot (IA Google Gemini).
 * 3. Rutas Públicas para Consulta del Repositorio de Publicaciones (CORS abierto).
 * 4. Rutas Privadas / Panel Administrativo (Protegidas mediante Token JWT y Whitelist de IPs).
 * 5. Sistema de Gestión y Almacenamiento Dinámico de Archivos Multi-Part locales mediante Multer.
 * 
 * Dependencias Críticas: express, multer, jsonwebtoken, bcryptjs, google/generative-ai
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./config/db');
const { ipWhitelistMiddleware, verifyToken, JWT_SECRET } = require('./middleware/auth');
const { trainChatbot, processMessage } = require('./chatbot/nlp');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// CONFIGURACIÓN DE MULTER (SUBIDA DE ARCHIVOS)
// ==========================================
// Configuramos dónde se guardarán los archivos en la estructura Frontend existente
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, path.join(__dirname, '../frontend/assets/pdf'));
        } else if (file.mimetype.startsWith('image/')) {
            cb(null, path.join(__dirname, '../frontend/assets/portadas'));
        } else {
            cb(new Error('Formato de archivo no soportado'), false);
        }
    },
    filename: (req, file, cb) => {
        // Renombramos el archivo con un timestamp para evitar sobreescrituras (evitar PDFs duplicados)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // Límite 50MB por archivo
});

// Storage separado y más estricto para CVs (solo PDF, 5 MB máx)
const cvStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../frontend/assets/curricula'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'cv-' + uniqueSuffix + '.pdf');
    }
});

const uploadCV = multer({
    storage: cvStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Máx 5 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Solo se aceptan archivos PDF para los currículos.'), false);
        }
    }
});

// ==========================================
// 🔐 RUTAS API RESTful & AUTENTICACIÓN
// ==========================================

// 0. Autenticación de Administrador (Login) - Protegido por IP Firewall (Sólo personal en oficina VPN/Local)
app.post('/api/auth/login', ipWhitelistMiddleware, async (req, res) => {
    try {
        const { username, password } = req.body;

        const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
        if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas.' });

        const user = rows[0];

        // Verificar la criptografía de la contraseña
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: 'Credenciales inválidas.' });

        // Expedir pasaporte JWT válido por 4 horas
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '4h' });

        res.json({ message: 'Login Exitoso', token });
    } catch (error) {
        console.error("Error en login", error);
        res.status(500).json({ error: 'Error del servidor al procesar Login.' });
    }
});

// 1. Obtener todas las categorías (Público)
app.get('/api/categorias', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categorias ORDER BY nombre ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor al obtener categorías.' });
    }
});

// 2. Obtener publicaciones (Público)
app.get('/api/publicaciones', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        // Se hace un JOIN para mandar el texto real de la categoría en vez de un ID
        const [rows] = await db.query(`
            SELECT p.*, c.nombre AS categoria_nombre 
            FROM publicaciones p
            LEFT JOIN categorias c ON p.id_categoria = c.id
            ORDER BY p.prioridad DESC, p.fecha_creacion DESC
            LIMIT ?
        `, [limit]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener publicaciones de la base de datos.' });
    }
});

// 3. Crear publicación (Panel Admin) - PROTEGIDO CON JWT Y FIREWALL
app.post('/api/publicaciones', ipWhitelistMiddleware, verifyToken, upload.fields([{ name: 'portada', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), async (req, res) => {
    try {
        const { titulo, descripcion, id_categoria, prioridad } = req.body;

        if (!req.files['portada'] || !req.files['pdf']) {
            return res.status(400).json({ error: 'Debes incluir obligatoriamente tanto la portada (imagen) como el documento (PDF).' });
        }

        // Armar rutas relativas al front para el frontend/
        // Ejemplo: '../assets/pdf/164500000-archivo.pdf'
        const portada_url = '../assets/portadas/' + req.files['portada'][0].filename;
        const pdf_url = '../assets/pdf/' + req.files['pdf'][0].filename;

        const [result] = await db.query(`
            INSERT INTO publicaciones (titulo, descripcion, portada_url, pdf_url, id_categoria, prioridad) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [titulo, descripcion, portada_url, pdf_url, id_categoria, prioridad || 0]);

        res.status(201).json({ message: 'Publicación guardada con éxito', publicacionId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fallo brutal al intentar procesar los archivos en Node o BD.' });
    }
});

// 4. Reordenar masivamente (Drag and Drop - Panel Admin) - PROTEGIDO CON JWT Y FIREWALL
app.post('/api/publicaciones/reorder', ipWhitelistMiddleware, verifyToken, async (req, res) => {
    try {
        const { orderData } = req.body;
        if (!Array.isArray(orderData)) return res.status(400).json({ error: 'Datos de ordenamiento inválidos.' });

        // Debido a que MySQL no soporta Bulk Updates nativos múltiples tan amigablemente,
        // Usamos una iteración por promesas con connection map
        const updatePromises = orderData.map(item => {
            return db.query('UPDATE publicaciones SET prioridad = ? WHERE id = ?', [item.nuevaPrioridad, item.id]);
        });

        await Promise.all(updatePromises);
        res.json({ message: 'Reordenamiento exitoso.' });
    } catch (error) {
        console.error("Error en Reorder: ", error);
        res.status(500).json({ error: 'Fallo al intentar reordenar las publicaciones.' });
    }
});

// 5. Editar publicación (Panel Admin) - PROTEGIDO CON JWT Y FIREWALL
app.put('/api/publicaciones/:id', ipWhitelistMiddleware, verifyToken, async (req, res) => {
    try {
        const { titulo, descripcion, id_categoria } = req.body;
        const publicacionId = req.params.id;

        const [result] = await db.query(`
            UPDATE publicaciones 
            SET titulo = ?, descripcion = ?, id_categoria = ?
            WHERE id = ?
        `, [titulo, descripcion, id_categoria, publicacionId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Publicación no encontrada.' });
        }
        res.json({ message: 'Publicación actualizada exitosamente.' });
    } catch (error) {
        console.error("Error al editar: ", error);
        res.status(500).json({ error: 'Fallo al intentar editar el registro.' });
    }
});

// 6. Eliminar publicación (Panel Admin) - PROTEGIDO CON JWT Y FIREWALL
app.delete('/api/publicaciones/:id', ipWhitelistMiddleware, verifyToken, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM publicaciones WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Publicación no encontrada.' });
        }
        // Nota: En un sistema estricto, aquí habría lógica fs.unlink() para borrar el PDF real del disco duro. 
        res.json({ message: 'Borrado con éxito de la base de datos.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// 7. Ruta de IA Local (Chatbot) - PÚBLICO
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Mensaje vacío.' });

        const response = await processMessage(message);
        // Retornar answer o fallback si no hay inferencia clara
        const finalAnswer = response.answer || "Actualmente solo estoy capacitado para responder consultas institucionales sobre FUNDACREDESA, su directiva, sus proyectos científicos o estadísticos.";

        res.json({ answer: finalAnswer });
    } catch (error) {
        console.error("Error en el chatbot:", error);
        res.status(500).json({ error: 'Fallo neuronal del Asistente Virtual.' });
    }
});

// ==========================================
// HERO SLIDER API (Panel Admin & Frontend)
// ==========================================

// Obtener sliders (Público)
app.get('/api/sliders', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM hero_sliders ORDER BY prioridad DESC, fecha_creacion DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener sliders de la BD.' });
    }
});

// Crear slider (Panel Admin)
app.post('/api/sliders', ipWhitelistMiddleware, verifyToken, upload.single('imagen'), async (req, res) => {
    try {
        const { titulo, descripcion, prioridad } = req.body;
        if (!req.file) return res.status(400).json({ error: 'Debes incluir la imagen del slider.' });

        const imagen_url = '../assets/portadas/' + req.file.filename;

        const [result] = await db.query(`
            INSERT INTO hero_sliders (titulo, descripcion, imagen_url, prioridad) 
            VALUES (?, ?, ?, ?)
        `, [titulo || '', descripcion || '', imagen_url, prioridad || 0]);

        res.status(201).json({ message: 'Slider guardado exitosamente.', sliderId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fallo al procesar el slider.' });
    }
});

// Reordenar sliders (Panel Admin)
app.post('/api/sliders/reorder', ipWhitelistMiddleware, verifyToken, async (req, res) => {
    try {
        const { orderData } = req.body;
        if (!Array.isArray(orderData)) return res.status(400).json({ error: 'Datos inválidos.' });
        const updatePromises = orderData.map(item => {
            return db.query('UPDATE hero_sliders SET prioridad = ? WHERE id = ?', [item.nuevaPrioridad, item.id]);
        });
        await Promise.all(updatePromises);
        res.json({ message: 'Reordenamiento exitoso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fallo al reordenar sliders.' });
    }
});

// Editar slider (Panel Admin)
app.put('/api/sliders/:id', ipWhitelistMiddleware, verifyToken, async (req, res) => {
    try {
        const { titulo, descripcion } = req.body;
        const sliderId = req.params.id;

        const [result] = await db.query(`
            UPDATE hero_sliders 
            SET titulo = ?, descripcion = ?
            WHERE id = ?
        `, [titulo || '', descripcion || '', sliderId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Slider no encontrado.' });
        }
        res.json({ message: 'Slider actualizado exitosamente.' });
    } catch (error) {
        console.error("Error al editar slider: ", error);
        res.status(500).json({ error: 'Fallo al intentar editar el registro.' });
    }
});

// Eliminar slider (Panel Admin)
app.delete('/api/sliders/:id', ipWhitelistMiddleware, verifyToken, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM hero_sliders WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Slider no encontrado.' });
        res.json({ message: 'Borrado con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar slider.' });
    }
});

// ==========================================
// CURRÍCULUM VITAE (CV) - POSTULACIONES
// ==========================================

// Asegurar que los directorios de subida de archivos existan
const fs = require('fs');
const dirs = [
    path.join(__dirname, '../frontend/assets/curricula'),
    path.join(__dirname, '../frontend/assets/pdf'),
    path.join(__dirname, '../frontend/assets/portadas')
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log('📁 Directorio de assets creado:', dir);
    }
});

// POST /api/curricula - Envío público de CV (sin autenticación, sin IP whitelist)
app.post('/api/curricula', uploadCV.single('cv_pdf'), async (req, res) => {
    try {
        const { nombre, cedula, email, telefono, area } = req.body;

        if (!nombre || !cedula || !email) {
            return res.status(400).json({ error: 'Los campos nombre, cédula y correo son obligatorios.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Debes adjuntar el CV en formato PDF.' });
        }

        // Validación básica de cédula venezolana
        if (!/^[VEve]-?\d{6,8}$/.test(cedula)) {
            return res.status(400).json({ error: 'Formato de cédula inválido. Usa el formato V-12345678.' });
        }

        const cv_pdf_url = '/assets/curricula/' + req.file.filename;

        await db.query(`
            INSERT INTO curricula (nombre, cedula, email, telefono, area, cv_pdf_url)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [nombre, cedula.toUpperCase(), email, telefono || null, area || null, cv_pdf_url]);

        res.status(201).json({ message: '¡Currículum recibido y registrado exitosamente!' });
    } catch (error) {
        console.error('Error guardando CV:', error);
        res.status(500).json({ error: 'Error interno al procesar tu currículum. Inténtalo de nuevo.' });
    }
});

// GET /api/curricula - Listar CVs (Solo Admin, protegido con JWT e IP)
app.get('/api/curricula', ipWhitelistMiddleware, verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id, nombre, cedula, email, telefono, area, cv_pdf_url, fecha_subida
            FROM curricula
            ORDER BY fecha_subida DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo CVs:', error);
        res.status(500).json({ error: 'Error al obtener los currículums.' });
    }
});

// DELETE /api/curricula/:id - Eliminar CV (Solo Admin)
app.delete('/api/curricula/:id', ipWhitelistMiddleware, verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT cv_pdf_url FROM curricula WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'CV no encontrado.' });

        // Intentar borrar el archivo físico (no crítico si falla)
        const filePath = path.join(__dirname, '../frontend', rows[0].cv_pdf_url);
        if (fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch (e) { console.warn('No se pudo eliminar el PDF del CV:', e.message); }
        }

        await db.query('DELETE FROM curricula WHERE id = ?', [req.params.id]);
        res.json({ message: 'CV eliminado correctamente.' });
    } catch (error) {
        console.error('Error eliminando CV:', error);
        res.status(500).json({ error: 'Error al eliminar el CV.' });
    }
});

// ==========================================
// SERVIR FRONTEND COMO APP UNIFICADA
// ==========================================
// Esto sustituye la tarea estática de Flask
app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware Catch-All para rutas no API (Sustituye a app.get('*') en Express moderno)
app.use((req, res, next) => {
    // Si la ruta empieza con /api, no la tocamos y mandamos 404 de API real
    if (req.path.startsWith('/api')) {
        return next();
    }

    // Si no, le intentamos servir la página HTML de frontend correspondiente o caemos a index
    const requestedPath = req.path === '/' ? '/index.html' : req.path;
    const finalPath = requestedPath.endsWith('.html') ? requestedPath : requestedPath + '.html';

    res.sendFile(path.join(__dirname, '../frontend/pages', finalPath), (err) => {
        if (err) {
            res.sendFile(path.join(__dirname, '../frontend', requestedPath)); // Fallback a assets
        }
    });
});

app.listen(PORT, async () => {
    console.log(`🚀 Servidor Node.js corriendo dinámicamente en http://localhost:${PORT}`);
    console.log(`🔧 Las conexiones a la BD Local MySQL buscan procesarse en puerto default 3306.`);
    // Iniciar entrenamiento de la Red Neuronal
    await trainChatbot();
});

