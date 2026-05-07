# Historial de Cambios (Changelog) - Proyecto Fundacredesa

Este documento detalla todas las modificaciones, refactorizaciones y nuevas características implementadas en el proyecto durante las recientes fases de desarrollo, organizadas de forma cronológica.

---

## Fase 1: Portal de Recepción de Currículums (CVs)
**Objetivo:** Permitir a los usuarios postularse mediante la subida de un archivo PDF a través de una URL oculta y gestionar los envíos desde el panel administrativo.

### Archivos Creados / Modificados:
*   `frontend/pages/curricula.html`: Nueva vista de usuario con formulario de postulación. Incluye validación de Cédula de Identidad venezolana, un sistema Drag & Drop para subir PDFs y un Captcha matemático de seguridad.
*   `frontend/css/curricula.css`: Hoja de estilos dedicada para las animaciones y diseño del formulario de postulación.
*   `frontend/js/curricula.js`: Lógica del cliente para manejar la subida del archivo asíncronamente vía Fetch API (`FormData`).
*   `backend/server.js`: Se añadió un nuevo endpoint `POST /api/curricula`. Se configuró una nueva instancia de **Multer** específica para los CVs (`cvStorage`), limitando la subida exclusivamente a archivos `.pdf` (peso máximo: 5MB) y guardándolos en la ruta física `frontend/assets/curricula`.
*   `frontend/pages/admin.html`: Se integró una nueva pestaña "Recepciones CV" en la interfaz del panel de control.
*   `frontend/js/admin.js`: Se programó el endpoint del cliente para renderizar la tabla cronológica de CVs, incluyendo botones para visualizar/descargar el PDF y un botón para eliminar el registro.

---

## Fase 2: Panel de Atribución del Equipo Desarrollador (Easter Egg)
**Objetivo:** Crear un componente interactivo tipo "pirámide" inyectable en todas las páginas web para reconocer al equipo de desarrollo (Sebastián, Carlos, María, Valentina, Andrés).

### Archivos Creados / Modificados:
*   `frontend/js/devpanel.js`: Script global que inyecta un panel oculto en el `<body>` y añade un listener (evento) en el texto del Copyright del footer para abrirlo al hacer clic.
*   `frontend/css/devpanel.css`: Estilos visuales del panel flotante. Incorpora el diseño en pirámide, el efecto Glassmorphism y las animaciones de los avatares.
*   **Todas las páginas HTML** (`index.html`, `login.html`, `publicaciones.html`, etc.): Se inyectaron dinámicamente las etiquetas `<link rel="stylesheet" href="../css/devpanel.css">` y `<script src="../js/devpanel.js" defer></script>` a través de un procesamiento por lotes (batch update).

---

## Fase 3: Estandarización de la Base de Datos (Script Portable)
**Objetivo:** Asegurar que el entorno sea "Plug & Play" (100% portable) al clonarlo en cualquier PC nueva, creando las tablas y datos por defecto automáticamente.

### Archivos Modificados:
*   `backend/init_db.js`: Se rediseñó el script de inicialización. 
    *   Se añadió la tabla `curricula` al esquema.
    *   Se añadió la tabla `hero_sliders`.
    *   Se implementó el borrado de tablas (`DROP TABLE IF EXISTS`) en el orden correcto para evitar conflictos de *Foreign Keys* (Claves Foráneas).
    *   Se programó la siembra de datos automática (Admin por defecto, categorías de publicaciones y 16 publicaciones iniciales para pruebas).

---

## Fase 4: Reestructuración Integral de Documentación y Sincronización en GitHub
**Objetivo:** Ofrecer una documentación exhaustiva para futuros desarrolladores y respaldar todo el código en el repositorio central.

### Archivos Creados / Modificados:
*   `README.md` (Raíz): Se reconstruyó desde cero, agregando insignias, diagramas en texto de la arquitectura, resumen tecnológico y guía de uso rápido.
*   `documentacion/README.md`: Documento profundo sobre arquitectura interna. Se documentó cómo el chatbot utiliza IA RAG (`nlp.js`), cómo funciona el firewall de IP Whitelisting (`auth.js`) y el enrutamiento de la API.
*   `documentacion/Proyecto_Fundacredesa_Doc.md`: Resumen ejecutivo actualizado para la directiva, englobando todas las tablas actuales (5 en total).
*   **GitHub Repository**: Se instaló el binario de Git en el servidor local, se configuró la identidad del equipo desarrollador, se inicializó el rastreo, se empaquetó todo el código y se forzó un `git push` a la rama `main` en `https://github.com/XorDu/fundacredesa`.

---

## Fase 5: Clean Code (Desacoplamiento Estructural: CSS vs HTML vs JS)
**Objetivo:** Resolver malas prácticas en el maquetado eliminando todo el código CSS y JS que estuviera incrustado ("inline") directamente dentro del DOM de los archivos HTML.

### Archivos Limpiados y Archivos de Destino:
*   **`login.html`**: Se eliminó un bloque de 150 líneas de `<style>`. Se movió a un archivo nuevo llamado `frontend/css/login.css`.
*   **`admin.html`**: Se eliminaron decenas de atributos `style="..."` (colores, display flex, modales, anchos de tablas). Todos estos se convirtieron en clases reutilizables (como `.modal-overlay`, `.w-145`, `.tab-content`) ubicadas ahora en `frontend/css/admin.css`.
*   **`index.html` e `investigaciones.html`**: Tenían gradientes en duro como `style="background:linear-gradient(135deg,#E87722,#F5A044);"`. Se extrajeron creando clases modulares como `.thumb-gradient-orange` y `.thumb-teal` y se alojaron dentro de `frontend/css/noticias.css`.
*   **`estadisticas.html` y `publicaciones.html`**: Se cambiaron los atributos de `style="padding: 30px 0; background: var(--gray-bg);"` por clases semánticas inyectadas en sus respectivos `.css`.
*   **Javascript extraído (`estadisticas.html`)**: Había una etiqueta `<script>` incrustada que se encargaba de hacer un "Fetch" asíncrono para cargar el mapa SVG interactivo de Venezuela. Se cortó el bloque completo y se anexó ordenadamente al final de `frontend/js/main.js` protegido por un listener `DOMContentLoaded`.

**Resultado Final:**
Toda la interfaz web ha sido abstraída en tres responsabilidades únicas (HTML para Semántica, CSS para Diseño, JS para Lógica). **Existen 0 (cero) etiquetas `<style>` y 0 (cero) atributos `style=` en todo el front-end de la aplicación.**

---

## Fase 6: Remoción de IA y Línea de Tiempo Institucional
**Objetivo:** Limpiar la vista "Nosotros" eliminando elementos flotantes que afectaban el diseño y agregar un componente interactivo para narrar la historia de Fundacredesa.

### Archivos Creados / Modificados:
*   **rontend/pages/nosotros.html**: Se eliminó el código correspondiente al Chatbot (burbuja y panel de IA). Se añadió la estructura HTML para una "Línea de Tiempo" interactiva debajo de la Misión y Visión.
*   **rontend/css/nosotros.css**: Se añadieron estilos avanzados para la Línea de Tiempo, incluyendo nodos con bordes, una línea conectora vertical, efectos de "hover" (escala y sombras) y animaciones de entrada progresivas tipo "fade-up".

## Fase 7: Rediseño y Búsqueda en Publicaciones
**Objetivo:** Mejorar la estética y usabilidad del repositorio de publicaciones, incorporando un buscador en tiempo real y modernizando las tarjetas de presentación, sin alterar el flujo de carga desde la base de datos.

### Archivos Creados / Modificados:
*   **rontend/pages/publicaciones.html**: Se agregó una barra de búsqueda (#pub-search-input) estéticamente diseñada encima de los botones de filtro por categorías.
*   **rontend/js/main.js**: Se refactorizó la función ilterPubs y se implementó pplyFilters(). Ahora el sistema filtra las publicaciones en **tiempo real** (mientras el usuario escribe), buscando coincidencias en el título, descripción y categoría, respetando la pestaña seleccionada.
*   **rontend/css/publicaciones.css**: 
    *   **Barra de búsqueda:** Se aplicó un diseño tipo píldora (border-radius: 30px) con icono integrado, sombras suaves y efecto focus.
    *   **Tarjetas (pub-card):** Se implementaron esquinas redondeadas (12px), un efecto "reveal" de borde lateral naranja en hover, animación de zoom (1.08x) en la portada del libro, y un rediseño del botón de descarga que ahora cambia de azul-verdoso (Teal) a naranja con un ligero desplazamiento.
