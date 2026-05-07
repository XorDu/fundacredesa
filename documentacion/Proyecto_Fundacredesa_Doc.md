# Resumen Ejecutivo: Portal Interactivo FUNDACREDESA 🇻🇪

## 1. Visión General

**FUNDACREDESA** (Fundación Centro de Estudios sobre Crecimiento y Desarrollo de la Población Venezolana) ha transformado su presencia digital de una web estática a un **Ecosistema Dinámico** impulsado por Node.js, MySQL e Inteligencia Artificial Generativa (Google Gemini 2.5 Flash con RAG).

## 2. Arquitectura

| Capa | Tecnología | Responsabilidad |
|---|---|---|
| **Frontend** | HTML5 + CSS3 + Vanilla JS | Interfaz responsiva, animaciones, chatbot widget, formularios |
| **Backend** | Node.js + Express.js | API REST (16 endpoints), autenticación JWT, subida de archivos |
| **Base de Datos** | MySQL (XAMPP) | 5 tablas: usuarios, categorías, publicaciones, sliders, currículums |
| **IA** | Google Gemini 2.5 Flash | Chatbot RAG que razona sobre PDFs institucionales |

## 3. Tecnologías Empleadas

### Backend
- **Node.js & Express.js** — Motor de ejecución y framework web para la API REST.
- **JSON Web Tokens (JWT)** — Autenticación segura con tokens de 4 horas de validez.
- **Multer** — Procesamiento de archivos multipart (PDFs, imágenes, CVs).
- **pdf2json** — Extracción de texto desde PDFs para alimentar la IA.
- **Google Gemini API** — Sistema RAG contextualizado con documentos institucionales.
- **bcryptjs** — Hashing de contraseñas con 10 salt rounds.

### Frontend
- **HTML5 Semántico & CSS3** — Diseño modular, responsivo y animado.
- **Vanilla JavaScript (ES6+)** — Sin frameworks: IntersectionObserver, Fetch API, DOM manipulation.
- **SVG Interactivo** — Mapa de Venezuela con datos por estado y gráficos estadísticos.
- **Drag & Drop** — Reordenamiento visual de publicaciones y subida de archivos.

### Seguridad
- **IP Whitelisting** — Firewall que bloquea acceso no autorizado al panel admin.
- **JWT Bearer Tokens** — Sesiones seguras con caducidad controlada.
- **Prepared Statements** — Protección total contra SQL Injection.

## 4. Funcionalidades Principales

### Para el Usuario Final (Público)
1. **Chatbot IA (Gemini RAG)** — Asistente virtual que responde sobre FUNDACREDESA basándose en PDFs y corpus institucional.
2. **Carrusel Dinámico** — Hero slider administrable desde el panel de control.
3. **Catálogo de Publicaciones** — Grid filtrable por categorías con descarga directa de PDFs.
4. **Mapa Interactivo** — Visualización SVG de datos por estado de Venezuela.
5. **Estadísticas Animadas** — Gráficos SVG con contadores que animan al hacer scroll.
6. **Portal de CVs** — Formulario oculto para envío de currículums con captcha anti-bots.

### Para el Administrador (Panel Privado)
1. **Gestión de Publicaciones** — CRUD completo + drag-and-drop para reordenar.
2. **Gestión del Carrusel** — Subida, edición y eliminación de slides del hero.
3. **Recepción de CVs** — Tabla cronológica de currículums con descarga y eliminación.
4. **Asimilación IA** — Nuevos PDFs son automáticamente incorporados al conocimiento del chatbot.
5. **Seguridad Robusta** — Acceso restringido por IP + credenciales encriptadas + tokens JWT.

## 5. Modelo de Base de Datos (5 Tablas)

| Tabla | Campos Clave | Propósito |
|---|---|---|
| `usuarios` | username, password_hash | Autenticación admin |
| `categorias` | nombre (UNIQUE) | Clasificación de publicaciones |
| `publicaciones` | titulo, pdf_url, portada_url, id_categoria FK | Documentos investigativos |
| `hero_sliders` | titulo, imagen_url, orden | Imágenes del carrusel principal |
| `curricula` | nombre, cedula, email, cv_pdf_url | CVs de postulantes |

## 6. Guía de Despliegue Local

1. **Prerequisitos:** Node.js v18+, XAMPP con MySQL activo (puerto 3306).
2. **Instalar:** `cd backend && npm install`
3. **Configurar:** Verificar/crear archivo `.env` con credenciales y API Key de Gemini.
4. **Inicializar BD:** `npm run init_db` — crea las 5 tablas + datos iniciales automáticamente.
5. **Arrancar:** `npm start` — servidor en `http://localhost:8080`.
6. **Acceso Admin:** Usuario `fundacredesa` / Contraseña `fundacredesa123`.

---
*Documento técnico oficial del proyecto Portal Interactivo FUNDACREDESA.*
