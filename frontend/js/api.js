/// Archivo para la integración con la API de NASA Near-Earth Object (NEO) Web Service

// Ya no necesitamos la clave de la API aquí, se maneja en el backend.

// Buscar asteroides cercanos a la Tierra por fecha, usando nuestro backend
async function searchAsteroids(date) {
    const asteroidsList = document.getElementById('asteroids-list');
    try {
        // Mostrar indicador de carga
        asteroidsList.innerHTML = '<p>Cargando datos de asteroides desde nuestro servidor...</p>';
        
        // Realizar la solicitud a nuestro propio backend
        const response = await fetch(`/api/asteroids?date=${date}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error en el servidor: ${response.status}`);
        }
        
        const asteroids = await response.json();
        
        // Procesar los datos
        processAsteroidsData(asteroids, date);

    } catch (error) {
        console.error('Error al buscar asteroides:', error);
        asteroidsList.innerHTML = `
            <p class="error">Error al cargar datos de asteroides: ${error.message}</p>
            <p>Intenta de nuevo más tarde o usa un asteroide personalizado.</p>
        `;
    }
}

// Procesar los datos de asteroides recibidos del backend
function processAsteroidsData(asteroids, date) {
    const asteroidsList = document.getElementById('asteroids-list');
    
    if (!asteroids || asteroids.length === 0) {
        asteroidsList.innerHTML = `<p>No se encontraron asteroides para la fecha ${date}.</p>`;
        return;
    }
    
    // Limpiar la lista
    asteroidsList.innerHTML = '';
    
    // Añadir cada asteroide a la lista
    asteroids.forEach(asteroidData => {
        const asteroidObj = {
            id: asteroidData.id,
            name: asteroidData.name,
            diameter: Math.round(asteroidData.estimated_diameter.meters.estimated_diameter_max),
            velocity: Math.round(parseFloat(asteroidData.close_approach_data[0].relative_velocity.kilometers_per_second)),
            composition: getRandomComposition(), // La API no proporciona composición, la generamos
            hazardous: asteroidData.is_potentially_hazardous_asteroid,
            custom: false
        };
        
        addAsteroidToList(asteroidObj, false); // No es un asteroide personalizado
    });
}


// --- FUNCIONES AUXILIARES ---

// (Estas funciones se movieron a main.js para centralizar la lógica de la UI)
// Las dejamos aquí por si se usan en otro lado, pero es mejor tenerlas en main.js

// Generar una composición aleatoria para un asteroide
function getRandomComposition() {
    const compositions = ['rocky', 'metallic', 'icy'];
    return compositions[Math.floor(Math.random() * compositions.length)];
}

// Obtener el nombre legible de la composición
function getCompositionName(composition) {
    const compositionNames = {
        'rocky': 'Rocoso',
        'metallic': 'Metálico',
        'icy': 'Helado'
    };
    return compositionNames[composition] || 'Desconocido';
}

// Exportar la función principal para uso en otros archivos
window.searchAsteroids = searchAsteroids;