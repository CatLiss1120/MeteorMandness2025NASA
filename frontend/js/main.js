// Archivo principal de JavaScript para Meteor Madness

document.addEventListener('DOMContentLoaded', () => {
    // --- INICIALIZACIÓN ---
    
    // Inicializar la fecha actual para la búsqueda de asteroides
    const today = new Date();
    const formattedDate = '2024-10-28';
    document.getElementById('search-date').value = formattedDate;

    // Inicializar simulación de órbitas y simulación de impacto (visualización 3D se inicializa en showView)
    if (typeof initOrbitSimulation === 'function') initOrbitSimulation();
    if (typeof initImpactSimulation === 'function') initImpactSimulation();

    // --- MANEJO DE EVENTOS ---

    // 1. Navegación entre vistas
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = link.getAttribute('data-view');
            showView(viewId);
        });
    });

    // 2. Menú de usuario
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    userMenuButton.addEventListener('click', () => {
        userMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('.menu-option').forEach(option => {
        option.addEventListener('click', () => {
            const action = option.getAttribute('data-action');
            userMenu.classList.add('hidden');
            handleMenuAction(action);
        });
    });
    
    // 3. Búsqueda de asteroides
    document.getElementById('search-asteroids').addEventListener('click', () => {
        const date = document.getElementById('search-date').value;
        if (date) searchAsteroids(date);
    });
    // Realizar una búsqueda inicial al cargar la página
    searchAsteroids(formattedDate);

    // 4. Creación de asteroide personalizado
    document.getElementById('create-asteroid-form').addEventListener('submit', (e) => {
        e.preventDefault();
        createCustomAsteroid();
    });

    // 5. Selector de idioma
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

    // 6. Opciones de mitigación
    document.querySelectorAll('[data-mitigation]').forEach(button => {
        button.addEventListener('click', (e) => {
            const mitigationType = e.target.getAttribute('data-mitigation');
            if (typeof applyMitigation === 'function') applyMitigation(mitigationType);
        });
    });

    // 7. Controles de visualización 3D
    document.getElementById('zoom-in').addEventListener('click', () => {
        if (typeof zoomIn === 'function') zoomIn();
    });
    document.getElementById('zoom-out').addEventListener('click', () => {
        if (typeof zoomOut === 'function') zoomOut();
    });
    document.getElementById('toggle-view').addEventListener('click', () => {
        if (typeof toggleView === 'function') toggleView();
    });
    
    // 8. Selector de asteroides en la vista de simulación
    document.getElementById('asteroid-select').addEventListener('change', checkSimulationReady);

});


// --- FUNCIONES DE LÓGICA ---

// Función para mostrar una vista específica
function showView(viewId) {
    document.querySelectorAll('nav a').forEach(navLink => {
        navLink.classList.toggle('active', navLink.getAttribute('data-view') === viewId);
    });
    document.querySelectorAll('.view').forEach(view => {
        view.classList.toggle('active', view.id === `${viewId}-view`);
    });
    
    // Ocultar el marcador de impacto si no estamos en la vista de simulación
    if (viewId !== 'simulation' && window.impactMarker) {
        if (window.scene) {
            scene.remove(impactMarker.marker);
            scene.remove(impactMarker.glow);
            window.impactMarker = null;
        }
    }
}

// Función para manejar acciones del menú de usuario
function handleMenuAction(action) {
    switch(action) {
        case 'impact-2025':
            showView('simulation');
            // Aquí se podría pre-seleccionar un asteroide específico si existiera
            break;
        case 'create-asteroid':
            showView('asteroids');
            document.querySelector('.create-asteroid').scrollIntoView({ behavior: 'smooth' });
            break;
        case 'mitigation':
            showView('mitigation');
            break;
        case 'other-asteroids':
            showView('asteroids');
            break;
    }
}

// Función para crear un asteroide personalizado
async function createCustomAsteroid() {
    const asteroid = {
        name: document.getElementById('asteroid-name').value,
        diameter: parseFloat(document.getElementById('asteroid-diameter').value),
        velocity: parseFloat(document.getElementById('asteroid-velocity').value),
        composition: document.getElementById('asteroid-composition').value,
        custom: true
    };

    try {
        const response = await fetch('/api/asteroids/custom', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(asteroid)
        });

        if (!response.ok) throw new Error('Error al guardar el asteroide en el servidor.');

        const result = await response.json();
        if (result.success) {
            addAsteroidToList(result.asteroid, true);
            document.getElementById('create-asteroid-form').reset();
            alert(`Asteroide "${asteroid.name}" creado con éxito.`);
        }
    } catch (error) {
        console.error('Error al crear asteroide personalizado:', error);
        alert('Hubo un problema al crear el asteroide.');
    }
}

// Función para añadir un asteroide a la lista visual y al selector de simulación
function addAsteroidToList(asteroid, isCustom) {
    // Añadir a la lista visual
    const asteroidsList = document.getElementById('asteroids-list');
    const asteroidElement = document.createElement('div');
    asteroidElement.classList.add('asteroid-item');
    if(asteroid.hazardous) asteroidElement.classList.add('hazardous');
    
    asteroidElement.innerHTML = `
        <h3>${asteroid.name} ${asteroid.hazardous ? '⚠️' : ''} ${isCustom ? '⭐' : ''}</h3>
        <p>Diámetro: ${asteroid.diameter} m</p>
        <p>Velocidad: ${asteroid.velocity} km/s</p>
        <p>Composición: ${getCompositionName(asteroid.composition)}</p>
        <button class="select-asteroid" data-name="${asteroid.name}">Seleccionar para simulación</button>
    `;
    asteroidsList.appendChild(asteroidElement);

    // Guardar los datos del asteroide para la simulación
    window.asteroidsForSimulation[asteroid.name] = asteroid;

    // Añadir al selector de simulación
    const asteroidSelect = document.getElementById('asteroid-select');
    const option = document.createElement('option');
    option.value = asteroid.name;
    option.textContent = `${asteroid.name} (${asteroid.diameter} m)`;
    asteroidSelect.appendChild(option);

    // Añadir evento al botón de selección
    asteroidElement.querySelector('.select-asteroid').addEventListener('click', () => {
        asteroidSelect.value = asteroid.name;
        showView('simulation');
        checkSimulationReady();
    });
}

// Función para obtener el nombre de la composición (centralizada)
function getCompositionName(composition) {
    const compositions = {
        'rocky': 'Rocoso',
        'metallic': 'Metálico',
        'icy': 'Helado'
    };
    return compositions[composition] || 'Desconocido';
}

// Función para aplicar mitigación
function applyMitigation(type) {
    const mitigationResults = document.getElementById('mitigation-results');
    let resultHTML = '';
    switch(type) {
        case 'kinetic':
            resultHTML = `<h3>Desviación Cinética</h3><p>La nave impacta el asteroide y cambia su trayectoria. Efectividad: alta para asteroides pequeños y medianos. Requiere un tiempo de antelación considerable.</p>`;
            break;
        case 'gravity':
            resultHTML = `<h3>Tractor Gravitacional</h3><p>La nave usa su gravedad para alterar lentamente la órbita del asteroide. Efectividad: media, requiere muchos años de operación.</p>`;
            break;
        case 'nuclear':
            resultHTML = `<h3>Explosión Nuclear</h3><p>Una explosión nuclear cercana vaporiza parte de la superficie del asteroide, empujándolo y cambiando su curso. Efectividad: muy alta, pero con altos riesgos de fragmentación.</p>`;
            break;
    }
    mitigationResults.innerHTML = resultHTML;
}