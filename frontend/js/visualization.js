let scene, camera, renderer, earth, controls;

function initEarthVisualization() {
    const container = document.getElementById('earth-canvas');
    if (!container || container.querySelector('canvas')) return;
    container.innerHTML = '';
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enablePan = false;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    
    scene.add(new THREE.AmbientLight(0x404040));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    createEarthAndStars();
    
    animateMainView();
    
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

function createEarthAndStars() {
    const textureLoader = new THREE.TextureLoader();
    
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
        specularMap: textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular.jpg'),
        shininess: 10
    });
    earth = new THREE.Mesh(geometry, material);
    scene.add(earth);
    
    // --- CÓDIGO PARA LAS ESTRELLAS ---
    const starGeometry = new THREE.SphereGeometry(500, 64, 64);
    const starMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load('https://www.solarsystemscope.com/textures/download/2k_stars.jpg'),
        side: THREE.BackSide
    });
    const stars = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(stars);
}

function animateMainView() {
    requestAnimationFrame(animateMainView);
    if (controls) controls.update();
    if (renderer) renderer.render(scene, camera);
}
/**
 * Se ejecuta cuando la ventana del navegador cambia de tamaño.
 */
function onWindowResize() {
    const container = document.getElementById('earth-canvas');
    if (camera && renderer && container) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
}