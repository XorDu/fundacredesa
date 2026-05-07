<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bandera_de_Venezuela_%28institucional%29.svg/800px-Bandera_de_Venezuela_%28institucional%29.svg.png" alt="Bandera Venezuela" width="100" />
  
  # 🇻🇪 Portal Interactivo FUNDACREDESA
  
  **Plataforma Web Institucional Moderna, Segura y Potenciada por Inteligencia Artificial**

  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
  [![Vanilla JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![Gemini AI](https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
  [![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)

</div>

---

## 🌟 Visión General

Bienvenido al ecosistema web institucional de **FUNDACREDESA** (Fundación Centro de Estudios sobre Crecimiento y Desarrollo de la Población Venezolana).

Este proyecto representa la **transformación exitosa** de una página estática legacy hacia un **Ecosistema Dinámico de Nueva Generación** soportado por una arquitectura API-REST robusta, una base de datos relacional MySQL, seguridad de grado institucional y un **Asistente de Inteligencia Artificial Generativa (RAG)** capaz de razonar sobre los documentos científicos oficiales de la fundación.

### ¿Qué lo hace diferente?

| Dimensión | Descripción |
| :---: | :--- |
| 🧠 **IA Institucional** | Chatbot RAG potenciado por **Google Gemini 2.5 Flash** que lee, interpreta y responde sobre los PDFs de investigación y el corpus institucional en tiempo real. |
| ⚡ **Ultra Rendimiento** | Frontend construido en **HTML5, CSS3 y Vanilla JS** puro — sin React, sin Vue, sin frameworks pesados. Tiempos de carga en microsegundos con consumo de CPU cercano a 0% gracias al uso intensivo de `IntersectionObserver`. |
| 🔐 **Seguridad de Grado Institucional** | Doble barrera de acceso: **Firewall IP Whitelisting** + **JSON Web Tokens (JWT)**. Todas las consultas a MySQL usan **Prepared Statements** contra inyecciones SQL. |
| 📊 **Panel de Administración** | Gestión visual completa: publicaciones con Drag & Drop, carrusel dinámico, y módulo de recepción de Currículums Vitae — todo sin recargar la página. |
| 📄 **Portal de CVs** | Página oculta para la recepción de Currículums Vitae de postulantes con captcha anti-bots, validación de cédula venezolana y almacenamiento automático. |
| 🗺️ **Mapa Interactivo SVG** | Mapa vectorial de Venezuela con estadísticas dinámicas por estado, alimentado desde el backend. |
| 🚀 **Despliegue en Un Comando** | Script `init_db.js` que construye automáticamente toda la infraestructura de BD (5 tablas, usuario admin, datos iniciales, 16 publicaciones históricas). |

---

## 🏗️ Arquitectura del Sistema

La plataforma sigue un modelo **Cliente-Servidor completamente desacoplado**, garantizando la separación de responsabilidades entre presentación, lógica de negocio y persistencia de datos:

```
fundacredesa/
│
├── 📂 frontend/                      # 🎨 Lado del Cliente (UI/UX)
│   ├── 📂 assets/                    # Recursos estáticos
│   │   ├── 📂 images/               # Logos, iconos, avatares, fotos del carrusel
│   │   ├── 📂 portadas/             # Portadas JPG/PNG de las publicaciones
│   │   ├── 📂 pdf/                  # Documentos PDF de investigaciones
│   │   └── 📂 curricula/            # CVs subidos por postulantes (generado automáticamente)
│   │
│   ├── 📂 css/                       # Hojas de estilo modulares
│   │   ├── variables.css             # 🎨 Tokens de diseño: colores, fuentes, espaciados
│   │   ├── reset.css                 # Normalización cross-browser
│   │   ├── header.css                # Barra de navegación + menú responsive
│   │   ├── hero.css                  # Carrusel principal del hero
│   │   ├── content.css               # Tarjetas de publicaciones y grid de contenido
│   │   ├── estadisticas.css          # Gráficos SVG y barras dinámicas
│   │   ├── mapa.css                  # Mapa interactivo SVG de Venezuela
│   │   ├── nosotros.css              # Página institucional "Sobre Nosotros"
│   │   ├── proyectos.css             # Sección de proyectos activos
│   │   ├── investigaciones.css       # Biblioteca de investigaciones
│   │   ├── publicaciones.css         # Catálogo de publicaciones públicas
│   │   ├── noticias.css              # Feed de noticias institucionales
│   │   ├── chatbot.css               # Widget flotante del asistente IA
│   │   ├── admin.css                 # Panel de administración completo
│   │   ├── curricula.css             # Formulario público de subida de CVs
│   │   └── devpanel.css              # Panel modal "Equipo Desarrollador"
│   │
│   ├── 📂 js/                        # Lógica del cliente (ES6+)
│   │   ├── main.js                   # Controlador principal: slider, observers, chatbot, contadores
│   │   ├── admin.js                  # Panel admin: CRUD publicaciones, sliders, CVs
│   │   ├── login.js                  # Autenticación y almacenamiento JWT
│   │   ├── curricula.js              # Formulario CV: captcha, drag-drop, validación, envío
│   │   └── devpanel.js               # Panel "Equipo Desarrollador" inyectado en footer
│   │
│   └── 📂 pages/                     # Vistas HTML
│       ├── index.html                # 🏠 Landing page (Hero + Publicaciones + Estadísticas + Mapa)
│       ├── publicaciones.html        # Catálogo filtrable de publicaciones
│       ├── estadisticas.html         # Dashboard estadístico con gráficos SVG
│       ├── nosotros.html             # Historia y misión institucional
│       ├── investigaciones.html      # Biblioteca de investigaciones
│       ├── proyectos.html            # Proyectos activos de FUNDACREDESA
│       ├── login.html                # 🔒 Pantalla de inicio de sesión (Admin)
│       ├── admin.html                # 🔒 Panel de control administrativo
│       └── curricula.html            # 📄 Formulario oculto de recepción de CVs
│
├── 📂 backend/                       # ⚙️ Lado del Servidor (Node.js / Express)
│   ├── 📂 config/
│   │   └── db.js                     # Pool de conexiones MySQL (mysql2/promise)
│   ├── 📂 middleware/
│   │   └── auth.js                   # Firewall IP + Verificación JWT Bearer Token
│   ├── 📂 chatbot/
│   │   ├── nlp.js                    # Motor RAG: extracción de PDFs, inyección Gemini, chat
│   │   └── corpus-es.json            # Base de conocimiento institucional (preguntas frecuentes)
│   ├── server.js                     # 🚀 Entrypoint: rutas API, Multer, Express
│   ├── init_db.js                    # 🗄️ Script de inicialización de BD (5 tablas + data)
│   ├── package.json                  # Dependencias Node.js
│   └── .env                          # 🔑 Variables de entorno (secretos, API Keys)
│
├── 📂 documentacion/                 # 📚 Documentación técnica oficial
│   ├── README.md                     # Documentación técnica detallada
│   └── Proyecto_Fundacredesa_Doc.md  # Resumen ejecutivo del proyecto
│
└── README.md                         # 📖 Este archivo
```

---

## 🚀 Guía de Despliegue Rápido

### Paso 1: Requisitos Previos

| Software | Versión Mínima | Propósito |
| :--- | :---: | :--- |
| **Node.js** | v18+ | Runtime del backend y la IA |
| **XAMPP** | Cualquiera | Motor MySQL (puerto 3306) |
| **Navegador moderno** | Chrome/Edge/Firefox | Consumir el frontend |

### Paso 2: Instalación y Arranque

```bash
# 1. Enciende MySQL desde el panel de XAMPP (debe marcar puerto 3306 en verde).

# 2. Navega a la carpeta backend
cd backend

# 3. Instala todas las dependencias de Node.js
npm install

# 4. Inicializa la Base de Datos completa (5 tablas + usuario admin + 16 publicaciones + sliders)
npm run init_db

# 5. Arranca el servidor
npm start
```

### Paso 3: Acceso a la Plataforma

| URL | Descripción |
| :--- | :--- |
| `http://localhost:8080` | 🌐 Portal público (landing page) |
| `http://localhost:8080/login.html` | 🔒 Inicio de sesión del administrador |
| `http://localhost:8080/admin.html` | 🔧 Panel de control administrativo |
| `http://localhost:8080/curricula.html` | 📄 Formulario oculto de recepción de CVs |

> **🔑 Credenciales de administrador por defecto:**  
> Usuario: `fundacredesa` · Contraseña: `fundacredesa123`

> **💡 Verificación de IA:** Al arrancar, deberías ver en la consola:  
> `✅ Inteligencia Artificial Gemini conectada y lista para razonar sobre Fundacredesa.`

### Paso 4: Configuración del `.env`

El archivo `backend/.env` debe contener las siguientes variables:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fundacredesa_db
JWT_SECRET=tu_cadena_secreta_muy_larga_aqui
PORT=8080
ALLOWED_ADMIN_IPS=::1,127.0.0.1,::ffff:127.0.0.1
GEMINI_API_KEY=tu_api_key_de_google_ai_studio
```

---

## 🗄️ Modelo de Base de Datos

El script `init_db.js` construye automáticamente las siguientes 5 tablas:

```
┌──────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│    usuarios       │     │     categorias        │     │    hero_sliders     │
├──────────────────┤     ├──────────────────────┤     ├─────────────────────┤
│ id (PK)          │     │ id (PK)              │     │ id (PK)             │
│ username         │     │ nombre               │     │ titulo              │
│ password_hash    │     │                      │     │ descripcion         │
│ fecha_creacion   │     └──────┬───────────────┘     │ imagen_url          │
└──────────────────┘            │ FK                  │ orden               │
                         ┌──────▼───────────────┐     │ fecha_creacion      │
                         │   publicaciones       │     └─────────────────────┘
                         ├──────────────────────┤
                         │ id (PK)              │     ┌─────────────────────┐
                         │ titulo               │     │     curricula       │
                         │ descripcion          │     ├─────────────────────┤
                         │ portada_url          │     │ id (PK)             │
                         │ pdf_url              │     │ nombre              │
                         │ id_categoria (FK)    │     │ cedula              │
                         │ prioridad            │     │ email               │
                         │ fecha_creacion       │     │ telefono            │
                         └──────────────────────┘     │ area                │
                                                      │ cv_pdf_url          │
                                                      │ fecha_subida        │
                                                      └─────────────────────┘
```

---

## 🔐 Modelo de Seguridad

El acceso al Panel de Administración está protegido por **tres capas de seguridad**:

| Capa | Mecanismo | Ubicación | Descripción |
| :---: | :--- | :--- | :--- |
| **1** | 🛡️ IP Whitelisting | `middleware/auth.js` | Solo IPs listadas en `ALLOWED_ADMIN_IPS` pueden acceder a rutas `/api/*` protegidas. Todas las demás reciben `403 Forbidden`. |
| **2** | 🔑 JWT Bearer Token | `middleware/auth.js` | Tras login exitoso, se emite un token firmado con `jsonwebtoken` válido por **4 horas**. Cada petición administrativa lo debe incluir en el header `Authorization: Bearer <token>`. |
| **3** | 💉 Prepared Statements | `server.js` / `db.js` | Todas las queries MySQL usan `?` placeholders parametrizados, erradicando al 100% el riesgo de SQL Injection. |

---

## 🧠 Inteligencia Artificial (Gemini RAG)

El chatbot asistente virtual utiliza un sistema **Retrieval-Augmented Generation (RAG)** con Google Gemini 2.5 Flash:

1. **Ingesta automática al iniciar:** Lee PDFs de investigaciones, el corpus institucional (`corpus-es.json`) y las estadísticas geográficas del mapa de Venezuela.
2. **System Prompt estricto:** La IA solo responde sobre FUNDACREDESA. No inventa datos. No usa formato Markdown. Prioriza el tono institucional.
3. **Endpoint público:** `POST /api/chat` — cualquier usuario puede consultar desde el widget del chatbot.

---

## 📚 Documentación Completa

Para un análisis técnico profundo de cada módulo, directivas de seguridad, la API REST completa y la lógica de la IA, consulta:

👉 **[Documentación Técnica Oficial](./documentacion/README.md)**

---

## 📋 API REST — Referencia Rápida

| Método | Ruta | Acceso | Descripción |
| :---: | :--- | :---: | :--- |
| `POST` | `/api/auth/login` | 🛡️ IP | Autenticación de administrador |
| `GET` | `/api/categorias` | 🌐 Público | Listar categorías de publicaciones |
| `GET` | `/api/publicaciones` | 🌐 Público | Listar publicaciones con filtro |
| `POST` | `/api/publicaciones` | 🔒 JWT+IP | Crear nueva publicación (PDF + portada) |
| `PUT` | `/api/publicaciones/:id` | 🔒 JWT+IP | Editar metadatos de publicación |
| `DELETE` | `/api/publicaciones/:id` | 🔒 JWT+IP | Eliminar publicación |
| `POST` | `/api/publicaciones/reorder` | 🔒 JWT+IP | Reordenar publicaciones (Drag & Drop) |
| `GET` | `/api/sliders` | 🌐 Público | Listar imágenes del carrusel |
| `POST` | `/api/sliders` | 🔒 JWT+IP | Crear slide del carrusel |
| `PUT` | `/api/sliders/:id` | 🔒 JWT+IP | Editar slide |
| `DELETE` | `/api/sliders/:id` | 🔒 JWT+IP | Eliminar slide |
| `POST` | `/api/sliders/reorder` | 🔒 JWT+IP | Reordenar sliders |
| `POST` | `/api/curricula` | 🌐 Público | Enviar CV (PDF + datos personales) |
| `GET` | `/api/curricula` | 🔒 JWT+IP | Listar CVs recibidos (Admin) |
| `DELETE` | `/api/curricula/:id` | 🔒 JWT+IP | Eliminar CV y archivo físico |
| `POST` | `/api/chat` | 🌐 Público | Enviar mensaje al chatbot IA |

---

<div align="center">
  <i>Desarrollado con dedicación para potenciar la investigación y el conocimiento científico en Venezuela 🇻🇪</i>
</div>

