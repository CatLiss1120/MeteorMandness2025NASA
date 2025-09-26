// Archivo para la simulación de impactos de asteroides

// Mapa de impacto
let impactMap;
let selectedLocation = null;
let impactMarker = null;

// Inicializar la simulación de impactos
function initImpactSimulation() {
    // Configurar el mapa para seleccionar la ubicación de impacto
    setupImpactMap();
    
    // Configurar el evento para ejecutar la simulación
    document.getElementById('run-simulation').addEventListener('click', simulateImpact);
}

// Configurar el mapa para seleccionar la ubicación de impacto
function setupImpactMap() {
    // En una implementación completa, aquí se crearía un mapa interactivo
    // Por ahora, usaremos un enfoque simplificado con la visualización 3D existente
    
    // Añadir evento de clic al canvas de la Tierra
    const earthCanvas = document.getElementById('earth-canvas');
    
    earthCanvas.addEventListener('click', (event) => {
        // Solo permitir seleccionar ubicación en la vista de simulación
        if (!document.getElementById('simulation-view').classList.contains('active')) {
            return;
        }
        
        // Obtener coordenadas del clic relativas al canvas
        const rect = earthCanvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / earthCanvas.offsetWidth) * 2 - 1;
        const y = -((event.clientY - rect.top) / earthCanvas.offsetHeight) * 2 + 1;
        
        // Crear un rayo desde la cámara
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
        
        // Comprobar intersección con la Tierra
        const intersects = raycaster.intersectObject(earth);
        
        if (intersects.length > 0) {
            // Obtener el punto de intersección
            const point = intersects[0].point.clone().normalize();
            
            // Convertir a coordenadas geográficas (latitud y longitud)
            const lat = 90 - Math.acos(point.y) * 180 / Math.PI;
            const lon = (Math.atan2(point.z, point.x) * 180 / Math.PI + 270) % 360 - 180;
            
            // Guardar la ubicación seleccionada
            selectedLocation = { lat, lon };
            
            // Actualizar o crear el marcador de impacto
            if (impactMarker) {
                // Eliminar marcador anterior
                scene.remove(impactMarker.marker);
                scene.remove(impactMarker.glow);
            }
            
            // Crear nuevo marcador
            impactMarker = addImpactMarker(lat, lon);
            
            // Mostrar información de la ubicación
            document.querySelector('.impact-location p').textContent = 
                `Ubicación seleccionada: ${lat.toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}, ${lon.toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}`;
            
            // Habilitar el botón de simulación si hay un asteroide seleccionado
            if (document.getElementById('asteroid-select').value) {
                document.getElementById('run-simulation').disabled = false;
            }
        }
    });
}

// Simular el impacto de un asteroide
function simulateImpact() {
    // Obtener el asteroide seleccionado
    const asteroidName = document.getElementById('asteroid-select').value;
    if (!asteroidName) {
        alert('Por favor, selecciona un asteroide');
        return;
    }
    
    // Verificar si se ha seleccionado una ubicación
    if (!selectedLocation) {
        alert('Por favor, selecciona una ubicación de impacto en el mapa');
        return;
    }
    
    // Obtener información del asteroide (en una implementación completa, esto vendría de una base de datos)
    // Por ahora, usamos datos de ejemplo
    const asteroid = {
        name: asteroidName,
        diameter: 500, // metros
        velocity: 20,  // km/s
        composition: 'rocky'
    };
    
    // Calcular los efectos del impacto
    const impactEffects = calculateImpactEffects(asteroid, selectedLocation);
    
    // Mostrar los resultados
    displayImpactResults(asteroid, selectedLocation, impactEffects);
}

// Calcular los efectos del impacto
function calculateImpactEffects(asteroid, location) {
    // En una implementación completa, aquí habría cálculos físicos detallados
    // Por ahora, usamos fórmulas simplificadas
    
    // Energía cinética (en megatones de TNT)
    const density = getDensityByComposition(asteroid.composition); // kg/m³
    const mass = (4/3) * Math.PI * Math.pow(asteroid.diameter/2, 3) * density; // kg
    const velocity = asteroid.velocity * 1000; // m/s
    const energy = 0.5 * mass * Math.pow(velocity, 2); // Julios
    const energyMT = energy / 4.184e15; // Conversión a megatones de TNT
    
    // Diámetro del cráter (en km)
    const craterDiameter = 0.012 * Math.pow(asteroid.diameter, 0.85) * Math.pow(asteroid.velocity, 0.3);
    
    // Radio de daños severos (en km)
    const severeRadius = Math.sqrt(energyMT) * 5;
    
    // Altura del tsunami (si el impacto es en el océano)
    // Simplificación: asumimos que es en el océano si la longitud está entre -180 y -20 o entre 20 y 180
    const isOcean = (location.lon < -20 || location.lon > 20);
    const tsunamiHeight = isOcean ? Math.pow(energyMT, 0.25) * 3 : 0;
    
    // Efectos atmosféricos
    const shockwaveRadius = Math.sqrt(energyMT) * 10; // km
    
    return {
        energyMT,
        craterDiameter,
        severeRadius,
        tsunamiHeight,
        shockwaveRadius,
        isOcean
    };
}

// Obtener la densidad según la composición
function getDensityByComposition(composition) {
    switch (composition) {
        case 'rocky':
            return 3000; // kg/m³
        case 'metallic':
            return 8000; // kg/m³
        case 'icy':
            return 1000; // kg/m³
        default:
            return 3000; // kg/m³
    }
}

// Mostrar los resultados del impacto
function displayImpactResults(asteroid, location, effects) {
    const resultsContainer = document.getElementById('simulation-results');
    
    // Formatear ubicación
    const latStr = `${Math.abs(location.lat).toFixed(2)}° ${location.lat >= 0 ? 'N' : 'S'}`;
    const lonStr = `${Math.abs(location.lon).toFixed(2)}° ${location.lon >= 0 ? 'E' : 'W'}`;
    
    // Determinar el tipo de terreno (simplificado)
    const terrain = effects.isOcean ? 'Océano' : 'Tierra firme';
    
    // Crear HTML para los resultados
    let resultsHTML = `
        <h3>Resultados de la Simulación de Impacto</h3>
        <div class="impact-details">
            <div class="impact-section">
                <h4>Asteroide</h4>
                <p><strong>Nombre:</strong> ${asteroid.name}</p>
                <p><strong>Diámetro:</strong> ${asteroid.diameter} metros</p>
                <p><strong>Velocidad:</strong> ${asteroid.velocity} km/s</p>
                <p><strong>Composición:</strong> ${getCompositionName(asteroid.composition)}</p>
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
            <li><strong>Radio de daños severos:</strong> ${effects.severeRadius.toFixed(2)} km</li>
            <li><strong>Radio de la onda de choque:</strong> ${effects.shockwaveRadius.toFixed(2)} km</li>
    `;
    
    // Añadir información sobre tsunami si aplica
    if (effects.isOcean && effects.tsunamiHeight > 0) {
        resultsHTML += `
            <li><strong>Altura del tsunami:</strong> ${effects.tsunamiHeight.toFixed(2)} metros</li>
        `;
    }
    
    // Añadir comparación con eventos históricos
    resultsHTML += `
        </ul>
        <h4>Comparación</h4>
        <p>Este impacto sería ${compareWithHistoricalEvents(effects.energyMT)}</p>
    `;
    
    // Actualizar el contenedor de resultados
    resultsContainer.innerHTML = resultsHTML;
}

// Comparar con eventos históricos
function compareWithHistoricalEvents(energyMT) {
    if (energyMT < 0.015) {
        return "similar a la explosión de Chelyabinsk en 2013 (0.5 megatones)";
    } else if (energyMT < 15) {
        return "similar a la explosión de Tunguska en 1908 (10-15 megatones)";
    } else if (energyMT < 100) {
        return "más potente que la bomba nuclear más grande jamás detonada (50 megatones)";
    } else if (energyMT < 10000) {
        return "similar al impacto que formó el Cráter de Chicxulub y causó la extinción de los dinosaurios (100,000 megatones)";
    } else {
        return "un evento de extinción masiva que podría amenazar a toda la vida en la Tierra";
    }
}

// Exportar funciones para uso en otros archivos
window.initImpactSimulation = initImpactSimulation;
window.simulateImpact = simulateImpact;