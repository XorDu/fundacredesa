# Documentación del Proyecto Fundacredesa

## Descripción

Este proyecto es un sitio web informativo sobre la salud mental en Venezuela, desarrollado por Fundacredesa. El sitio presenta estadísticas, propuestas tecnológicas y recursos sobre salud mental.

## Estructura del Proyecto

```
fundacredesa/
├── index.html              # Página principal
├── script.js               # Funcionalidad JavaScript
├── animations.css          # Animaciones globales
├── app.py                  # Servidor Python (Flask)
├── main.py                 # Aplicación Python principal
├── documentacion/          # Documentación del proyecto
├── styles/                # Estilos CSS modulares
│   ├── main.css          # Archivo principal que importa todos los módulos
│   ├── variables.css      # Variables CSS globales
│   ├── reset.css          # Reset de estilos
│   ├── header.css        # Encabezado y navegación
│   ├── hero.css          # Sección hero/inicio
│   ├── sections.css      # Secciones generales
│   ├── statistics.css    # Estadísticas y gráficos
│   ├── propuestas.css    # Propuestas tecnológicas
│   ├── recursos.css      # Recursos
│   ├── cta.css           # Llamado a la acción
│   ├── mapa.css          # Estilos del mapa
│   ├── responsive.css    # Diseño responsivo
│   └── navegacion.css    # Estilos de navegación adicionales
├── images/                # Imágenes del proyecto
├── portadas/             # Imágenes de portadas
└── Estudios de Fundacredesa/  # Documentos PDF de estudios
```

## Requisitos del Sistema

### Frontend
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para cargar fuentes y iconos)

### Backend (Opcional - Para servidor local)
- Python 3.8 o superior
- Flask

## Instalación

### Opción 1: Ver directamente en navegador
Simplemente abre el archivo `index.html` en tu navegador web.

### Opción 2: Con servidor local Python
```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar el servidor
python app.py
# o
python main.py
```

El servidor estará disponible en http://localhost:5000

## Explicación de Archivos

### index.html
Archivo HTML principal que contiene toda la estructura del sitio:
- Sección Hero (inicio)
- Sección de Présentation
- Sección de Estadísticas
- Sección de Propuestas Tecnológicas
- Sección de Misión
- Sección de Recursos

### script.js
Funcionalidad JavaScript que incluye:
- Navegación móvil
- Desplazamiento suave entre secciones
- Animación de números en estadísticas
- Gráficos interactivos (circular y barras)
- Control de páginas/secciones independientes

### styles/
Carpeta con todos los módulos CSS del proyecto. El archivo principal `main.css` importa todos los demás archivos.

### animations.css
Define las animaciones globales del sitio:
- Animaciones de entrada (fadeIn, slideIn)
- Animación de pulso (pulse)
- Animación de rebote (bounce)
- Otras animaciones de transición

## Colores del Proyecto

El proyecto utiliza una paleta de colores definida en `variables.css`:
- **Rojo (--color-red):** #C62828 - Color de acento principal
- **Verde (--color-green):** #388E3C - Color de esperanza/salud
- **Azul Marino (--color-navy):** #1A237E - Color institucional
- **Blanco (--color-white):** #FFFFFF
- **Gris (--color-gray):** #4A4A4A

## Secciones del Sitio

1. **Inicio (Hero):** Presentación principal con imagen del logo
2. **Presentación:** Video y contexto sobre salud mental
3. **Estadísticas:** Datos sobre salud mental en Venezuela con gráficos interactivos
4. **Propuestas Tecnológicas:** Proyectos de innovación (PsicoEduca, Memory Vision)
5. **Misión:** Objetivos de Fundacredesa
6. **Recursos:** Estudios y materiales descargables

## Contribuidores

- Fundacredesa
- Equipo de desarrollo

## Licencia

Copyright © Fundacredesa
