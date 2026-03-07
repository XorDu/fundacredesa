# 🧠 FUNDACREDESA WEB - Documentación Técnica Oficial

Bienvenido al repositorio documental del ecosistema web institucional de **FUNDACREDESA** (Fundación Centro de Estudios sobre Crecimiento y Desarrollo de la Población Venezolana). 

Este proyecto fue refactorizado y modernizado para transformar una antigua plantilla estática en una **Aplicación Web Dinámica (SPA-like)**, impulsada por un backend en **Node.js**, una Base de Datos **MySQL**, seguridad estricta y un modelo de Inteligencia Artificial Generativa Local (**Google Gemini 2.5 Flash** avanzado con RAG incorporado).

---

## 🏗️ 1. Arquitectura del Proyecto

El proyecto sigue una arquitectura clásica Cliente-Servidor separada en dos carpetas principales, garantizando que el diseño (UI) y la lógica de negocio (API) convivan en el mismo ecosistema pero sin enredar responsabilidades.

```text
/fundacredesa/modificado/
│
├── /frontend/               # ✅ Lado del Cliente (UI/UX)
│   ├── /assets/             # Imágenes, iconos, portadas y documentos PDF (Base RAG).
│   ├── /css/                # Hojas de estilo estructuradas modularmente (Variables, Secciones, Admin).
│   ├── /js/                 # Lógica interactiva en Vanilla JS (DOM, fetch, IntersectionObservers).
│   └── /pages/              # Vistas HTML (index, nosotros, estadisticas, admin, publicaciones).
│
├── /backend/                # ⚙️ Lado del Servidor (Node.js/Express)
│   ├── /config/             # Conexión asíncrona al Pool de la base de datos MySQL.
│   ├── /middleware/         # Capas de Seguridad (IP Whitelisting VPN y Validadores de Token JWT).
│   ├── /chatbot/            # Motor NLP e Inteligencia Artificial (.json Corpus y Extractor Gemini).
│   ├── server.js            # Archivo Maestro y Entrypoint del servidor (Rutas, Multer, App Listen).
│   ├── init_db.js           # Script autoejecutable para construir tablas y usuario Admin por defecto.
│   └── .env                 # Variables de entorno secretas (Credenciales, Secret JWT, API Key Gemini).
│
└── README.md                # Esta documentación.
```

---

## 🎨 2. Frontend (Interfaz y Experiencia de Usuario)

El Frontend fue codificado utilizando HTML Semántico, **CSS Vainilla 3** y **JavaScript Vainilla (ES6+)**. No se utilizaron frameworks pesados como React ni librerías de estilos como Bootstrap o Tailwind, priorizando el rendimiento a nivel de microsegundos y el control total de las animaciones.

**Ejes Clave:**
- **Modularidad CSS:** La configuración gráfica general reside en `variables.css` (Colores de la marca, fuentes primarias).
- **Animaciones y Rendimiento:** Se utilizan `IntersectionObserver API` en `main.js` para accionar contadores numéricos y revelar tarjetas estelares de publicaciones cuando el usuario hace *scroll*, consumiendo 0% de CPU si el usuario no mueve la pantalla.
- **Gráficos Estadísticos:** Se programaron inyectores visuales en SVG y barras calculadas matemáticamente desde el DOM para graficar estadísticas (Página de Estadística).
- **Mapa Interactivo:** Una implementación basada en vectores `.svg` asíncronos en donde cada click de un estado geográfico renderiza datos dinámicos.

---

## ⚙️ 3. Backend (Node.js Server)

El corazón de la dinámica y la persistencia de datos está en `backend/server.js`. Emplea **Express.js** para exponer Endpoints RESTful y conectar el front con MySQL. 

**Funcionalidades del Servidor:**
1. **Punto Único de Verdad (Single Source of Truth):** Sirve datos reales (Categorías, Publicaciones) desde la base de datos hacia el Front-end vía APIs (ej. `/api/publicaciones`).
2. **Subida Inteligente de Archivos (Multer):** Cuando un investigador utiliza el panel de Administración para publicar un documento, el servidor utiliza `multer` para guardar la "Portada JPG" y el "Documento PDF" localmente en la carpeta `frontend/assets`, renombrándolos con *Timestamps* únicos para evitar sobreescrituras (Ej: `17894123-estudio.pdf`).
3. **Múltiples Módulos:** Implementa un `router` interno para agilizar el guardado, la actualización, el borrado masivo o el reordenamiento drag-and-drop de archivos en la BD.

---

## 🧠 4. Inteligencia Artificial Mente-Local (Gemini 2.5 RAG)

La página ostenta un "Chatbot Asistente" (`backend/chatbot/nlp.js`). Se descartó la versión de preguntas enlatadas básicas. Ahora, Fundacredesa cuenta con una Inteligencia Generativa RAG (Retrieval-Augmented Generation) potenciada por Google Gemini.

**¿Cómo funciona?**
Al iniciarse el servidor (vía `npm start`), el script de Inteligencia Artificial hace lo siguiente:
1. Lee silenciosamente los primeros **Archivos PDF** de la carpeta local de Investigaciones ayudándose del motor `pdf2json`.
2. Lee el **Mapamundi de Estadísticas** (Censos por estados).
3. Lee el archivo `corpus-es.json` con la información filosófica base.
4. Concatena todo esto y se lo inyecta a **Gemini 2.5 Flash** a través de la API Key en el `.env`, adjuntando reglas severas o **System Prompt**: *"Solo puedes hablar de Fundacredesa. No respondas con formatos raros como asteriscos, usa lenguaje profesional..."*.
5. El servidor levanta el endpoint `POST /api/chat` para que el usuario escriba, y la inteligencia en la nube responde en cuestión de segundos, deduciendo y relacionando los PDFs con las intenciones.

---

## 🔐 5. Ciberseguridad Institucional

Dado que la plataforma manipula subidas de archivos gubernamentales (pdfs investigativos), se construyó una doble barrera militar de seguridad:

1. **Firewall de IPs Válidas (Whitelisting):** En `middleware/auth.js`, existe una matriz de IP's configurables a través del archivo `.env` (`ALLOWED_IP`). El servidor bloquea todas las peticiones a la ruta del "Panel de Control" que no vengan expresamente del Localhost o de la red VPN/Oficina designada.
2. **Bóveda JWT (JSON Web Tokens):** Incluso si estás en la computadora permitida, se requiere autenticación. Al iniciar sesión se corrobora el hash con la criptografía `bcryptjs`. Si la contraseña coincide con la BDD, se le entrega al cliente un "Pase JWT" (`verifyToken`) con 4 horas de vida.
3. **Consultas Blindadas:** Todas las llamadas a Base de Datos utilizan **Prepared Statements** (Queries Parametrizadas) aniquilando al 100% cualquier amenaza de SQL Injection (`SELECT * FROM tabla WHERE var = ?`).

---

## 🚀 6. Guía Oficial de Despliegue (Cómo encenderlo)

Si deseas clonar o reiniciar este repositorio en otro computador, sigue las siguientes instrucciones:

### Paso 1: Requisitos
- Instalar **Node.js** (v18 o superior).
- Instalar **XAMPP** (o cualquier gestor MySQL local).

### Paso 2: Base de Datos
1. Inicia **MySQL** a través del panel de control de XAMPP.
2. Abre la consola en la carpeta `backend` e instala dependencias:
   ```bash
   cd backend
   npm install
   ```
3. Inicializa las tablas automáticamente:
   ```bash
   npm run init_db
   ```
   *(Esto creará la base de datos `fundacredesa_db` y agregará a los usuarios con la contraseña inicial de encriptación)*.

### Paso 3: Variables de Entorno `.env`
Cerciórate que dentro de `backend/` exista un archivo `.env` configurado como el siguiente:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fundacredesa_db
JWT_SECRET=tuSuperClaveSecretaJWT_aqui_paraTokenizarSesiones!
PORT=8080
ALLOWED_IP=::1,127.0.0.1
GEMINI_API_KEY=tu_clave_de_google_aistudio_aqui
```

### Paso 4: Arrancar el Servidor Node
Inicia el vigilante asíncrono.
```bash
npm start
```
Observarás en la consola que Express.js se levantó en el puerto `8080`, e inmediatamente saltará la notificación: *"🤖 Inicializando cerebro LLM Gemini 2.5... ✅ Inteligencia Artificial Gemini conectada"*.

### Paso 5: Proyección Web
Una vez el backend esté en ejecución local, podrás abrir el archivo `frontend/pages/index.html` en tu navegador para interactuar con toda la UI. Todas las peticiones fetch de AJAX viajarán transparentemente a tu Node.js en `localhost:8080`.

*(Para el acceso al Panel Admin, la URL en la UI es **fundacredesa/fundacredesa123**).* 🎓
