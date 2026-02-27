# Documentación del Proyecto Fundacredesa

## Descripción

Este proyecto es un sitio web informativo sobre la salud mental en Venezuela, desarrollado por **Fundacredesa**. El sitio presenta estadísticas, propuestas tecnológicas innovadoras y recursos sobre salud mental.

## Estructura del Proyecto

```
fundacredesa/
├── index.html                   # Página principal
├── script.js                   # Funcionalidad JavaScript principal
├── animations.css              # Animaciones globales
├── enhanced-animations.js      # Animaciones adicionales de scroll
├── loading-fix.js              # Fix para pantalla de carga
├── chatbase.js                 # Chat de soporte
├── app.py                      # Servidor Python (Flask)
├── main.py                     # Aplicación Python principal
├── package.json                # Dependencias npm
├── documentacion/              # Documentación del proyecto
├── styles/                     # Estilos CSS modulares
│   ├── main.css              # Archivo principal que importa todos los módulos
│   ├── variables.css         # Variables CSS globales (colores, espaciados)
│   ├── reset.css             # Reset de estilos
│   ├── critico.css           # Estilos críticos para renderizado inicial
│   ├── header.css            # Encabezado
│   ├── navegacion.css        # Menú de navegación
│   ├── hero.css              # Sección hero/inicio
│   ├── sections.css          # Secciones generales
│   ├── statistics.css        # Estadísticas y gráficos
│   ├── propuestas.css        # Propuestas tecnológicas
│   ├── recursos.css          # Recursos
│   ├── cta.css               # Llamado a la acción y footer
│   ├── mapa.css              # Estilos del mapa
│   └── responsive.css        # Diseño responsivo
├── images/                    # Imágenes del proyecto
├── portadas/                  # Imágenes de portadas de estudios
└── Estudios de Fundacredesa/  # Documentos PDF de estudios
```

## Requisitos del Sistema

### Frontend
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para cargar fuentes Google Fonts y iconos Font Awesome)

### Backend (Opcional - Para servidor local)
- Python 3.8 o superior
- Flask

## Instalación

### Opción 1: Ver directamente en navegador
Simplemente abre el archivo `index.html` en tu navegador web.

### Opción 2: Con servidor local Python
```bash
# Instalar dependencias
pip install flask

# Ejecutar el servidor
python app.py
# o
python main.py
```

El servidor estará disponible en http://localhost:5000

## Explicación de Archivos

### Archivos JavaScript

| Archivo | Descripción |
|---------|-------------|
| `script.js` | Funcionalidad principal: navegación, gráficos interactivos, animaciones, control de páginas |
| `enhanced-animations.js` | Animaciones adicionales de scroll y efectos visuales |
| `loading-fix.js` | Fix para la pantalla de carga |
| `chatbase.js` | Integración del chat de soporte |

### index.html
Archivo HTML principal que contiene toda la estructura del sitio:
- Sección Hero (inicio)
- Sección de ¿Quiénes somos?
- Sección de Presentación
- Sección de Estadísticas
- Sección de Misión
- Sección de Propuestas Tecnológicas
- Sección de Recursos

### styles/
Carpeta con todos los módulos CSS del proyecto. El archivo principal `main.css` importa todos los demás archivos.

### animations.css
Define las animaciones globales del sitio:
- Animaciones de entrada (fadeIn, slideIn)
- Animación de pulso (pulse)
- Animación de rebote (bounce)
- Otras animaciones de transición

## Propuestas Tecnológicas

El sitio incluye una sección de propuestas tecnológicas desarrollada por Fundacredesa:

### PsicoEduca
Plataforma de psicoeducación en línea gamificada:
- Interfaz gamificada con sistema de logros
- Contenido personalizado según perfil del usuario
- Seguimiento de progreso y análisis de mejoras
- Comunidad de apoyo integrada
- Accesibilidad multiplataforma

### Memory Vision
Sistema para diagnosticar y monitorear Alzheimer con IA:
- Algoritmos de machine learning avanzados
- Análisis de patrones cognitivos en tiempo real
- Interfaz intuitiva para familiares y cuidadores
- Sistema de alertas personalizables
- Integración con dispositivos wearables

## Colores del Proyecto

El proyecto utiliza una paleta de colores definida en `variables.css`:
- **Rojo (--color-red):** #C62828 - Color de acento principal
- **Verde (--color-green):** #388E3C - Color de esperanza/salud
- **Azul Marino (--color-navy):** #1A237E - Color institucional
- **Blanco (--color-white):** #FFFFFF
- **Gris (--color-gray):** #4A4A4A

## Secciones del Sitio

1. **Inicio (Hero):** Presentación principal sobre salud mental en Venezuela
2. **¿Quiénes somos?:** Información sobre Fundacredesa
3. **Presentación:** Video y contexto sobre salud mental
4. **Estadísticas:** Datos sobre salud mental en Venezuela con gráficos interactivos
5. **Misión:** Objetivos de Fundacredesa
6. **Propuestas Tecnológicas:** Proyectos de innovación (PsicoEduca, Memory Vision)
7. **Recursos:** Estudios y materiales descargables

## Navegación del Sitio

El sitio implementa dos tipos de navegación:

### Secciones de Scroll
Se muestran todas juntas al hacer scroll:
- Inicio
- ¿Quiénes somos?
- Misión

### Páginas Separadas
Se muestran individualmente al hacer clic en el menú:
- Presentación
- Estadísticas
- Propuestas Tecnológicas
- Recursos

## Contribuidores

- Fundacredesa
- Equipo de desarrollo

## Licencia

Copyright © Fundacredesa
