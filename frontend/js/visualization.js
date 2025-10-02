// Archivo para la visualización 3D/2D de la Tierra y cuerpos celestes

let scene, camera, renderer, earth, stars, controls;
let isView3D = true;

// Inicializar la visualización 3D de la Tierra
function initEarthVisualization() {
    const container = document.getElementById('earth-canvas');
    if (!container) return;

    // Crear escena
    scene = new THREE.Scene();
    
    // Crear cámara
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Crear renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Añadir controles de órbita
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 50;
    
    // Crear la Tierra
    createEarth();
    
    // Crear estrellas de fondo
    createStars();
    
    // Añadir iluminación
    addLights();
    
    // Manejar el redimensionamiento de la ventana
    window.addEventListener('resize', onWindowResize);
    
    // Iniciar la animación
    animate();
}

// Crear el modelo 3D de la Tierra
function createEarth() {
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const texture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    const material = new THREE.MeshPhongMaterial({ map: texture, specularMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_specular.jpg') });
    earth = new THREE.Mesh(geometry, material);
    scene.add(earth);
}

// Crear estrellas de fondo
function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

// Añadir iluminación a la escena
function addLights() {
    scene.add(new THREE.AmbientLight(0x333333));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 3, 5);
    scene.add(light);
}

// Manejar el redimensionamiento de la ventana
function onWindowResize() {
    const container = document.getElementById('earth-canvas');
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Alternar entre vista 3D y 2D
function toggleView() {
    isView3D = !isView3D;
    controls.enabled = isView3D;
    document.getElementById('toggle-view').textContent = isView3D ? 'Vista 2D/3D' : 'Vista Plana';
}

// Acercar y alejar la cámara usando los controles
function zoomIn() {
    controls.dollyIn(1.2);
    controls.update();
}

function zoomOut() {
    controls.dollyOut(1.2);
    controls.update();
}

// Función de animación
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    if (earth) earth.rotation.y += 0.0005;
    renderer.render(scene, camera);
}

// Función para añadir un marcador en la ubicación de impacto
function addImpactMarker(lat, lon) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const radius = 2.05; // Un poco por encima de la superficie de la Tierra (radio 2)

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    const markerGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(x, y, z);
    scene.add(marker);

    const glowMaterial = new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png'),
        color: 0xff0000,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.7
    });
    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.set(0.5, 0.5, 0.5);
    glow.position.set(x, y, z);
    scene.add(glow);

    return { marker, glow };
}

// Exportar funciones para uso global
window.initEarthVisualization = initEarthVisualization;
window.addImpactMarker = addImpactMarker;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.toggleView = toggleView;