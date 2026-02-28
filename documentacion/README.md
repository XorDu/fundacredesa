# Documentación Técnica: Plataforma Web Fundacredesa 2024

Este repositorio contiene la versión estable, modular y optimizada del portal web del **Fundación Centro de Estudios sobre Crecimiento y Desarrollo de la Población Venezolana** (FUNDACREDESA).

El diseño inicial presentaba ciertos fallos arquitectónicos (archivos entrelazados, código duplicado y colisiones CSS/JS) que limitaban la escalabilidad y mantenibilidad. Hoy **el proyecto sigue estrictas reglas de separación de responsabilidades**, usando HTML semántico modular, JS unificado asíncrono y un servidor Flask.

---

## 📂 Arquitectura General

```text
/fundacredesa/modificado/
├── backend/
│   └── app.py                  (Servidor Web Flask en Python)
├── documentacion/
│   └── README.md               (Este archivo técnico)
└── frontend/
    ├── assets/                 (Recursos estáticos: imágenes, portadas PNG y PDFs)
    │   ├── images/
    │   ├── map/                (Mapa en SVG crudo)
    │   ├── pdf/
    │   └── portadas/
    ├── css/                    (Módulos separados y variables)
    ├── js/
    │   └── main.js             (Lógica de negocio total centralizada)
    └── pages/                  (Interfaces visuales: index, estadisticas, publicaciones)
```

> **¿Por qué esta estructura?** 
> Al separar las responsabilidades, si en un futuro necesitas modificar la grilla de publicaciones no correrás riesgo de dañar la página de Estadísticas, ya que sus estilos y archivos están aislados y únicamente coordinados por componentes compartidos (Navbar y Footer).

---

## 🎨 Parte 1: El Ecosistema CSS
El gigantesco archivo `sections.css` fue removido. A cambio, creamos fragmentos que inyectas solamente en donde son necesarios:

1. `variables.css`: **Crucial.** Centraliza todos los tokens de diseño (colores como `--orange: #E87722`, `--teal: #00B5CC` y `--gray-bg: #F5F7FA`, además de tipografías Inter y Poppins). Mueve este archivo si la institución renueva su Identidad Visual.
2. `reset.css`: Elimina los márgenes rústicos por defecto del navegador.
3. `header.css`: Configura la barra superior ("header-top", "header-main", "site-nav"). Contiene la lógica del **navbar global**, que ahora siempre exhibe 3 botones robustos (Inicio, Estadísticas, Publicaciones).
4. `content.css`: Maneja grids base estilo tarjetas para utilería general.
5. `mapa.css`: Aísla específicamente la interacción y panel derecho del mapa interactivo de Venezuela. Se resolvió el "bug" del parpadeo inhabilitando alteraciones de borde (`stroke-width`) durante el estado `:hover`.
6. `estadisticas.css`: Construye los componentes visuales e indicadores para Dashboard de datos (tarjetas, animaciones SVG circulares).
7. `publicaciones.css`: Estiliza el layout responsivo (`display: grid`) de la extensa librería de estudios en PDF.
8. `chatbot.css`: Controla tanto la barra del chat incrustada como la **Burbuja Flotante** para el Chatbot de Inteligencia Artificial conectada a MagicLoops.

---

## ⚡ Parte 2: El Cerebro (JavaScript)
Toda la interactividad en el navegador está en `/frontend/js/main.js`. El script fue diseccionado en **10 módulos documentados en su código**.

**Los módulos más importantes son:**
- **Módulo 7 (SVG Gráficos):** Interviene los divs `symptoms-chart` y `risk-factors-chart` insertándoles por DOM un SVG puro con cálculos polares en Javascript puro. No dependemos de librerías como Chart.js; es rápido y nativo.
- **Módulo 8 (Mapa Venezuela):** Captura el archivo SVG y enruta los clicks de los 24 estados (ID: VE-M para Miranda, VE-V para Zulia...) a un diccionario estático `ESTADOS`. Al darle click a un path interactivo, este inyecta los detalles del Json Local en la interfaz sin recargar la pantalla.
- **Módulo 9 y 10 (Chatbot IA):** Gestiona la conexión `/POST` hacia la API de MagicLoops con animación de `typing`. Inserta y mantiene la **Burbuja universal** ("Float Chatbot") la cual funciona gracias al evento de clase en `chatbot.css` y las validaciones asíncronas de promesa en caso de error de conexión.

---

## 💻 Parte 3: Servidor Local (El Backend)

El servidor `backend/app.py` se encarga de servir tus assets emulando un servidor NGINX para evitar fallos de las políticas _CORS_ en archivos locales (tales como la manipulación del `venezuela.svg`).

*   **¿Como funciona el Custom Router de `app.py`?**
    Al ser inicializado con el root en `/frontend`, utiliza la variable `BASE_DIR` y la función `os.path.basename` para detectar cuándo entras a URLs sin extensión (como un `localhost:8080/estadisticas.html` desde la vista "raíz").
    Si `app.py` detecta un ending `.html`, lo intercepta y redirige invisiblemente el contenido desde `/frontend/pages/` solucionando el *Error 404* de manera definitiva desde cualquier capa visual.


### Cómo iniciar el Proyecto:
1. Abre esta carpeta en Windows.
2. Abre un PowerShell o terminal.
3. Ejecuta estrictamente: `python backend/app.py`
4. Navega a `http://localhost:8080` en tu navegador.
