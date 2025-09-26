// Archivo para la integración con la API de NASA Near-Earth Object (NEO) Web Service

// URL base de la API de NASA NEO
const NASA_API_BASE_URL = 'https://api.nasa.gov/neo/rest/v1';
// Clave de API (en una implementación real, esto debería estar en el backend)
const NASA_API_KEY = 'OHybI1l0bsqhTWbh620V7edWr4JeiffugYsIZC4z'; 

// Buscar asteroides cercanos a la Tierra por fecha
async function searchAsteroids(date) {
    try {
        // Mostrar indicador de carga
        const asteroidsList = document.getElementById('asteroids-list');
        asteroidsList.innerHTML = '<p>Cargando datos de asteroides...</p>';
        
        // Realizar la solicitud a la API
        const response = await fetch(`${NASA_API_BASE_URL}/feed?start_date=${date}&end_date=${date}&api_key=${NASA_API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`Error en la API: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Procesar los datos
        processAsteroidsData(data, date);
    } catch (error) {
        console.error('Error al buscar asteroides:', error);
        document.getElementById('asteroids-list').innerHTML = `
            <p class="error">Error al cargar datos de asteroides: ${error.message}</p>
            <p>Intenta de nuevo más tarde o usa un asteroide personalizado.</p>
        `;
    }
}

// Procesar los datos de asteroides de la API
function processAsteroidsData(data, date) {
    const asteroidsList = document.getElementById('asteroids-list');
    
    // Obtener la lista de asteroides para la fecha especificada
    const asteroids = data.near_earth_objects[date] || [];
    
    if (asteroids.length === 0) {
        asteroidsList.innerHTML = '<p>No se encontraron asteroides para esta fecha.</p>';
        return;
    }
    
    // Limpiar la lista
    asteroidsList.innerHTML = '';
    
    // Añadir cada asteroide a la lista
    asteroids.forEach(asteroid => {
        // Crear objeto de asteroide con los datos relevantes
        const asteroidObj = {
            name: asteroid.name,
            diameter: Math.round(asteroid.estimated_diameter.meters.estimated_diameter_max),
            velocity: Math.round(parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_second)),
            composition: getRandomComposition(), // La API no proporciona composición, así que la generamos aleatoriamente
            hazardous: asteroid.is_potentially_hazardous_asteroid,
            custom: false
        };
        
        // Añadir a la lista visual
        const asteroidElement = document.createElement('div');
        asteroidElement.classList.add('asteroid-item');
        
        // Añadir clase especial si es potencialmente peligroso
        if (asteroidObj.hazardous) {
            asteroidElement.classList.add('hazardous');
        }
        
        asteroidElement.innerHTML = `
            <h3>${asteroidObj.name} ${asteroidObj.hazardous ? '⚠️' : ''}</h3>
            <p>Diámetro: ${asteroidObj.diameter} m</p>
            <p>Velocidad: ${asteroidObj.velocity} km/s</p>
            <p>Composición: ${getCompositionName(asteroidObj.composition)}</p>
            <button class="select-asteroid" data-id="${asteroidObj.name}">Seleccionar</button>
        `;
        asteroidsList.appendChild(asteroidElement);
        
        // Añadir al selector de asteroides para simulación
        addAsteroidToSimulationSelect(asteroidObj);
        
        // Añadir evento al botón de selección
        asteroidElement.querySelector('.select-asteroid').addEventListener('click', () => {
            document.getElementById('asteroid-select').value = asteroidObj.name;
            // Habilitar el botón de simulación
            document.getElementById('run-simulation').disabled = false;
            // Cambiar a la vista de simulación
            document.querySelector('nav a[data-view="simulation"]').click();
        });
        
        // Generar órbita para el asteroide (en una implementación completa, esto vendría de la API)
        generateOrbitForAsteroid(asteroidObj);
    });
}

// Añadir asteroide al selector de simulación
function addAsteroidToSimulationSelect(asteroid) {
    const asteroidSelect = document.getElementById('asteroid-select');
    
    // Verificar si ya existe
    for (const option of asteroidSelect.options) {
        if (option.value === asteroid.name) {
            return; // Ya existe, no añadir duplicado
        }
    }
    
    // Añadir nueva opción
    const option = document.createElement('option');
    option.value = asteroid.name;
    option.textContent = `${asteroid.name} (${asteroid.diameter} m)`;
    asteroidSelect.appendChild(option);
}

// Generar una composición aleatoria para un asteroide
function getRandomComposition() {
    const compositions = ['rocky', 'metallic', 'icy'];
    const randomIndex = Math.floor(Math.random() * compositions.length);
    return compositions[randomIndex];
}

// Generar parámetros orbitales para un asteroide
function generateOrbitForAsteroid(asteroid) {
    // En una implementación completa, estos datos vendrían de la API
    // Por ahora, generamos valores aleatorios
    
    const orbitParams = {
        a: 1 + Math.random() * 2,                // semi-eje mayor
        e: 0.1 + Math.random() * 0.8,            // excentricidad
        i: Math.random() * Math.PI / 2,          // inclinación
        omega: Math.random() * Math.PI * 2,      // longitud del nodo ascendente
        w: Math.random() * Math.PI * 2,          // argumento del perihelio
        T: 60 + Math.random() * 120              // período orbital en segundos
    };
    
    // Añadir parámetros orbitales al asteroide
    asteroid.orbit = orbitParams;
    
    return asteroid;
}

// Exportar funciones para uso en otros archivos
window.searchAsteroids = searchAsteroids;