# 📚 Documentación Técnica Oficial: Plataforma Web Fundacredesa 2024

Este repositorio contiene la versión estable, segura y dinámica del portal web de la **Fundación Centro de Estudios sobre Crecimiento y Desarrollo de la Población Venezolana (FUNDACREDESA)**.

El diseño original presentaba dependencias estáticas que dificultaban la actualización de los documentos públicos. A través de este rediseño, el proyecto se separó en un ecosistema robusto de **Frontend Independiente** y **Backend Node.js (API REST + Seguridad Base de Datos)** que garantiza facilidad de administración y cero intervención manual al código por parte de la Directiva en el futuro.

---

## 📂 1. Arquitectura de Ecosistemas (Carpetas)

El proyecto está dividido en componentes atómicos para prevenir colisiones de Código de Cascada de Estilos (CSS) y proteger la lógica empresarial:

```text
/fundacredesa/modificado/
├── backend/                    (Cerebro del Proyecto: Servidor Node.js)
│   ├── config/
│   │   └── db.js               (Gestión de Conexión a Base de Datos MySQL)
│   ├── middleware/
│   │   └── auth.js             (Anillo de Seguridad: IP Whitelist + JWT Bearer Token)
│   ├── init_db.js              (Script Robot de Auto-Instalación de Base de Datos y Población)
│   └── server.js               (Servidor API RESTful, Enrutador, Subida de Archivos)
│
├── base_de_datos/
│   └── schema.sql              (Modelo físico de Referencia SQL de las tablas del sistema)
│
├── documentacion/
│   └── README.md               (Manual Técnico Oficial - Eres tú ahora mismo)
│
└── frontend/                   (Interfaz de Usuario Responsiva e Interactiva)
    ├── assets/                 (Imágenes, Mapas SVG crudos, Portadas Fotográficas y PDFs Base)
    ├── css/                    (Módulos Aislados de Diseño con Variables Universales)
    ├── js/                     (Client-Side Scripting)
    │   ├── main.js             (Interactividad General: SVG, Gráficos de barra, Mapa, Pestañas)
    │   ├── admin.js            (Controlador CRUD del Panel "La Jefa" con Fetch Bearer)
    │   └── login.js            (Tramitador del inicio de sesión Seguro Frontend LocalStorage)
    └── pages/                  (Interfaces: Index.html, Admin.html, Publicaciones.html, etc.)
```

---

## 🛡️ 2. Seguridad del Backend (Ciberseguridad)

Se aplicaron los estándares de validación Backend más rigurosos para salvaguardar *El Panel Administrativo (admin.html)* de inyecciones, borrados no autorizados y Hackers.

*   **IP Whitelisting (Firewall Local):** El Middleware intercepta a todo aquel que intente inyectar código en la *Ruta API POST, PUT o DELETE* y valida si su dirección IP interna de red pertenece a las IP de la Institución; caso contrario **(Status 403 Forbidden)** los bloqueará radicalmente.
*   **JSON Web Tokens (JWT):** Solamente escribiendo las credenciales legales (`fundacredesa / fundacredesa123`), Node.js tramitará una "Firma Electrónica Criptográfica" vigente por 4 horas que se guarda en el Navegador (LocalStorage). Si un atacante intenta enviar un archivo vía *Postman* sin poseer esta firma, Node lo denegará **(Status 401 Unauthorized)**.
*   **Protección de Contraseñas (BcryptHash):** La contraseña principal nunca se almacena cruda en Base de Datos MySQL. Si alguien robara la BD entera, solo encontraría un hash ilegible (`$2b$10$...`) generado por la librería Militar Libre *Bcrypt*.

---

## 🌐 3. Servidor y Lógica API (Node.js)

`backend/server.js` reemplaza a los antiguos lenguajes y actúa como un poderoso despachador Express de 3 capas:
1.  **Enrutador Estático Universal:** Intercepta la carga del FrontEnd y enruta automáticamente las URL amigables (ej: `/login` en lugar de `/pages/login.html`). Esto corrige nativamente los errores HTTP 404 del usuario final.
2.  **Motor de Archivos (Multer):** Escucha las tramas de los *Form Data* desde el Panel Admnistrativo, decodifica los PDF y Portadas, los renombra aleatoriamente con Timestamp para evitar choques visuales de sistema y los deposita suavemente en `/assets/`.
3.  **CRUD API Asíncrona:** Expone puntos de entrada limpios (GET, PUT, POST y DELETE) hacia `Mysql2` para que la Interfáz pueda consumir dinámicamente las Tarjetas de Publicaciones sin recargar la pantalla.

---

## 🧩 4. Integración del Entorno Frontend

El aspecto visual dejó de heredar estilos sucios y se rediseñó bajo el estándar *BEM (Block, Element, Modifier)* apoyado en Variables CSS (`variables.css`).

1.  **Panel Admin VIP (SortableJS y Fetch):** 
    *   La UI Privada del Administrador está dividida en Modal de Edición Instantánea y Subida.
    *   Implementa arrastre *Drag & Drop* inteligente a través del ratón para que el administrador suba archivos y simplemente seleccione uno y lo mueva un puesto más arriba (SortableJS), lo cual dispara asíncronamente un "Reorder Manual" a MySQL (modificando la columna *<Prioridad>*).
2.  **UI Data Pública (Publicaciones.html):** 
    *   Sustituidos los Arreglos en duro (`Arrays.js`) que obligaban a programar todo cada vez que nacía un archivo.
    *   Implementados bucles asincrónicos `Main.js > fetch('/api/publicaciones')` que pintan las grillas de lectura instantáneamente, respetando la *Categoría* y el *Orden Prioritario Drag-and-Drop* provisto por el Panel de la Junta Directiva.

---

## 🚀 5. Primeros Pasos & Auto-Distribución

Para instalar desde una computadora de Desarrollo:

1.  Asegurarse de poseer instalados: **Node.js (>v16.x)** y **XAMPP (con Apache y MySQL arrancados en Verde)**.
2.  Desplazarse usando CMD o PowerShell a la carpeta del backend: `cd fundacredesa/modificado/backend`
3.  Permitir la instalación de módulos Node: `npm install`
4.  Formatear la Base de Datos con toda la Data Original ya restaurada: `npm run init_db`
5.  Mantener la Máquina viva: `npm start` *(o `node server.js`)*.
6.  Entrar al portal FrontEnd Oficial accediendo a `http://localhost:8080`.
7.  Entrar al Panel de Cuartel abriendo `http://localhost:8080/admin`. *(Credenciales en este doc: Sec 2)*.

---

## 🛠️ 6. Troubleshooting: Solución de Problemas (IPs y Puertos)

En caso de enfrentarse a un "Fallo de Conexión" o que el LogIn empiece a devolver **Error 404** o **Error 403 Forbidden**, el personal de sistemas debe verificar los siguientes elementos:

*   **Error 404 (Process Zombie):** Significa que hay un proceso oculto amarrado al puerto 8080 robándose el tráfico. Abra PowerShell como administrador y ejecute `netstat -ano | findstr 8080` para obtener el ID de Proceso (PID). Luego mártelo con `taskkill /PID <EL_NUMERITO> /F` y vuelva a encender el Node con `npm start`.
*   **Error 403 (IP Bloqueada):** El Firewall de Whitelisting (`backend/middleware/auth.js`) denegó el acceso porque la máquina cliente no está configurada como segura. Si está trabajando en Producción (hosting externo), debe crear un archivo `.env` en el directorio de Backend e introducir allí explícitamente las IP públicas del Ministerio que tienen autorización administrativa así: `ALLOWED_ADMIN_IPS=123.456.78.9, 127.0.0.1`
*   **Base de Datos No Responde:** Asegúrese estrictamente de que el botón verde de **MySQL** esté iluminado en el programa XAMPP y no existan colisiones de software con el puerto 3306.
