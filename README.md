# Meteor Madness

Aplicación web interactiva y colaborativa que simula cuerpos celestes e impactos de asteroides sobre la Tierra, con visualización 3D/2D, generación de asteroides por usuario, simulaciones de impactos y opciones de mitigación.

## Características principales

- Visualización 3D/2D de la Tierra y cuerpos celestes
- Simulación de órbitas de asteroides
- Integración con NASA Near-Earth Object (NEO) Web Service API
- Generación de asteroides personalizados
- Simulación de impactos y sus consecuencias
- Opciones de mitigación de impactos
- Reportes detallados de consecuencias

## Tecnologías

- Frontend: HTML, CSS, JavaScript (Three.js para visualización 3D)
- Backend: Python (Flask)
- Control de versiones: Git

## Estructura del proyecto

```
MeteorMadness/
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── main.js
│   │   ├── visualization.js
│   │   ├── orbit.js
│   │   ├── impact.js
│   │   └── api.js
│   └── assets/
│       ├── textures/
│       ├── models/
│       └── images/
├── backend/
│   ├── app.py
│   ├── nasa_api.py
│   ├── orbit_calculator.py
│   └── impact_simulator.py
└── docs/
    └── api_documentation.md
```

## Instalación

1. Clonar el repositorio
2. Instalar dependencias del frontend
3. Instalar dependencias del backend: `pip install -r requirements.txt`
4. Configurar las claves de API de la NASA
5. Ejecutar el servidor backend: `python backend/app.py`
6. Abrir `frontend/index.html` en el navegador

## Colaboración

Este proyecto está configurado para la colaboración de un equipo de 5 personas. Por favor, sigue las convenciones de Git para contribuir al proyecto.