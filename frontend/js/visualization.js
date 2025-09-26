// Archivo para la visualización 3D/2D de la Tierra y cuerpos celestes

let scene, camera, renderer, earth, stars, sun;
let isView3D = true;
let controls;
let simulationSpeed = 1; // días por segundo
let lastTime = 0;
let earthRotationSpeed = 0.001; // velocidad de rotación de la Tierra
let earthOrbitRadius = 30; // radio de la órbita de la Tierra alrededor del Sol
let earthOrbitSpeed = 0.0001; // velocidad de traslación de la Tierra
let earthOrbitAngle = 0; // ángulo actual de la Tierra en su órbita

// Inicializar la visualización 3D de la Tierra
function initEarthVisualization() {
    // Crear escena
    scene = new THREE.Scene();
    
    // Crear cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    
    // Crear renderizador con mejor calidad
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(document.getElementById('earth-canvas').offsetWidth, document.getElementById('earth-canvas').offsetHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('earth-canvas').appendChild(renderer.domElement);
    
    // Añadir controles de órbita mejorados
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.8;
    controls.panSpeed = 0.5;
    controls.minDistance = 5;
    controls.maxDistance = 100;
    
    // Crear el Sol
    createSun();
    
    // Crear la Tierra
    createEarth();
    
    // Crear estrellas de fondo
    createStars();
    
    // Añadir iluminación
    addLights();
    
    // Crear controles de velocidad de simulación
    createSimulationSpeedControls();
    
    // Manejar el redimensionamiento de la ventana
    window.addEventListener('resize', onWindowResize);
    
    // Configurar eventos para los botones de control
    document.getElementById('toggle-view').addEventListener('click', toggleView);
    document.getElementById('zoom-in').addEventListener('click', zoomIn);
    document.getElementById('zoom-out').addEventListener('click', zoomOut);
    
    // Iniciar la animación
    animate();
}

// Crear el modelo 3D de la Tierra
function createEarth() {
    // Crear geometría esférica con más segmentos para mejor calidad
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    
    // Cargar texturas
    const textureLoader = new THREE.TextureLoader();
    
    // Usar texturas de alta calidad
    const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    const earthBumpMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg');
    const earthSpecMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg');
    
    // Crear material con las texturas
    const material = new THREE.MeshPhongMaterial({
        map: earthTexture,
        bumpMap: earthBumpMap,
        bumpScale: 0.05,
        specularMap: earthSpecMap,
        specular: new THREE.Color(0x333333),
        shininess: 15
    });
    
    // Crear la malla
    earth = new THREE.Mesh(geometry, material);
    earth.castShadow = true;
    earth.receiveShadow = true;
    
    // Inclinación del eje de la Tierra (23.5 grados)
    earth.rotation.z = THREE.MathUtils.degToRad(23.5);
    
    // Posicionar la Tierra en su órbita
    updateEarthPosition();
    
    scene.add(earth);
}

// Crear el Sol
function createSun() {
    const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
    const sunTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/sun.jpg');
    
    // Material brillante para el Sol
    const sunMaterial = new THREE.MeshBasicMaterial({
        map: sunTexture,
        emissive: 0xffff00,
        emissiveIntensity: 0.7
    });
    
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    
    // Añadir resplandor al Sol
    const sunLight = new THREE.PointLight(0xffffff, 1.5, 100);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sun.add(sunLight);
    
    scene.add(sun);
    
    // Añadir efecto de resplandor
    const sunGlow = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/glow.png'),
            color: 0xffff00,
            transparent: true,
            blending: THREE.AdditiveBlending
        })
    );
    sunGlow.scale.set(12, 12, 1);
    sun.add(sunGlow);
}

// Crear estrellas de fondo
function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1
    });
    
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

// Añadir iluminación a la escena
function addLights() {
    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Luz direccional (simula el sol)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
}

// Manejar el redimensionamiento de la ventana
function onWindowResize() {
    camera.aspect = document.getElementById('earth-canvas').offsetWidth / document.getElementById('earth-canvas').offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(document.getElementById('earth-canvas').offsetWidth, document.getElementById('earth-canvas').offsetHeight);
}

// Alternar entre vista 3D y 2D
function toggleView() {
    isView3D = !isView3D;
    
    if (isView3D) {
        // Vista 3D
        camera.position.set(0, 0, 5);
        controls.enabled = true;
    } else {
        // Vista 2D (mapa plano)
        camera.position.set(0, 0, 10);
        camera.lookAt(0, 0, 0);
        controls.enabled = false;
    }
    
    document.getElementById('toggle-view').textContent = isView3D ? 'Vista 2D' : 'Vista 3D';
}

// Acercar la cámara
function zoomIn() {
    if (camera.position.z > 3) {
        camera.position.z -= 0.5;
    }
}

// Alejar la cámara
function zoomOut() {
    if (camera.position.z < 10) {
        camera.position.z += 0.5;
    }
}

// Actualizar la posición de la Tierra en su órbita
function updateEarthPosition() {
    if (!earth) return;
    
    // Calcular la posición de la Tierra en su órbita
    const x = Math.cos(earthOrbitAngle) * earthOrbitRadius;
    const z = Math.sin(earthOrbitAngle) * earthOrbitRadius;
    
    earth.position.set(x, 0, z);
}

// Función de animación
function animate(time) {
    requestAnimationFrame(animate);
    
    // Calcular delta time para animación suave independiente de la velocidad de fotogramas
    if (!lastTime) lastTime = time;
    const delta = (time - lastTime) * 0.001; // convertir a segundos
    lastTime = time;
    
    // Actualizar controles de órbita
    controls.update();
    
    // Rotar la Tierra sobre su eje
    if (earth) {
        earth.rotation.y += earthRotationSpeed * delta * simulationSpeed;
    }
    
    // Mover la Tierra en su órbita alrededor del Sol
    earthOrbitAngle += earthOrbitSpeed * delta * simulationSpeed;
    updateEarthPosition();
    
    // Renderizar la escena
    renderer.render(scene, camera);
}

// Función para añadir un marcador en la ubicación de impacto
function addImpactMarker(lat, lon) {
    // Convertir coordenadas geográficas a coordenadas cartesianas
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -2 * Math.sin(phi) * Math.cos(theta);
    const y = 2 * Math.cos(phi);
    const z = 2 * Math.sin(phi) * Math.sin(theta);
    
    // Crear marcador
    const markerGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    
    marker.position.set(x, y, z);
    scene.add(marker);
    
    // Crear efecto de brillo
    const glowGeometry = new THREE.SphereGeometry(0.07, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.5
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    
    glow.position.set(x, y, z);
    scene.add(glow);
    
    // Animar el brillo
    const animateGlow = () => {
        glow.scale.x = 1 + 0.1 * Math.sin(Date.now() * 0.005);
        glow.scale.y = 1 + 0.1 * Math.sin(Date.now() * 0.005);
        glow.scale.z = 1 + 0.1 * Math.sin(Date.now() * 0.005);
        
        requestAnimationFrame(animateGlow);
    };
    
    animateGlow();
    
    return { marker, glow };
}

// Crear controles de velocidad de simulación
function createSimulationSpeedControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'simulation-speed-control';
    controlsContainer.className = 'simulation-controls';
    controlsContainer.innerHTML = `
        <label for="speed-slider">Velocidad de Simulación:</label>
        <input type="range" id="speed-slider" min="0.1" max="10" step="0.1" value="1">
        <span id="speed-value">1 día/segundo</span>
        <button id="speed-days">días/segundo</button>
        <button id="speed-years">años/segundo</button>
    `;
    
    document.getElementById('earth-view').appendChild(controlsContainer);
    
    // Configurar eventos
    document.getElementById('speed-slider').addEventListener('input', function() {
        simulationSpeed = parseFloat(this.value);
        updateSpeedDisplay();
    });
    
    document.getElementById('speed-days').addEventListener('click', function() {
        document.getElementById('speed-days').classList.add('active');
        document.getElementById('speed-years').classList.remove('active');
        earthRotationSpeed = 0.001;
        earthOrbitSpeed = 0.0001;
        updateSpeedDisplay();
    });
    
    document.getElementById('speed-years').addEventListener('click', function() {
        document.getElementById('speed-years').classList.add('active');
        document.getElementById('speed-days').classList.remove('active');
        earthRotationSpeed = 0.365;
        earthOrbitSpeed = 0.0365;
        updateSpeedDisplay();
    });
    
    // Activar el botón de días por defecto
    document.getElementById('speed-days').classList.add('active');
}

// Actualizar la visualización de la velocidad
function updateSpeedDisplay() {
    const speedValue = document.getElementById('speed-value');
    const isDaysMode = document.getElementById('speed-days').classList.contains('active');
    
    if (isDaysMode) {
        speedValue.textContent = `${simulationSpeed.toFixed(1)} días/segundo`;
    } else {
        speedValue.textContent = `${simulationSpeed.toFixed(1)} años/segundo`;
    }
}

// Exportar funciones para uso en otros archivos
window.initEarthVisualization = initEarthVisualization;
window.addImpactMarker = addImpactMarker;

// Inicializar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Pequeño retraso para asegurar que todos los elementos estén cargados
    setTimeout(() => {
        if (document.getElementById('earth-canvas')) {
            initEarthVisualization();
            console.log("Visualización 3D inicializada");
        }
    }, 500);
});