// Variables globales para la simulación
let sceneSim, cameraSim, rendererSim, earthSim, controlsSim;
window.selectedImpactPoint = null;
let impactMarkerSim = null;

// --- Funciones Principales de la Simulación Three.js ---

function initEarthSimulationCanvas() {
    const container = document.getElementById('earth-canvas-simulation');
    if (!container || container.querySelector('canvas')) return;
    container.innerHTML = '';

    sceneSim = new THREE.Scene();
    cameraSim = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    cameraSim.position.z = 5;

    rendererSim = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererSim.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(rendererSim.domElement);

    controlsSim = new THREE.OrbitControls(cameraSim, rendererSim.domElement);
    controlsSim.enableDamping = true;
    controlsSim.autoRotate = false;

    sceneSim.add(new THREE.AmbientLight(0x404040));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    sceneSim.add(directionalLight);
    
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg')
    });
    earthSim = new THREE.Mesh(earthGeometry, earthMaterial);
    sceneSim.add(earthSim);
    
    const starGeometry = new THREE.SphereGeometry(500, 64, 64);
    const starMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load('https://www.solarsystemscope.com/textures/download/2k_stars.jpg'),
        side: THREE.BackSide
    });
    const starField = new THREE.Mesh(starGeometry, starMaterial);
    sceneSim.add(starField);
    
    container.addEventListener('click', handleEarthClickSimulation);
    animateSimulationView();
}

function animateSimulationView() {
    requestAnimationFrame(animateSimulationView);
    if (controlsSim) controlsSim.update(); // Esta línea mantiene la animación de la Tierra
    if (rendererSim) rendererSim.render(sceneSim, cameraSim);
}

function handleEarthClickSimulation(event) {
    const rect = event.target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraSim);
    const intersects = raycaster.intersectObject(earthSim);
    
    if (intersects.length > 0) {
        const point = intersects[0].point;
        updateImpactSelection(point);
    }
}

function updateMarkerFromCoords(lat, lon) {
    if (!earthSim) return;
    const point = latLonToVector3(lat, lon, earthSim.geometry.parameters.radius);
    updateImpactSelection(point);
}

function updateImpactSelection(point) {
    window.selectedImpactPoint = point.clone();
    const radius = earthSim.geometry.parameters.radius;
    const { lat, lon } = vector3ToLatLon(point, radius);
    document.getElementById('lat-input').value = lat.toFixed(2);
    document.getElementById('lon-input').value = lon.toFixed(2);
    
    if (impactMarkerSim) sceneSim.remove(impactMarkerSim);
    const markerGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xffa500 });
    impactMarkerSim = new THREE.Mesh(markerGeo, markerMat);
    impactMarkerSim.position.copy(point.clone().multiplyScalar(1.01));
    sceneSim.add(impactMarkerSim);
    
    if (typeof checkSimulationReady === 'function') {
        checkSimulationReady();
    }
}

// --- Lógica de la Simulación y Animación de Impacto (INTACTA) ---

function runImpactSimulationAnimation() {
    const asteroidName = document.getElementById('asteroid-select').value;
    if (!window.asteroidsForSimulation) {
        alert("Los datos de los asteroides no están cargados.");
        return;
    }
    const selectedAsteroid = window.asteroidsForSimulation[asteroidName];

    if (!window.selectedImpactPoint || !selectedAsteroid) {
        alert("Por favor, selecciona un asteroide y una ubicación en el mapa.");
        return;
    }
    
    const resultsContainer = document.getElementById('simulation-results');
    resultsContainer.innerHTML = `<p>Animando impacto...</p>`;
    if (impactMarkerSim) impactMarkerSim.visible = false;

    const impactPoint = window.selectedImpactPoint;
    const asteroid = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 })
    );
    asteroid.position.copy(impactPoint.clone().multiplyScalar(4));
    sceneSim.add(asteroid);

    const duration = 2000;
    const startTime = performance.now();

    function animateFall() {
        const t = Math.min((performance.now() - startTime) / duration, 1);
        const easedT = 1 - Math.pow(1 - t, 3);
        asteroid.position.lerpVectors(impactPoint.clone().multiplyScalar(4), impactPoint, easedT);
        asteroid.rotation.x += 0.1;
        asteroid.rotation.y += 0.05;
        
        if (t < 1) {
            requestAnimationFrame(animateFall);
        } else {
            sceneSim.remove(asteroid);
            makeImpactEffect(impactPoint, selectedAsteroid); 
            getImpactResults();
        }
    }
    animateFall();
}

function makeImpactEffect(point, asteroid) {
    shakeScreen(500, 0.08);
    const flash = new THREE.PointLight(0xffffff, 100, 20, 2);
    flash.position.copy(point);
    sceneSim.add(flash);
    const flashDuration = 250;
    const flashStart = performance.now();
    function animateFlash() {
        const t = (performance.now() - flashStart) / flashDuration;
        if (t < 1) {
            flash.intensity = 100 * (1 - t);
            requestAnimationFrame(animateFlash);
        } else {
            sceneSim.remove(flash);
        }
    }
    animateFlash();

    const textureLoader = new THREE.TextureLoader();
    const shockwaveTexture = textureLoader.load('https://threejs.org/examples/textures/sprites/disc.png');

    const shockwaveGeo = new THREE.PlaneGeometry(1, 1);
    const shockwaveMat = new THREE.MeshBasicMaterial({
        map: shockwaveTexture,
        color: 0xff0000,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.9,
        depthWrite: false,
        side: THREE.DoubleSide 
    });
    const shockwave = new THREE.Mesh(shockwaveGeo, shockwaveMat);

    shockwave.position.copy(point.clone().multiplyScalar(1.001));
    shockwave.lookAt(new THREE.Vector3(0, 0, 0));
    shockwave.scale.set(0.1, 0.1, 0.1);
    sceneSim.add(shockwave);

    const maxScale = 1.5 + (asteroid.diameter / 60);

    const waveDuration = 1800;
    const waveStart = performance.now();
    function animateShockwave() {
        const t = (performance.now() - waveStart) / waveDuration;
        if (t < 1) {
            const scale = maxScale * t;
            shockwave.scale.set(scale, scale, scale);
            shockwave.material.opacity = 0.9 * (1 - t);
            requestAnimationFrame(animateShockwave);
        } else {
            sceneSim.remove(shockwave);
            if (impactMarkerSim) impactMarkerSim.visible = true;
        }
    }
    animateShockwave();
    if (impactMarkerSim) impactMarkerSim.material.color.setHex(0xff0000);
}

function shakeScreen(duration, intensity) {
    const startTime = performance.now();
    const originalPosition = cameraSim.position.clone();
    function shake() {
        const elapsedTime = performance.now() - startTime;
        if (elapsedTime < duration) {
            const x = originalPosition.x + (Math.random() - 0.5) * intensity;
            const y = originalPosition.y + (Math.random() - 0.5) * intensity;
            cameraSim.position.set(x, y, originalPosition.z);
            requestAnimationFrame(shake);
        } else {
            cameraSim.position.copy(originalPosition);
        }
    }
    shake();
}

// --- CÁLCULO DE RESULTADOS Y LÓGICA DE IMPACTO (SECCIÓN MODIFICADA) ---

async function getImpactResults() {
    const resultsContainer = document.getElementById('simulation-results');
    resultsContainer.innerHTML = `<p>Calculando efectos del impacto...</p>`;

    const asteroidName = document.getElementById('asteroid-select').value;
    const selectedAsteroid = window.asteroidsForSimulation[asteroidName];
    const { lat, lon } = vector3ToLatLon(window.selectedImpactPoint, earthSim.geometry.parameters.radius);

    if (!selectedAsteroid) {
        resultsContainer.innerHTML = `<p class="error">Error: Asteroide seleccionado no encontrado.</p>`;
        return;
    }

    // <-- MODIFICADO: Esta llamada usa nuestra nueva lógica de cuadrícula de alta precisión.
    const localIsOcean = isPointOcean(lat, lon);

    const simulationData = { asteroid: selectedAsteroid, location: { lat, lon }, localIsOcean };

    try {
        const response = await fetch('http://localhost:5000/api/impact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(simulationData),
        });
        
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.statusText}`);
        }

        const impactEffects = await response.json();
        
        impactEffects.isOcean = localIsOcean; // Aseguramos que el resultado sea el de nuestra lógica
        
        if (impactEffects.isOcean && typeof predictTsunamiRisk === 'function') {
            impactEffects.tsunamiZones = predictTsunamiRisk(lat, lon);
        }
        displayImpactResults(selectedAsteroid, impactEffects);

    } catch (error) {
        console.error('Error simulando impacto:', error);
        resultsContainer.innerHTML = `<p class="error"><strong>Fallo en la Simulación:</strong> ${error.message}</p>`;
    }
}

function displayImpactResults(asteroid, effects) {
    const resultsContainer = document.getElementById('simulation-results');
    let consequencesHTML = '';

    if (effects.isOcean) {
        consequencesHTML = `<li><strong>¡Tsunami!</strong> El impacto ha ocurrido en el mar, generando una ola masiva.</li>`;
        if (effects.tsunamiHeight > 0.1) {
             consequencesHTML += `<li>Altura estimada de la ola inicial: <strong>${effects.tsunamiHeight.toFixed(1)} metros</strong>.</li>`;
        }
    } else {
        consequencesHTML = `<li><strong>¡Sismo!</strong> El impacto ha ocurrido en tierra, generando un evento sísmico de gran magnitud.</li>`;
    }
    
    resultsContainer.innerHTML = `
        <h3>Resultados del Impacto</h3>
        <p><strong>Asteroide:</strong> ${asteroid.name}</p>
        <ul>
            ${consequencesHTML}
            <li><strong>Energía Liberada:</strong> ${effects.energyMT.toFixed(2)} Megatones de TNT</li>
            <li><strong>Diámetro del Cráter:</strong> ${effects.craterDiameter.toFixed(2)} km</li>
            <li><strong>Radio de la Explosión:</strong> ${effects.blastRadius.toFixed(2)} km</li>
        </ul>
    `;

    if (effects.isOcean && effects.tsunamiZones && effects.tsunamiZones.length) {
        const zones = effects.tsunamiZones.slice(0, 5).map(z => `
            <li>Costa en lat ${z.coastPoint.lat.toFixed(2)}, lon ${z.coastPoint.lon.toFixed(2)} — a ${Math.round(z.distanceKm)} km</li>
        `).join('');
        resultsContainer.innerHTML += `
            <h4>Zonas Costeras en Riesgo (Estimado)</h4>
            <ul>
                ${zones}
            </ul>
        `;
    }
}

// --- SISTEMA DE CUADRÍCULA DE ALTA PRECISIÓN ---

function latLonToGridNumber(lat, lon) {
    const GRID_COLS = 60; // Más columnas para mayor precisión horizontal
    const GRID_ROWS = 30; // Más filas para mayor precisión vertical

    const normalizedLon = lon + 180;
    const normalizedLat = 90 - lat;

    const col = Math.floor(normalizedLon / (360 / GRID_COLS));
    const row = Math.floor(normalizedLat / (180 / GRID_ROWS));

    const gridNumber = (row * GRID_COLS) + col + 1;
    return gridNumber;
}

// Zonas de Tierra definidas para una cuadrícula de 60x30 (1800 cuadrados)
const LAND_ZONES = [
    // Groenlandia
    { start: 147, end: 151 }, { start: 206, end: 211 }, { start: 266, end: 269 },
    // Norteamérica
    { start: 304, end: 320 }, { start: 365, end: 382 }, { start: 426, end: 444 }, 
    { start: 488, end: 504 }, { start: 549, end: 563 }, { start: 612, end: 622 },
    // Sudamérica
    { start: 674, end: 684 }, { start: 734, end: 745 }, { start: 795, end: 805 },
    { start: 855, end: 864 }, { start: 916, end: 923 }, { start: 977, end: 982 }, 
    { start: 1038, end: 1041 }, { start: 1098, end: 1100 },
    // Europa
    { start: 330, end: 332 }, { start: 388, end: 398 }, { start: 448, end: 458 },
    { start: 509, end: 517 },
    // África
    { start: 567, end: 576 }, { start: 627, end: 638 }, { start: 687, end: 699 },
    { start: 747, end: 759 }, { start: 808, end: 818 }, { start: 869, end: 876 },
    // Asia y Medio Oriente
    { start: 333, end: 350 }, { start: 393, end: 414 }, { start: 453, end: 476 },
    { start: 514, end: 536 }, { start: 575, end: 594 }, { start: 636, end: 652 },
    { start: 698, end: 710 }, { start: 759, end: 768 },
    // Australia
    { start: 1007, end: 1012 }, { start: 1066, end: 1073 }, { start: 1127, end: 1132 },
    // Antártida
    { start: 1621, end: 1800 } 
];

function isPointOcean(lat, lon) {
    const gridNumber = latLonToGridNumber(lat, lon);
    
    for (const zone of LAND_ZONES) {
        if (gridNumber >= zone.start && gridNumber <= zone.end) {
            console.log(`Punto (${lat.toFixed(1)}, ${lon.toFixed(1)}) -> Cuadrícula #${gridNumber}. Resultado: TIERRA (Sismo)`);
            return false; // Es tierra
        }
    }
    
    console.log(`Punto (${lat.toFixed(1)}, ${lon.toFixed(1)}) -> Cuadrícula #${gridNumber}. Resultado: MAR (Tsunami)`);
    return true; // Es océano
}

// --- Funciones de Ayuda (Geográficas) ---

function latLonToVector3(lat, lon, radius) {
    const latRad = lat * Math.PI / 180;
    const lonRad = -lon * Math.PI / 180; // Negativo para que coincida con la textura del mapa
    const x = radius * Math.cos(latRad) * Math.cos(lonRad);
    const y = radius * Math.sin(latRad);
    const z = radius * Math.cos(latRad) * Math.sin(lonRad);
    return new THREE.Vector3(x, y, z);
}

function vector3ToLatLon(vec, radius) {
    const lat = Math.asin(vec.y / radius) * 180 / Math.PI;
    const lon = -Math.atan2(vec.z, vec.x) * 180 / Math.PI; // Negativo para que coincida
    return { lat, lon };
}

function deg2rad(d) { return d * Math.PI / 180; }
function rad2deg(r) { return r * 180 / Math.PI; }

function destinationPoint(lat, lon, bearingDeg, distanceKm) {
    const R = 6371;
    const δ = distanceKm / R;
    const θ = deg2rad(bearingDeg);
    const φ1 = deg2rad(lat);
    const λ1 = deg2rad(lon);
    const φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));
    const λ2 = λ1 + Math.atan2(Math.sin(θ) * Math.sin(δ) * Math.cos(φ1), Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2));
    return { lat: rad2deg(φ2), lon: ((rad2deg(λ2) + 540) % 360) - 180 };
}

function predictTsunamiRisk(lat, lon, opts = {}) {
    const stepKm = opts.stepKm || 25;
    const maxDistanceKm = opts.maxDistanceKm || 6000;
    const bearings = opts.bearings || 48;
    const results = [];
    for (let i = 0; i < bearings; i++) {
        const bearing = i * (360 / bearings);
        let d = stepKm;
        let foundLand = null;
        while (d <= maxDistanceKm) {
            const p = destinationPoint(lat, lon, bearing, d);
            if (!isPointOcean(p.lat, p.lon)) { // Usa nuestra lógica de cuadrícula
                foundLand = p; 
                break; 
            }
            d += stepKm;
        }
        if (foundLand) results.push({ bearing, coastPoint: foundLand, distanceKm: d });
    }
    results.sort((a, b) => a.distanceKm - b.distanceKm);
    return results;
}