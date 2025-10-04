let sceneSim, cameraSim, rendererSim, earthSim, controlsSim;
window.selectedImpactPoint = null;
let impactMarkerSim = null;

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
    if (controlsSim) controlsSim.update();
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
    const lat = 90 - (Math.acos(point.y / radius) * 180 / Math.PI);
    const lon = (Math.atan2(point.z, point.x) * 180 / Math.PI) - 90;
    document.getElementById('lat-input').value = lat.toFixed(2);
    document.getElementById('lon-input').value = lon.toFixed(2);
    
    if (impactMarkerSim) sceneSim.remove(impactMarkerSim);
    const markerGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xffa500 });
    impactMarkerSim = new THREE.Mesh(markerGeo, markerMat);
    impactMarkerSim.position.copy(point.clone().multiplyScalar(1.01));
    sceneSim.add(impactMarkerSim);
    
    checkSimulationReady();
}

function runImpactSimulationAnimation() {
    if (!window.selectedImpactPoint || !earthSim) {
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
            makeImpactEffect(impactPoint);
            getImpactResults();
        }
    }
    animateFall();
}

async function getImpactResults() {
    const resultsContainer = document.getElementById('simulation-results');
    resultsContainer.innerHTML = `<p>Calculando efectos del impacto...</p>`;

    const asteroidName = document.getElementById('asteroid-select').value;
    const selectedAsteroid = window.asteroidsForSimulation[asteroidName];
    const { lat, lon } = {
        lat: 90 - (Math.acos(window.selectedImpactPoint.y / earthSim.geometry.parameters.radius) * 180 / Math.PI),
        lon: (Math.atan2(window.selectedImpactPoint.z, window.selectedImpactPoint.x) * 180 / Math.PI) - 90
    };

    if (!selectedAsteroid) {
        resultsContainer.innerHTML = `<p class="error">Error: No se encontró el asteroide seleccionado.</p>`;
        return;
    }

    const simulationData = { asteroid: selectedAsteroid, location: { lat, lon } };

    try {
        const response = await fetch('http://localhost:5000/api/impact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(simulationData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error desconocido del servidor');
        }
        const impactEffects = await response.json();
        displayImpactResults(selectedAsteroid, impactEffects);
    } catch (error) {
        console.error('Error al simular impacto:', error);
        resultsContainer.innerHTML = `<p class="error"><strong>Fallo en la simulación:</strong> ${error.message}</p>`;
    }
}

function displayImpactResults(asteroid, effects) {
    const resultsContainer = document.getElementById('simulation-results');
    let consequencesHTML = '';
    if (effects.isOcean) {
        if (effects.tsunamiHeight > 5) {
            consequencesHTML = `<li><strong>¡Alerta de Tsunami!</strong> Se genera una ola de aproximadamente <strong>${effects.tsunamiHeight.toFixed(1)} metros</strong>.</li>`;
        } else {
            consequencesHTML = `<li>Impacto en el océano, pero sin generación de un tsunami significativo.</li>`;
        }
    } else {
        if (effects.blastRadius > 10) {
            consequencesHTML = `<li><strong>Evento Sísmico Mayor:</strong> El impacto podría generar un terremoto de gran magnitud en la región.</li>`;
        } else {
            consequencesHTML = `<li>Devastación local severa, pero sin efectos sísmicos a gran escala.</li>`;
        }
    }
    resultsContainer.innerHTML = `
        <h3>Resultados del Impacto</h3>
        <p><strong>Asteroide:</strong> ${asteroid.name}</p>
        <ul>
            <li><strong>Energía Liberada:</strong> ${effects.energyMT.toFixed(2)} Megatones de TNT</li>
            <li><strong>Diámetro del Cráter:</strong> ${effects.craterDiameter.toFixed(2)} km</li>
            <li><strong>Radio de Devastación:</strong> ${effects.blastRadius.toFixed(2)} km</li>
            ${consequencesHTML}
        </ul>
    `;
}

function makeImpactEffect(point) {
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
    const shockwaveMaterial = new THREE.SpriteMaterial({ map: shockwaveTexture, color: 0xff0000, transparent: true, blending: THREE.AdditiveBlending, opacity: 0.9 });
    const shockwave = new THREE.Sprite(shockwaveMaterial);
    shockwave.position.copy(point);
    shockwave.scale.set(0.1, 0.1, 0.1);
    sceneSim.add(shockwave);
    const waveDuration = 1800;
    const waveStart = performance.now();
    function animateShockwave() {
        const t = (performance.now() - waveStart) / waveDuration;
        if (t < 1) {
            const scale = 4 * t;
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

function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
}