# 🧠 Fundacredesa - Salud Mental en Venezuela

> **Socializando el Saber Científico** - Fundación Centro de Estudios sobre Crecimiento y Desarrollo de la Población Venezolana.

## 📝 Descripción

Este proyecto es la plataforma web institucional oficial de **Fundacredesa**. Ha sido rediseñada y reestructurada bajo una arquitectura moderna, escalable y modular para garantizar un excelente rendimiento, mantenimiento sostenible y una grata experiencia de usuario (UX/UI). 

El sitio presenta:
- **📊 Estadísticas Nacionales:** Indicadores epidemiológicos y un mapa interactivo de Venezuela.
- **📚 Repositorio de Publicaciones:** Biblioteca digital de investigaciones científicas en PDF.
- **🤖 Asistente Virtual:** Chatbot interactivo potenciado por Inteligencia Artificial incrustado de forma global.

---

## 🛠️ Tecnologías y Arquitectura

El proyecto está dividido estrictamente en **Frontend** y **Backend** para separar responsabilidades.

### Arquitectura de Carpetas

```text
fundacredesa/
├── backend/
│   └── app.py                  # Servidor Web en Flask (Python) para ruteo local y CORS
├── documentacion/
│   └── README.md               # Documentación técnica avanzada del portal
└── frontend/
    ├── assets/                 # Imágenes, mapa interactivo (SVG) y PDFs descargables
    ├── css/                    # Hojas de estilo modulares (variables.css, hero.css, mapa.css, etc.)
    ├── js/
    │   └── main.js             # Lógica centralizada, segmentada en 10 módulos asíncronos
    └── pages/                  # Vistas principales (index.html, estadisticas.html, publicaciones.html)
```

### Funcionalidades Destacadas (JavaScript puro)
- **Carga Diferida & Intersection Observer:** Componentes que se animan suavemente conforme el usuario hace scroll para optimizar rendimiento.
- **Mapa Interactivo SVG:** Carga asíncrona y manipulación del DOM nativa para mostrar información geolocalizada por cada estado de Venezuela (bug de *flickering* corregido).
- **Generador de Gráficos Nativos:** Creación de gráficos de Torta y Barras matemáticamente mediante SVG, sin necesidad de pesadas librerías externas.
- **Interfaz Universal de IA:** Ventana flotante de Chatbot inyectada globalmente desde `main.js` para brindar asistencia persistente.

---

## 🚀 Instalación y Despliegue Local

Para correr este ecosistema en tu computadora sin problemas de rutas o dependencias de carga (`Error 404`), se configuró un servidor dedicado en Python.

### Requisitos:
- Python 3.8 o superior
- Flask (`pip install flask`)

### Pasos:
1. Asegúrate de estar en la carpeta principal del proyecto.
2. Ejecuta el servidor backend:
   ```bash
   python backend/app.py
   ```
3. Tu terminal mostrará que el servidor está activo.
4. Abre un navegador y visita: `http://localhost:8080`

Todas las rutas internas (`/estadisticas.html`, `/publicaciones.html`) despacharán como una aplicación web nativa funcional.

---

## 🎨 Identidad Visual (UI)

El diseño y componentes repotenciados CSS se rigen por las siguientes variables formales (ubicadas en `frontend/css/variables.css`):
- **Naranja Institucional:** `#E87722`
- **Teal / Cyan Profundo:** `#00B5CC`
- **Gris / Backgrounds:** `#F5F7FA` (Fondo principal) y `#5E6169` (Dark elements)
- **Fuentes tipográficas:** Modernas de Google Fonts: `Inter` (cuerpo general) y `Poppins` (cabeceras).

---

## 👨‍💻 Equipo de Desarrollo

Este rediseño estructural, optimización de código, diseño UI/UX y modularización fue concebido y desarrollado por: 

* **Leonardo** y **Sebastian**  
*(Programadores de Fundacredesa)*

---

*Copyright © Fundacredesa 1976 - 2024*
