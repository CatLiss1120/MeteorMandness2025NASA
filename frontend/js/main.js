// Archivo principal de JavaScript para Meteor Madness

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la fecha actual para la búsqueda de asteroides
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('search-date').value = formattedDate;

    // Manejar la navegación entre vistas
    const navLinks = document.querySelectorAll('nav a');
    const views = document.querySelectorAll('.view');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = link.getAttribute('data-view');
            
            // Actualizar enlaces activos
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            // Mostrar la vista seleccionada
            views.forEach(view => {
                if (view.id === `${viewId}-view`) {
                    view.classList.add('active');
                } else {
                    view.classList.remove('active');
                }
            });

    // Configurar eventos para la simulación de impacto
    document.getElementById('run-simulation').addEventListener('click', () => {
        runImpactSimulation();
    });
        });
    });

    // Inicializar la visualización 3D de la Tierra
    setTimeout(() => {
        initEarthVisualization();
    }, 100);

    // Configurar eventos para la búsqueda de asteroides
    document.getElementById('search-asteroids').addEventListener('click', () => {
        const date = document.getElementById('search-date').value;
        searchAsteroids(date);
    });

    // Configurar el formulario de creación de asteroides
    document.getElementById('create-asteroid-form').addEventListener('submit', (e) => {
        e.preventDefault();
        createCustomAsteroid();
    });

    // Configurar el botón de menú
    document.getElementById('user-menu-button').addEventListener('click', () => {
        const menu = document.getElementById('user-menu');
        menu.classList.toggle('hidden');
    });

    // Configurar el selector de idioma
    document.getElementById('lang-es').addEventListener('click', () => {
        document.getElementById('lang-es').classList.add('active');
        document.getElementById('lang-en').classList.remove('active');
        changeLanguage('es');
    });

    document.getElementById('lang-en').addEventListener('click', () => {
        document.getElementById('lang-en').classList.add('active');
        document.getElementById('lang-es').classList.remove('active');
        changeLanguage('en');
    });
    });

    // Configurar eventos para las opciones de mitigación
    document.querySelectorAll('.apply-mitigation').forEach(button => {
        button.addEventListener('click', (e) => {
            const mitigationType = e.target.getAttribute('data-type');
            applyMitigation(mitigationType);
        });
    });


// Función para crear un asteroide personalizado
function createCustomAsteroid() {
    const name = document.getElementById('asteroid-name').value;
    const diameter = document.getElementById('asteroid-diameter').value;
    const velocity = document.getElementById('asteroid-velocity').value;
    const composition = document.getElementById('asteroid-composition').value;

    // Crear objeto de asteroide
    const asteroid = {
        name,
        diameter: parseFloat(diameter),
        velocity: parseFloat(velocity),
        composition,
        custom: true
    };

    // Añadir a la lista de asteroides disponibles
    addAsteroidToList(asteroid);
    
    // Limpiar formulario
    document.getElementById('create-asteroid-form').reset();
    
    // Mostrar mensaje de éxito
    alert(`Asteroide "${name}" creado con éxito`);
}

// Función para añadir un asteroide a la lista
function addAsteroidToList(asteroid) {
    // Añadir a la lista visual
    const asteroidsList = document.getElementById('asteroids-list');
    const asteroidElement = document.createElement('div');
    asteroidElement.classList.add('asteroid-item');
    asteroidElement.innerHTML = `
        <h3>${asteroid.name}</h3>
        <p>Diámetro: ${asteroid.diameter} m</p>
        <p>Velocidad: ${asteroid.velocity} km/s</p>
        <p>Composición: ${getCompositionName(asteroid.composition)}</p>
        <button class="select-asteroid" data-id="${asteroid.name}">Seleccionar</button>
    `;
    asteroidsList.appendChild(asteroidElement);

    // Añadir al selector de asteroides para simulación
    const asteroidSelect = document.getElementById('asteroid-select');
    const option = document.createElement('option');
    option.value = asteroid.name;
    option.textContent = `${asteroid.name} (${asteroid.diameter} m)`;
    asteroidSelect.appendChild(option);

    // Añadir evento al botón de selección
    asteroidElement.querySelector('.select-asteroid').addEventListener('click', () => {
        asteroidSelect.value = asteroid.name;
        // Habilitar el botón de simulación
        document.getElementById('run-simulation').disabled = false;
        // Cambiar a la vista de simulación
        document.querySelector('nav a[data-view="simulation"]').click();
    });
}

// Función para obtener el nombre de la composición
function getCompositionName(composition) {
    const compositions = {
        'rocky': 'Rocoso',
        'metallic': 'Metálico',
        'icy': 'Helado'
    };
    return compositions[composition] || composition;
}

// Función para ejecutar la simulación de impacto
function runImpactSimulation() {
    const asteroidName = document.getElementById('asteroid-select').value;
    if (!asteroidName) {
        alert('Por favor, selecciona un asteroide');
        return;
    }

    // Aquí se implementaría la lógica de simulación de impacto
    // Por ahora, mostraremos un resultado de ejemplo
    const resultsContainer = document.getElementById('simulation-results');
    resultsContainer.innerHTML = `
        <h3>Resultados de la simulación</h3>
        <p>Asteroide: ${asteroidName}</p>
        <p>Ubicación de impacto: 40.7128° N, 74.0060° W (Nueva York)</p>
        <h4>Consecuencias:</h4>
        <ul>
            <li>Cráter de impacto: 2.5 km de diámetro</li>
            <li>Onda de choque: Daños severos en un radio de 50 km</li>
            <li>Energía liberada: Equivalente a 10 megatones de TNT</li>
            <li>Tsunami generado: Olas de hasta 15 metros en costas cercanas</li>
        </ul>
    `;
}

// Función para aplicar mitigación
function applyMitigation(type) {
    const mitigationResults = document.getElementById('mitigation-results');
    let result = '';

    switch (type) {
        case 'kinetic':
            result = `
                <h3>Desviación Cinética Aplicada</h3>
                <p>Se ha enviado un impactador cinético para desviar el asteroide.</p>
                <p>Probabilidad de éxito: 75%</p>
                <p>Tiempo estimado para la desviación: 2 años</p>
            `;
            break;
        case 'gravity':
            result = `
                <h3>Tractor Gravitacional Aplicado</h3>
                <p>Se ha enviado una nave espacial para alterar lentamente la órbita del asteroide.</p>
                <p>Probabilidad de éxito: 90%</p>
                <p>Tiempo estimado para la desviación: 10 años</p>
            `;
            break;
        case 'nuclear':
            result = `
                <h3>Explosión Nuclear Aplicada</h3>
                <p>Se ha enviado un dispositivo nuclear para desviar el asteroide.</p>
                <p>Probabilidad de éxito: 60%</p>
                <p>Tiempo estimado para la desviación: 6 meses</p>
                <p class="warning">Advertencia: Esta opción puede fragmentar el asteroide en múltiples piezas.</p>
            `;
            break;
    }

    mitigationResults.innerHTML = result;
}