# Fundacredesa - Salud Mental en Venezuela

![Fundacredesa](images/logo_fundacredesa.png)

## Descripción

Este proyecto es un sitio web informativo sobre la salud mental en Venezuela, desarrollado por **Fundacredesa**. El sitio presenta estadísticas, propuestas tecnológicas innovadoras y recursos sobre salud mental.

## Requisitos

### Frontend
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para cargar fuentes y iconos)

### Backend (Opcional)
- Python 3.8 o superior
- Flask

## Instalación

### Ver directamente en navegador
Simplemente abre el archivo `index.html` en tu navegador web.

### Con servidor local Python
```bash
# Instalar dependencias
pip install flask

# Ejecutar el servidor
python app.py
# o
python main.py
```

El servidor estará disponible en http://localhost:5000

## Estructura del Proyecto

```
fundacredesa/
├── index.html                   # Página principal
├── script.js                   # Funcionalidad JavaScript principal
├── animations.css              # Animaciones globales
├── enhanced-animations.js      # Animaciones adicionales
├── loading-fix.js              # Fix para pantalla de carga
├── chatbase.js                 # Chat de soporte
├── app.py                      # Servidor Flask
├── main.py                     # Aplicación principal
├── package.json                # Dependencias npm
├── styles/                     # Estilos CSS modulares
│   ├── main.css               # Archivo principal que importa módulos
│   ├── variables.css          # Variables CSS (colores, espaciados)
│   ├── reset.css              # Reset de estilos
│   ├── header.css            # Estilos del encabezado
│   ├── hero.css              # Estilos del hero principal
│   ├── secciones.css         # Estilos de secciones generales
│   ├── statistics.css        # Gráficos y estadísticas
│   ├── propuestas.css        # Propuestas tecnológicas
│   ├── recursos.css          # Recursos y estudios
│   ├── cta.css              # Llamadas a la acción
│   ├── mapa.css             # Mapa interactivo
│   ├── navegacion.css       # Menú de navegación
│   ├── responsive.css       # Diseño responsive
│   └── critico.css         # Estilos críticos
├── images/                    # Imágenes del proyecto
├── portadas/                  # Portadas de estudios
└── Estudios de Fundacredesa/  # Documentos PDF de estudios
```

## Secciones del Sitio

1. **Inicio** - Hero principal sobre salud mental en Venezuela
2. **¿Quiénes somos?** - Información sobre Fundacredesa
3. **Presentación** - Video y contexto sobre salud mental
4. **Estadísticas** - Datos interactivos sobre salud mental en Venezuela
5. **Misión** - Objetivos de Fundacredesa
6. **Propuestas Tecnológicas** - Proyectos de innovación:
   - **PsicoEduca**: Plataforma de psicoeducación en línea gamificada
   - **Memory Vision**: Sistema de diagnóstico y monitoreo de Alzheimer con IA

## Propuestas Tecnológicas

### PsicoEduca
Plataforma de psicoeducación en línea con las siguientes características:
- Interfaz gamificada con sistema de logros
- Contenido personalizado según perfil del usuario
- Seguimiento de progreso y análisis de mejoras
- Comunidad de apoyo integrada
- Accesibilidad multiplataforma

### Memory Vision
Sistema para diagnosticar y monitorear Alzheimer:
- Algoritmos de machine learning avanzados
- Análisis de patrones cognitivos en tiempo real
- Interfaz intuitiva para familiares y cuidadores
- Sistema de alertas personalizables
- Integración con dispositivos wearables

## Colores del Proyecto

- **Rojo:** #C62828
- **Verde:** #388E3C
- **Azul Marino:** #1A237E

## Documentación

La documentación detallada se encuentra en la carpeta `documentacion/`.

## Archivos JavaScript

| Archivo | Descripción |
|---------|-------------|
| `script.js` | Funcionalidad principal: navegación, gráficos, animaciones |
| `enhanced-animations.js` | Animaciones adicionales de scroll |
| `loading-fix.js` | Fix para la pantalla de carga |
| `chatbase.js` | Integración del chat de soporte |

## Navegación

El sitio tiene dos tipos de navegación:
- **Secciones de scroll**: Inicio, ¿Quiénes somos?, Misión (se muestran todas al hacer scroll)
- **Páginas separadas**: Presentación, Estadísticas, Propuestas tecnológicas, Recursos (se muestran individualmente al hacer clic)

## Licencia

Copyright © Fundacredesa
