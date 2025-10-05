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
    renderer.setClearColor(0x000000, 1);
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
    try { textureLoader.crossOrigin = 'anonymous'; } catch(e) { }

    /**
     * Crea una textura de estrellas dibujando puntos aleatorios en un canvas.
     * @param {number} width - Ancho del canvas.
     * @param {number} height - Alto del canvas.
     * @param {number} starCount - Número de estrellas a dibujar.
     * @returns {THREE.CanvasTexture} - La textura lista para usar en Three.js.
     */
    function createProceduralStarTexture(width = 2048, height = 1024, starCount = 1200) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Fondo negro
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);
        
        // Dibujar estrellas
        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = Math.random() * 0.8; // Radio pequeño para las estrellas
            const alpha = 0.6 + Math.random() * 0.4; // Opacidad variable
            
            ctx.beginPath();
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
        return new THREE.CanvasTexture(canvas);
    }
    
    // --- CREACIÓN DE LA TIERRA (sin cambios) ---
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
        specularMap: textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular.jpg'),
        shininess: 20
    });
    earth = new THREE.Mesh(geometry, material);
    scene.add(earth);
    
    try {
        const starTexture = createProceduralStarTexture(2048, 1024, 1400);
        
        starTexture.mapping = THREE.EquirectangularReflectionMapping;
        
        scene.background = starTexture;

    } catch (e) {
        console.error("No se pudo crear el fondo de estrellas procedimental:", e);
        
    }
}
function animateMainView() {
    requestAnimationFrame(animateMainView);
    if (controls) controls.update();
    if (renderer) renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('earth-canvas');
    if (camera && renderer && container) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
}