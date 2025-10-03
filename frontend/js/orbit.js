// Archivo para la simulación de órbitas de asteroides

// Parámetros orbitales
let orbitParams = {
    a: 1,                  // semi-eje mayor
    e: 1/Math.sqrt(2),     // excentricidad
    i: Math.PI/5,          // inclinación
    omega: Math.PI/4,      // longitud del nodo ascendente
    w: Math.PI/4,          // argumento del perihelio
    T: 120                 // período orbital en segundos
};

// Variables para la visualización de órbitas
let orbitLine, orbitObject;
let clock = 0;

// Inicializar la simulación de órbitas
function initOrbitSimulation() {
    // Crear la línea de la órbita
    createOrbitLine();
    
    // Crear el objeto que se moverá por la órbita
    createOrbitObject();
    
    // Iniciar la animación
    animateOrbit();
}

// Crear la línea que representa la órbita
function createOrbitLine() {
    // Generar puntos para la órbita
    const orbitPoints = generateOrbitPoints();
    
    // Crear geometría de la línea
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    
    // Crear material de la línea
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    
    // Crear la línea
    orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    
    // Añadir a la escena
    window.scene.add(orbitLine);
}

// Generar puntos para la órbita
function generateOrbitPoints() {
    const points = [];
    const numPoints = 100;
    
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const point = calculateOrbitPosition(angle);
        points.push(point);
    }
    
    return points;
}

// Calcular la posición en la órbita para un ángulo dado
function calculateOrbitPosition(angle) {
    // Calcular posición en la elipse
    const r = orbitParams.a * (1 - orbitParams.e * orbitParams.e) / (1 + orbitParams.e * Math.cos(angle));
    
    // Posición en el plano orbital
    let x = r * Math.cos(angle);
    let y = r * Math.sin(angle);
    let z = 0;
    
    // Aplicar inclinación (rotación alrededor del eje Y)
    const xi = x;
    const yi = y * Math.cos(orbitParams.i) - z * Math.sin(orbitParams.i);
    const zi = y * Math.sin(orbitParams.i) + z * Math.cos(orbitParams.i);
    
    // Aplicar longitud del nodo ascendente (rotación alrededor del eje Z)
    const xo = xi * Math.cos(orbitParams.omega) - yi * Math.sin(orbitParams.omega);
    const yo = xi * Math.sin(orbitParams.omega) + yi * Math.cos(orbitParams.omega);
    const zo = zi;
    
    // Aplicar argumento del perihelio (rotación alrededor del eje X)
    const xf = xo;
    const yf = yo * Math.cos(orbitParams.w) - zo * Math.sin(orbitParams.w);
    const zf = yo * Math.sin(orbitParams.w) + zo * Math.cos(orbitParams.w);
    
    return new THREE.Vector3(xf, yf, zf);
}

// Crear el objeto que se moverá por la órbita
function createOrbitObject() {
    // Crear geometría del asteroide
    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
    
    // Crear material del asteroide
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    
    // Crear malla
    orbitObject = new THREE.Mesh(geometry, material);
    
    // Posición inicial
    const initialPosition = calculateOrbitPosition(0);
    orbitObject.position.copy(initialPosition);
    
    // Añadir a la escena
    window.scene.add(orbitObject);
}

// Animar el movimiento del objeto en la órbita
function animateOrbit() {
    // Incrementar el reloj
    clock += 0.01;
    
    // Calcular la anomalía media
    const M = (2 * Math.PI / orbitParams.T) * clock;
    
    // Resolver la ecuación de Kepler para obtener la anomalía excéntrica
    const E = solveKeplerEquation(M);
    
    // Calcular la anomalía verdadera
    const theta = 2 * Math.atan(Math.sqrt((1 + orbitParams.e) / (1 - orbitParams.e)) * Math.tan(E / 2));
    
    // Calcular la posición
    const position = calculateOrbitPosition(theta);
    
    // Actualizar la posición del objeto
    orbitObject.position.copy(position);
    
    // Continuar la animación
    requestAnimationFrame(animateOrbit);
}

// Resolver la ecuación de Kepler (M = E - e * sin(E))
function solveKeplerEquation(M) {
    // Normalizar M entre 0 y 2π
    M = M % (2 * Math.PI);
    
    // Valor inicial de E (aproximación)
    let E = M;
    
    // Tolerancia para la convergencia
    const tol = 1e-8;
    
    // Número máximo de iteraciones
    const maxIter = 100;
    
    // Método de Newton-Raphson
    for (let i = 0; i < maxIter; i++) {
        const f = E - orbitParams.e * Math.sin(E) - M;
        const fPrime = 1 - orbitParams.e * Math.cos(E);
        
        const delta = f / fPrime;
        E = E - delta;
        
        if (Math.abs(delta) < tol) {
            break;
        }
    }
    
    return E;
}

// Función para actualizar los parámetros orbitales
function updateOrbitParameters(params) {
    // Actualizar parámetros
    Object.assign(orbitParams, params);
    
    // Actualizar visualización
    if (orbitLine) {
        window.scene.remove(orbitLine);
        createOrbitLine();
    }
}

// Función para añadir un asteroide con una órbita específica
function addAsteroidWithOrbit(asteroidParams, orbitParams) {
    // Crear objeto de asteroide
    const asteroid = {
        name: asteroidParams.name,
        diameter: asteroidParams.diameter,
        velocity: asteroidParams.velocity,
        composition: asteroidParams.composition,
        orbit: orbitParams
    };
    
    // Añadir a la lista de asteroides
    addAsteroidToList(asteroid);
    
    // Visualizar la órbita
    visualizeAsteroidOrbit(asteroid);
    
    return asteroid;
}

// Visualizar la órbita de un asteroide
function visualizeAsteroidOrbit(asteroid) {
    // Guardar parámetros orbitales actuales
    const originalParams = { ...orbitParams };
    
    // Actualizar parámetros con los del asteroide
    updateOrbitParameters(asteroid.orbit);
    
    // Crear línea de órbita
    createOrbitLine();
    
    // Restaurar parámetros originales
    updateOrbitParameters(originalParams);
}

// Exportar funciones para uso en otros archivos
window.initOrbitSimulation = initOrbitSimulation;
window.updateOrbitParameters = updateOrbitParameters;
window.addAsteroidWithOrbit = addAsteroidWithOrbit;