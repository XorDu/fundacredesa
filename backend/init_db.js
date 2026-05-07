// Script de instalación de Base de Datos para Fundacredesa
// Ejecutar con: npm run init_db

require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const setupDatabase = async () => {
    try {
        console.log("Conectando a MySQL (XAMPP)...");
        // Conexión inicial sin especificar base de datos para crearla si no existe
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        });

        console.log("Creando Base de Datos 'fundacredesa_db' (si no existe)...");
        await connection.query("CREATE DATABASE IF NOT EXISTS fundacredesa_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

        console.log("Usando la BD 'fundacredesa_db'...");
        await connection.query("USE fundacredesa_db");

        console.log("=== DESARROLLO: REINICIANDO TABLAS PARA IMPORTAR CATÁLOGO ORIGINAL ===");
        // Orden de DROP respetando llaves foráneas
        await connection.query("DROP TABLE IF EXISTS publicaciones");
        await connection.query("DROP TABLE IF EXISTS hero_sliders");
        await connection.query("DROP TABLE IF EXISTS curricula");
        await connection.query("DROP TABLE IF EXISTS categorias");
        await connection.query("DROP TABLE IF EXISTS usuarios");

        console.log("Creando Tabla 'usuarios' (Seguridad Login)...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Codificando credenciales de administrador...");
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('fundacredesa123', salt);
        await connection.query(`
            INSERT IGNORE INTO usuarios (username, password_hash)
            VALUES ('fundacredesa', ?)
        `, [hash]);

        console.log("Creando Tabla 'categorias'...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS categorias (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL UNIQUE
            )
        `);

        console.log("Verificando/Insertando Categorías predeterminadas...");
        await connection.query(`
            INSERT IGNORE INTO categorias (nombre) VALUES 
            ('Línea de Vida'),
            ('Línea Transversal: Nutrición'),
            ('Línea Transversal: Condiciones de Vida'),
            ('Línea Transversal: Desigualdades Sociales'),
            ('Boletines Técnicos'),
            ('Artículos Científicos')
        `);

        console.log("Creando Tabla 'publicaciones'...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS publicaciones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titulo VARCHAR(255) NOT NULL,
                descripcion TEXT,
                portada_url VARCHAR(255) NOT NULL,
                pdf_url VARCHAR(255) NOT NULL,
                id_categoria INT,
                prioridad INT DEFAULT 0,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE SET NULL
            )
        `);

        console.log("Creando Tabla 'hero_sliders' (Imágenes del Carrusel Principal)...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS hero_sliders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titulo VARCHAR(255),
                descripcion TEXT,
                imagen_url VARCHAR(255) NOT NULL,
                orden INT DEFAULT 0,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Insertando imágenes del Hero Slider por defecto...");
        const slidersBase = [
            ['Fundacredesa Presente', 'Apoyando la investigación social en Venezuela.', '../assets/images/foto_carrusel_0.png', 1],
            ['Nuevos Estudios 2024', 'Publicaciones recientes sobre el desarrollo humano.', '../assets/images/foto_carrusel_1.png', 2],
            ['Comunidad y Sociedad', 'Análisis detallado de nuestras comunidades.', '../assets/images/foto_carrusel_2.png', 3]
        ];
        await connection.query(`
            INSERT INTO hero_sliders (titulo, descripcion, imagen_url, orden)
            VALUES ?
        `, [slidersBase]);

        console.log("Creando Tabla 'curricula' (CVs de postulantes)...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS curricula (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                cedula VARCHAR(20) NOT NULL,
                email VARCHAR(255) NOT NULL,
                telefono VARCHAR(30),
                area VARCHAR(100),
                cv_pdf_url VARCHAR(500) NOT NULL,
                fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Tabla 'curricula' lista.");

        console.log("Verificando existencia del patrimonio histórico de Documentos...");
        const [rows] = await connection.query("SELECT COUNT(*) AS total FROM publicaciones");

        if (rows[0].total === 0) {
            console.log("Insertando los 16 estudios originales a la Base de Datos...");

            // Reasignamos los 16 documentos pioneros a la categoría "Línea Transversal: Condiciones de Vida" (ID 3) 
            // u otras genéricas para revivirlos visualmente.
            const publicacionesOld = [
                { title: 'Atlas de Maduración Ósea', desc: 'Referencia para la estimación de la edad ósea', file: 'AtlasMadOseaVenezolano.pdf', img: 'Atlasdemaduraciónoseadelvenezolano.png' },
                { title: 'Chino Julio e Indio Mara', desc: 'Caracterización Comunidad', file: 'Chino Julio e Indio Mara_Web.pdf', img: 'Caracterizacioncondicionesdevidadelascomunidadeschinojulioeindiomara.png' },
                { title: 'Comunidad El Contento', desc: 'Caracterización de condiciones de vida', file: 'El Contento_Web.pdf', img: 'caracterizacioncondicionesdevidadelacomunidadelcontento.png' },
                { title: 'Comunidad El Guaruro', desc: 'Estudio detallado socioeconómico', file: 'El Guaruro_Web.pdf', img: 'caracterizacioncondicionesdevidadelacomunidadelguaruro.png' },
                { title: 'Comuna El Maizal', desc: 'Experiencias de organización comunitaria', file: 'El Maizal_Web.pdf', img: 'caracterizaciondeexperienciasdeorganizaciondecomunascongestionexitosacomunasocialistaelmaizal.png' },
                { title: 'Comunidad El Motero', desc: 'Evaluación y caracterización social', file: 'El Motero_Web.pdf', img: 'caracterizaciondecondicionesdevidadelacomunidadelmotero.png' },
                { title: 'Comunidad Jaime Lusinchi', desc: 'Análisis de condiciones comunitarias', file: 'Jaime Lusinchi_Web.pdf', img: 'caracterizaciondecondicionesdevidadelacomunidadjaimelusinchi.png' },
                { title: 'Formación Universitaria Docentes', desc: 'Docentes Subsistemas Inicial y Primaria', file: 'Formacion_Univ_Web.pdf', img: 'laformacionuniversitariadelosdocentesvenezolanosenlossubsistemasdeducacioninicialyprimaria.png' },
                { title: 'Nuevos Urbanismos Zona Metropolitana', desc: 'Relaciones de convivencia existentes', file: 'Nuevos Urbanismos_Web.pdf', img: 'relacionesdeconvivenciaexistentesenlosnuevosurbanismosdelazonametropolitanadecaracas.png' },
                { title: 'SENACREDH Informe General', desc: 'Segundo Estudio Nacional de Crecimiento', file: 'SENACREDH INFORME GENERAL.pdf', img: 'informegeneralsegundoestudionacionaldecrecimientoydesarrollohumanodelarepublicabolivarianadevenezuela.png' },
                { title: 'SENACREDH Evaluación Psicomotora (Resumen)', desc: 'Desarrollo psicomotor en muestra de niñas y niños', file: 'SNCRDH_EDP_Resumen_Web.pdf', img: 'resumenevaluaciondeldesarrollopsicomotordeunamuestradeniñasyniños.png' },
                { title: 'SENACREDH Evaluación Psicomotora (Completo)', desc: 'Estudio psicomotor infantil completo', file: 'SNCRDH_EDP_Completo_Web.pdf', img: 'evaluaciondeldesarrollopsicomotordeunamuestradeniñasyniños.png' },
                { title: 'SENACREDH Hemoglobina y Anemia (Resumen)', desc: 'Prevalencia en niñas, niños y adolescentes', file: 'SNCRDH_ECHyA_Resumen_Web.pdf', img: 'resumenevaluaciondelaconcentraciondehemoglobinayanemiaenniñasniñosyadolescentes.png' },
                { title: 'SENACREDH Hemoglobina y Anemia (Completo)', desc: 'Estudio completo de anemia infantil', file: 'SNCRDH_ECHyA_Completo_Web.pdf', img: 'evaluaciondelaconcentraciondehemoglobinayanemiaenniñasniñosyadolescentes.png' },
                { title: 'Sociedad y Estratificación', desc: 'Método Graffar-Méndez Castellano', file: 'Sociedad y Estratificacion.pdf', img: 'sociedadyestratificacionmetodojaffarmendezcastellano.png' },
                { title: 'Tabla de Talla y Peso', desc: 'Circunferencia cefálica y de brazo', file: 'TABLA DE TALLA Y PESO FUNDACREDESA.jpg', img: 'tabladepesotallacircunferenciacefalicaycircunferenciadebrazodelasvenezolanasylosvenezolanos.png' }
            ];

            // Reconstruimos los links hacia los assets locales
            let valuesMapping = [];
            for (let i = 0; i < publicacionesOld.length; i++) {
                const item = publicacionesOld[i];
                let encodedImg = encodeURIComponent(item.img).replace(/%20/g, '+');
                let encodedPdf = encodeURIComponent(item.file).replace(/%20/g, '+');

                let portada = item.img ? '../assets/portadas/' + encodedImg : '../assets/images/logo_fundacredesa.png';
                let doc = item.file.endsWith('.jpg') ? '../assets/pdf/' + encodedPdf : '../assets/pdf/' + encodedPdf;

                // Prioridad regresiva -1 para que bajen en la tabla pero se vean; Categoria 3 general.
                valuesMapping.push([item.title, item.desc, portada, doc, 3, -1 * i]);
            }

            // Ejecutamos la inyección masiva en Mysql
            await connection.query(`
                INSERT INTO publicaciones (titulo, descripcion, portada_url, pdf_url, id_categoria, prioridad) 
                VALUES ?
            `, [valuesMapping]);

            console.log("¡Los 16 clásicos reposan nuevamente en la Base de Datos!");
        }

        console.log("✅ Inicialización de Base de Datos COMPLETADA DE FORMA EXITOSA. Ya puedes arrancar tu servidor.");
        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error("❌ ERROR al inicializar la base de datos:", error);
        console.error("Asegúrate de tener XAMPP abierto con el módulo de MySQL en verde (ejecutándose).");
        process.exit(1);
    }
};

setupDatabase();
