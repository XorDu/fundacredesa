# ¡Hola Sebastián! Guía Rápida de FUNDACREDESA

Este documento fue creado especialmente para ti. Aquí te explico cómo levantar todo el ecosistema web y backend de Fundacredesa desde cero en tu máquina local.

El repositorio ya incluye toda la configuración lista (`.env` con claves, dependencias de `node_modules`, etc), ya que es un repositorio privado.

## 🛠️ 1. Requisitos Indispensables

Antes de empezar, asegúrate de tener instalados estos dos programas en tu computadora:
1. **Node.js** (Versión 18 o superior). Puedes descargarlo en [nodejs.org](https://nodejs.org/).
2. **XAMPP** (Para el servidor de Base de Datos MySQL). Puedes descargarlo en [apachefriends.org](https://www.apachefriends.org/).

## 🗄️ 2. Encender la Base de Datos (XAMPP)

El backend de Node.js necesita comunicarse con la base de datos MySQL para consultar publicaciones y validar el inicio de sesión del panel de administración.

1. Abre el panel de control de **XAMPP**.
2. Haz clic en el botón `Start` al lado del módulo **MySQL**. (Asegúrate de que se ponga en verde e indique que corre por el puerto `3306`).
3. *(Opcional)* No necesitas iniciar Apache, pero puedes hacerlo si quieres entrar a `http://localhost/phpmyadmin` para ver las tablas visualmente.

## ⚙️ 3. Ejecutar el Servidor Node.js (Backend)

Nuestro "cerebro" está en la carpeta `backend/`. Este levanta la API, sirve la Inteligencia Artificial de Gemini y maneja la subida de PDFs.

1. Abre una terminal (CMD o PowerShell).
2. Navega hasta la carpeta del backend:
   ```bash
   cd ruta/hacia/fundacredesa/modificado/backend
   ```
3. Ejecuta el inicializador de la Base de Datos (Sólo la primera vez, creará las tablas y el usuario de administrador automáticamente):
   ```bash
   npm run init_db
   ```
4. Enciende el servidor general:
   ```bash
   npm start
   ```
5. Si todo sale bien, verás en la consola mensajes como:
   - *"🚀 Servidor Node.js corriendo dinámicamente en http://localhost:8080"*
   - *"✅ Inteligencia Artificial Gemini conectada y lista para razonar sobre Fundacredesa."*

> [!NOTE]
> **Sobre la Inteligencia Artificial (Gemini RAG):** Al iniciar `npm start`, Node.js leerá los PDF de la carpeta `frontend/assets/pdf/` y extraerá el texto usando `pdf2json`. Ese texto, junto al `corpus-es.json` y los datos del mapa, se incrustan como contexto en la IA de Google Gemini para que responda a los usuarios como un experto institucional.

## 🌐 4. Usar el Frontend (La Página Web)

La arquitectura es desacoplada. El frontend son archivos estáticos que consumen la API de Node.

1. Simplemente ve a la carpeta `frontend/pages/` y abre el archivo `index.html` en tu navegador favorito (Chrome, Edge).
2. Automáticamente el HTML, CSS y JS pedirán la información de las publicaciones a `http://localhost:8080` de manera transparente.

### 🔑 El Panel de Administración
Si quieres subir un nuevo PDF o revista:
- Entra a la página del login *(botón abajo en el footer o navegando a `login.html`)*.
- **Usuario:** `fundacredesa`
- **Contraseña:** `fundacredesa123`
- *(Estos datos se inyectan encriptados por el script `init_db.js`).*

---

¡Eso es todo Sebas! Si necesitas saber cómo funciona un archivo en específico (como `nlp.js` que maneja la Inteligencia Artificial o `main.js` que maneja el frontend), no dudes en revisar sus comentarios internos. El código fuente ha sido profundamente limpiado y documentado. 🚀
