<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bandera_de_Venezuela_%28institucional%29.svg/800px-Bandera_de_Venezuela_%28institucional%29.svg.png" alt="Bandera Venezuela" width="80" />
  
  # 🧠 FUNDACREDESA — Documentación Técnica Oficial
  ### Guía Completa de Arquitectura, Seguridad e Implementación
  
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
  [![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
  [![Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
  [![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
</div>

<br>

> **Índice:** [1. Arquitectura](#-1-arquitectura-del-proyecto) · [2. Frontend](#-2-frontend) · [3. Backend](#-3-backend-nodejs) · [4. Base de Datos](#-4-base-de-datos) · [5. IA Gemini RAG](#-5-inteligencia-artificial-gemini-rag) · [6. Seguridad](#-6-ciberseguridad-institucional) · [7. Sistema de CVs](#-7-sistema-de-recepción-de-currículums) · [8. API REST](#-8-referencia-completa-de-la-api-rest) · [9. Despliegue](#-9-guía-de-despliegue-completo) · [10. Variables de Entorno](#-10-variables-de-entorno)

---

## 🏗️ 1. Arquitectura del Proyecto

El sistema sigue un modelo **Cliente-Servidor desacoplado** donde el frontend consume servicios del backend vía `fetch()` asíncrono:

```
fundacredesa/
├── frontend/                         # 🎨 Cliente (HTML5 + CSS3 + Vanilla JS)
│   ├── assets/                       # Recursos estáticos
│   │   ├── images/                   # Logos, avatares, fotos carrusel
│   │   ├── portadas/                 # Portadas de publicaciones (JPG/PNG)
│   │   ├── pdf/                      # PDFs de investigaciones (Base RAG de la IA)
│   │   └── curricula/                # CVs de postulantes (auto-generado)
│   ├── css/                          # 16 hojas de estilo modulares
│   │   ├── variables.css             # Tokens de diseño (colores, fuentes)
│   │   ├── reset.css                 # Normalización cross-browser
│   │   ├── header.css / hero.css     # Navegación y carrusel
│   │   ├── content.css               # Grid de publicaciones
│   │   ├── estadisticas.css          # Gráficos SVG dinámicos
│   │   ├── mapa.css                  # Mapa SVG interactivo de Venezuela
│   │   ├── chatbot.css               # Widget flotante del asistente IA
│   │   ├── admin.css                 # Panel de administración
│   │   ├── curricula.css             # Formulario de recepción de CVs
│   │   └── devpanel.css              # Panel del equipo desarrollador
│   ├── js/                           # 5 módulos de lógica ES6+
│   │   ├── main.js          (26 KB)  # Controlador principal: slider, observers, chatbot
│   │   ├── admin.js         (24 KB)  # CRUD completo: publicaciones, sliders, CVs
│   │   ├── curricula.js     (9 KB)   # Captcha + drag-drop + validación + envío
│   │   ├── login.js         (2 KB)   # Autenticación JWT
│   │   └── devpanel.js      (7 KB)   # Panel "Equipo Desarrollador"
│   └── pages/                        # 9 vistas HTML
│       ├── index.html                # Landing page principal
│       ├── publicaciones.html        # Catálogo de publicaciones filtrable
│       ├── estadisticas.html         # Dashboard con gráficos
│       ├── nosotros.html             # Historia y misión institucional
│       ├── investigaciones.html      # Biblioteca de investigaciones
│       ├── proyectos.html            # Proyectos activos
│       ├── login.html                # 🔒 Pantalla de autenticación
│       ├── admin.html                # 🔒 Panel de control (3 tabs)
│       └── curricula.html            # 📄 Formulario oculto de CVs
│
├── backend/                          # ⚙️ Servidor (Node.js + Express)
│   ├── config/db.js                  # Pool MySQL (mysql2/promise, 10 conexiones)
│   ├── middleware/auth.js            # IP Firewall + JWT Verification
│   ├── chatbot/
│   │   ├── nlp.js                    # Motor RAG: PDFs → Gemini → respuestas
│   │   └── corpus-es.json            # Corpus institucional de preguntas frecuentes
│   ├── server.js                     # 🚀 Entrypoint: 16 endpoints API REST
│   ├── init_db.js                    # 🗄️ Inicialización completa de BD (5 tablas)
│   ├── package.json                  # Dependencias: 10 paquetes npm
│   └── .env                          # 🔑 Secretos (JWT, Gemini API Key, IPs)
│
├── documentacion/                    # 📚 Documentación técnica
└── README.md                         # Entrada principal del repositorio
```

---

## 🎨 2. Frontend

Construido con **HTML5 Semántico, CSS3 Vainilla y JavaScript ES6+** puro. Sin React, Vue, Bootstrap ni Tailwind — priorizando rendimiento extremo y control total.

### 2.1 Sistema de Diseño (`variables.css`)

Todas las páginas consumen un set centralizado de tokens de diseño que garantizan consistencia visual:

| Token | Valor | Uso |
|---|---|---|
| `--teal` | `#00b5cc` | Color primario institucional |
| `--orange` | `#e87722` | Acento secundario, CTAs |
| `--dark` | `#1a1a1a` | Textos principales, headers |
| `--gray` | `#6b7280` | Textos secundarios |
| `--font-ui` | `'Inter', sans-serif` | Títulos y navegación |
| `--font-body` | `'Merriweather', serif` | Cuerpo de texto |

### 2.2 Módulo `main.js` — Controlador Principal

El archivo más complejo del frontend (26 KB) orquesta:

- **🎠 Hero Slider:** Carrusel dinámico alimentado por `GET /api/sliders`, con transiciones CSS y autoplay.
- **📊 Contadores animados:** Números que incrementan suavemente al entrar en viewport usando `IntersectionObserver` (0% CPU si no son visibles).
- **🗺️ Mapa SVG interactivo:** Click en cualquier estado de Venezuela → muestra datos del censo.
- **🤖 Widget de chatbot:** Burbuja flotante que abre un chat conectado a `POST /api/chat`.
- **📰 Tarjetas de publicaciones:** Grid lazy-loaded con animaciones de entrada tipo fade-in.

### 2.3 Módulo `admin.js` — Panel de Administración

Sistema de gestión con **3 tabs** independientes:

| Tab | Funcionalidad |
|---|---|
| 📚 **Publicaciones** | CRUD completo + drag-and-drop para reordenar prioridades |
| 🖼️ **Hero Slider** | Subida de imágenes del carrusel, edición de textos, eliminación |
| 📄 **Currículums** | Tabla full-width con todos los CVs recibidos, botón de descarga y eliminación |

### 2.4 Módulo `curricula.js` — Portal de CVs

Página oculta (`/curricula.html`, sin enlace en navegación) que incluye:

- **Captcha matemático:** Operaciones aleatorias (suma, resta, multiplicación) que se regeneran tras cada error.
- **Drag & Drop:** Zona visual para arrastrar el PDF del CV (validación de tipo MIME y tamaño ≤ 5 MB).
- **Validación de cédula:** Formato venezolano `V-12345678` o `E-12345678`.
- **Envío asíncrono:** `POST /api/curricula` con `FormData` multipart.

---

## ⚙️ 3. Backend (Node.js)

### 3.1 Dependencias (`package.json`)

| Paquete | Versión | Función |
|---|---|---|
| `express` | 5.2.1 | Framework HTTP y enrutamiento |
| `mysql2` | 3.18.2 | Driver MySQL con soporte Promises |
| `multer` | 2.1.0 | Upload de archivos multipart/form-data |
| `jsonwebtoken` | 9.0.3 | Generación y verificación de JWT |
| `bcryptjs` | 3.0.3 | Hashing de contraseñas (salt 10 rounds) |
| `@google/generative-ai` | 0.24.1 | SDK de Google Gemini para IA |
| `pdf2json` | 4.0.2 | Extracción de texto desde PDFs |
| `cors` | 2.8.6 | Habilitación de CORS |
| `dotenv` | 17.3.1 | Variables de entorno desde `.env` |

### 3.2 Configuración de Multer (Subida de Archivos)

El servidor maneja **dos instancias** de Multer:

| Instancia | Destino | Límite | Tipos |
|---|---|---|---|
| `upload` | `assets/pdf/` y `assets/portadas/` | 50 MB | PDF + Imágenes |
| `uploadCV` | `assets/curricula/` | 5 MB | Solo PDF |

Archivos renombrados automáticamente con timestamp único: `cv-1717890123456-987654321.pdf`

### 3.3 Serving Estático Unificado

Express sirve el frontend completo como archivos estáticos, con un catch-all inteligente que resuelve rutas como `/publicaciones` → `publicaciones.html`, eliminando la necesidad de un servidor web separado (Apache/Nginx).

---

## 🗄️ 4. Base de Datos

### 4.1 Esquema Completo (5 tablas)

```sql
-- Autenticación
usuarios        (id PK, username UNIQUE, password_hash, fecha_creacion)

-- Contenido
categorias      (id PK, nombre UNIQUE)
publicaciones   (id PK, titulo, descripcion, portada_url, pdf_url, id_categoria FK→categorias, prioridad, fecha_creacion)
hero_sliders    (id PK, titulo, descripcion, imagen_url, orden, fecha_creacion)

-- Recursos Humanos
curricula       (id PK, nombre, cedula, email, telefono, area, cv_pdf_url, fecha_subida)
```

### 4.2 Datos Iniciales (`init_db.js`)

Al ejecutar `npm run init_db`, el script:

1. **Crea** (o reinicia) las 5 tablas con `DROP TABLE IF EXISTS` en orden correcto.
2. **Inserta** usuario admin `fundacredesa` con contraseña hasheada con bcrypt (10 salt rounds).
3. **Inserta** 6 categorías predeterminadas (Línea de Vida, Nutrición, etc.).
4. **Inserta** 3 slides por defecto para el carrusel del hero.
5. **Inserta** 16 publicaciones históricas de investigaciones fundacionales.

---

## 🧠 5. Inteligencia Artificial (Gemini RAG)

### Flujo de Ingesta al Iniciar (`nlp.js`)

```
npm start
    │
    ▼
trainChatbot()
    │
    ├─→ Lee corpus-es.json (preguntas frecuentes institucionales)
    ├─→ Carga mapa de 24 estados de Venezuela (censos y estatus)
    ├─→ Extrae texto de los primeros 5 PDFs del directorio (pdf2json)
    │     └─→ Máximo 4000 caracteres por PDF
    │
    ▼
Inyecta todo como System Prompt → Gemini 2.5 Flash
    │
    ├─→ temperature: 0.25 (factual, baja creatividad)
    ├─→ maxOutputTokens: 600 (respuestas concisas)
    │
    ▼
chatSession activa → POST /api/chat disponible
```

### Reglas del System Prompt

- Solo habla de FUNDACREDESA (rechaza preguntas fuera de contexto).
- No usa Markdown (el frontend no lo renderiza).
- No inventa datos — solo responde con información del corpus y PDFs.
- Tono: profesional, institucional, empático.

---

## 🔐 6. Ciberseguridad Institucional

### Triple Barrera de Defensa

| Capa | Mecanismo | Detalle Técnico |
|:---:|---|---|
| **1** | 🛡️ Firewall IP | `ALLOWED_ADMIN_IPS` en `.env`. Middleware `ipWhitelistMiddleware` compara `req.socket.remoteAddress` con la lista. Denegación: HTTP `403`. |
| **2** | 🔑 JWT Bearer | Login emite token con `jwt.sign()`, validez **4 horas**. Cada request admin envía `Authorization: Bearer <token>`. Middleware `verifyToken` decodifica y valida. |
| **3** | 💉 SQL Parameterizado | Toda query usa `?` placeholders: `WHERE id = ?` + `[valor]`. Erradica SQL Injection al 100%. |

### Rutas Protegidas vs Públicas

| Protección | Rutas |
|---|---|
| 🌐 Sin protección | `GET /api/categorias`, `GET /api/publicaciones`, `GET /api/sliders`, `POST /api/chat`, `POST /api/curricula` |
| 🛡️ IP Only | `POST /api/auth/login` |
| 🔒 IP + JWT | Todas las rutas `POST/PUT/DELETE` de publicaciones, sliders y `GET/DELETE` de curricula |

---

## 📄 7. Sistema de Recepción de Currículums

### Flujo Completo

```
Usuario → curricula.html (oculta, sin enlace en nav)
   │
   ├─→ Rellena: nombre, cédula (V-XXXXXXXX), email, teléfono, área
   ├─→ Arrastra PDF (≤ 5MB) a zona drag-and-drop
   ├─→ Resuelve captcha matemático (ej: "¿Cuánto es 7 × 3?")
   │
   ▼
POST /api/curricula (FormData multipart)
   │
   ├─→ Multer guarda PDF → frontend/assets/curricula/cv-XXXX.pdf
   ├─→ Validaciones backend: campos requeridos, regex cédula, tipo MIME
   ├─→ INSERT INTO curricula (...)
   │
   ▼
Admin → admin.html → Tab "📄 Currículums"
   │
   ├─→ GET /api/curricula (JWT + IP requeridos)
   ├─→ Tabla full-width con: nombre, cédula, correo, teléfono, área, fecha, botón PDF, botón eliminar
   └─→ DELETE /api/curricula/:id → borra registro DB + archivo físico del disco
```

---

## 📋 8. Referencia Completa de la API REST

### Autenticación
| Método | Ruta | Protección | Body | Respuesta |
|:---:|---|:---:|---|---|
| `POST` | `/api/auth/login` | 🛡️ IP | `{username, password}` | `{message, token}` |

### Publicaciones
| Método | Ruta | Protección | Descripción |
|:---:|---|:---:|---|
| `GET` | `/api/publicaciones?limit=N` | 🌐 | Lista publicaciones con JOIN de categoría |
| `POST` | `/api/publicaciones` | 🔒 | Crea publicación (multipart: portada + pdf) |
| `PUT` | `/api/publicaciones/:id` | 🔒 | Edita título, descripción, categoría |
| `DELETE` | `/api/publicaciones/:id` | 🔒 | Elimina registro de la BD |
| `POST` | `/api/publicaciones/reorder` | 🔒 | Bulk update de prioridades (drag-drop) |

### Categorías
| Método | Ruta | Protección | Descripción |
|:---:|---|:---:|---|
| `GET` | `/api/categorias` | 🌐 | Lista categorías ordenadas alfabéticamente |

### Hero Sliders
| Método | Ruta | Protección | Descripción |
|:---:|---|:---:|---|
| `GET` | `/api/sliders` | 🌐 | Lista slides del carrusel |
| `POST` | `/api/sliders` | 🔒 | Crea slide (multipart: imagen) |
| `PUT` | `/api/sliders/:id` | 🔒 | Edita título y descripción |
| `DELETE` | `/api/sliders/:id` | 🔒 | Elimina slide |
| `POST` | `/api/sliders/reorder` | 🔒 | Reordena sliders (drag-drop) |

### Currículums
| Método | Ruta | Protección | Descripción |
|:---:|---|:---:|---|
| `POST` | `/api/curricula` | 🌐 | Envío público de CV (multipart: cv_pdf) |
| `GET` | `/api/curricula` | 🔒 | Lista CVs recibidos (ORDER BY fecha DESC) |
| `DELETE` | `/api/curricula/:id` | 🔒 | Elimina CV + archivo PDF físico |

### Chatbot IA
| Método | Ruta | Protección | Descripción |
|:---:|---|:---:|---|
| `POST` | `/api/chat` | 🌐 | Envía mensaje al asistente Gemini RAG |

---

## 🚀 9. Guía de Despliegue Completo

### Requisitos
- **Node.js** v18+ · **XAMPP** (MySQL en puerto 3306)

### Instalación Limpia (PC nueva)

```bash
# 1. Encender MySQL en XAMPP (debe estar verde en puerto 3306)

# 2. Navegar al backend
cd backend

# 3. Instalar dependencias
npm install

# 4. Configurar .env (ver sección 10)

# 5. Crear toda la infraestructura de base de datos
npm run init_db
# → Crea: fundacredesa_db, 5 tablas, usuario admin, 6 categorías, 3 sliders, 16 publicaciones

# 6. Arrancar el servidor
npm start
# → http://localhost:8080
```

### Credenciales por Defecto
- **Usuario admin:** `fundacredesa`
- **Contraseña:** `fundacredesa123`

---

## 🔑 10. Variables de Entorno

Archivo `backend/.env`:

```env
DB_HOST=localhost              # Host de MySQL
DB_USER=root                   # Usuario MySQL (XAMPP default)
DB_PASSWORD=                   # Contraseña MySQL (vacío en XAMPP)
DB_NAME=fundacredesa_db        # Nombre de la BD
JWT_SECRET=clave_secreta_jwt   # Secreto para firmar tokens
PORT=8080                      # Puerto del servidor Node.js
ALLOWED_ADMIN_IPS=::1,127.0.0.1,::ffff:127.0.0.1  # IPs autorizadas
GEMINI_API_KEY=AIza...         # API Key de Google AI Studio (Gemini)
```

---

<p align="center">
  <b>Hecho con dedicación para FUNDACREDESA 🇻🇪</b><br>
  <i>Potenciando la investigación y el conocimiento científico en Venezuela</i>
</p>
