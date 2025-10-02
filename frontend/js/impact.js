// Archivo para la simulación de impactos de asteroides

let selectedLocation = null; // Guardará { lat, lon }
let impactMarker = null; // Guardará el objeto del marcador 3D

// Variable global para almacenar los asteroides disponibles para simulación
window.asteroidsForSimulation = {};

// Inicializar la simulación de impactos
function initImpactSimulation() {
    // Configurar el evento para ejecutar la simulación
    document.getElementById('run-simulation').addEventListener('click', runImpactSimulation);

    // Añadir evento de clic al canvas principal de la Tierra para seleccionar la ubicación
    const earthCanvas = document.getElementById('earth-canvas');
    if (earthCanvas) {
        earthCanvas.addEventListener('click', handleEarthClick);
    }
}

// Manejar el clic en el globo terráqueo para seleccionar la ubicación del impacto
function handleEarthClick(event) {
    // Solo permitir seleccionar si la vista de simulación está activa
    if (!document.getElementById('simulation-view').classList.contains('active')) {
        return;
    }

    // Obtener coordenadas del clic relativas al canvas
    const rect = event.target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Crear un rayo desde la cámara (necesita acceso a `camera` y `earth` globales de visualization.js)
    if (typeof camera === 'undefined' || typeof earth === 'undefined') return;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    // Comprobar intersección con la Tierra
    const intersects = raycaster.intersectObject(earth);

    if (intersects.length > 0) {
        const point = intersects[0].point;
        
        // Convertir punto de intersección a coordenadas geográficas (latitud y longitud)
        const lat = 90 - (Math.acos(point.y / 2) * 180 / Math.PI); // Radio de la tierra es 2
        const lon = (Math.atan2(point.z, point.x) * 180 / Math.PI) - 90;

        selectedLocation = { lat, lon };

        // Eliminar marcador anterior si existe
        if (impactMarker) {
            scene.remove(impactMarker.marker);
            scene.remove(impactMarker.glow);
        }
        
        // Añadir nuevo marcador visual en el globo 3D
        impactMarker = addImpactMarker(lat, lon); // Función de visualization.js

        // Mostrar información de la ubicación en la UI
        document.querySelector('.impact-location p').textContent =
            `Ubicación: ${lat.toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}, ${lon.toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}`;
        
        checkSimulationReady();
    }
}

// Ejecutar la simulación de impacto llamando al backend
async function runImpactSimulation() {
    const asteroidName = document.getElementById('asteroid-select').value;
    
    if (!asteroidName || !selectedLocation) {
        alert('Por favor, selecciona un asteroide y una ubicación de impacto en el mapa.');
        return;
    }

    const asteroidData = window.asteroidsForSimulation[asteroidName];
    if (!asteroidData) {
        alert('No se encontraron los datos del asteroide seleccionado.');
        return;
    }
    
    const simulationData = {
        asteroid: asteroidData,
        location: selectedLocation
    };

    const resultsContainer = document.getElementById('simulation-results');
    resultsContainer.innerHTML = '<p>Simulando impacto...</p>';

    try {
        const response = await fetch('/api/impact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(simulationData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error en el servidor de simulación.');
        }

        const impactResults = await response.json();
        displayImpactResults(asteroidData, selectedLocation, impactResults);

    } catch (error) {
        console.error('Error en la simulación de impacto:', error);
        resultsContainer.innerHTML = `<p class="error">Error en la simulación: ${error.message}</p>`;
    }
}

// Mostrar los resultados del impacto recibidos del backend
function displayImpactResults(asteroid, location, effects) {
    const resultsContainer = document.getElementById('simulation-results');

    const latStr = `${Math.abs(location.lat).toFixed(2)}° ${location.lat >= 0 ? 'N' : 'S'}`;
    const lonStr = `${Math.abs(location.lon).toFixed(2)}° ${location.lon >= 0 ? 'E' : 'W'}`;
    const terrain = effects.isOcean ? 'Océano' : 'Tierra firme';

    let resultsHTML = `
        <h3>Resultados de la Simulación de Impacto</h3>
        <div class="impact-details">
            <div class="impact-section">
                <h4>Asteroide</h4>
                <p><strong>Nombre:</strong> ${asteroid.name}</p>
                <p><strong>Diámetro:</strong> ${asteroid.diameter} metros</p>
                <p><strong>Velocidad:</strong> ${asteroid.velocity} km/s</p>
            </div>
            <div class="impact-section">
                <h4>Ubicación de Impacto</h4>
                <p><strong>Coordenadas:</strong> ${latStr}, ${lonStr}</p>
                <p><strong>Terreno:</strong> ${terrain}</p>
            </div>
        </div>
        <h4>Efectos del Impacto</h4>
        <ul class="impact-effects">
            <li><strong>Energía liberada:</strong> ${effects.energyMT.toFixed(2)} megatones de TNT</li>
            <li><strong>Diámetro del cráter:</strong> ${effects.craterDiameter.toFixed(2)} km</li>
            <li><strong>Radio de daños severos:</strong> ${effects.blastRadius.toFixed(2)} km</li>
    `;

    if (effects.tsunamiHeight > 0) {
        resultsHTML += `<li><strong>Altura del tsunami:</strong> ${effects.tsunamiHeight.toFixed(2)} metros</li>`;
    }

    resultsHTML += `</ul>`;
    resultsContainer.innerHTML = resultsHTML;
}

// Verificar si se puede habilitar el botón de simulación
function checkSimulationReady() {
    const asteroidSelected = document.getElementById('asteroid-select').value !== "";
    const locationSelected = selectedLocation !== null;
    
    document.getElementById('run-simulation').disabled = !(asteroidSelected && locationSelected);
}

// Exportar funciones para uso en otros archivos
window.initImpactSimulation = initImpactSimulation;
window.checkSimulationReady = checkSimulationReady;