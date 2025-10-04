window.asteroidsForSimulation = {};

document.addEventListener('DOMContentLoaded', () => {
    showView('earth');

    document.getElementById('search-date').value = new Date().toISOString().split('T')[0];
    handleSearch();

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showView(link.getAttribute('data-view'));
        });
    });

    document.getElementById('search-asteroids').addEventListener('click', handleSearch);

    document.getElementById('create-asteroid-form').addEventListener('submit', (e) => {
        e.preventDefault();
        createCustomAsteroid();
    });

    document.getElementById('asteroid-select').addEventListener('change', checkSimulationReady);

    document.getElementById('set-coords-btn').addEventListener('click', () => {
        const lat = parseFloat(document.getElementById('lat-input').value);
        const lon = parseFloat(document.getElementById('lon-input').value);

        if (!isNaN(lat) && lat >= -90 && lat <= 90 && !isNaN(lon) && lon >= -180 && lon <= 180) {
            if (typeof updateMarkerFromCoords === 'function') {
                updateMarkerFromCoords(lat, lon);
            }
        } else {
            alert('Por favor, introduce una latitud (-90 a 90) y longitud (-180 a 180) válidas.');
        }
    });

    document.getElementById('run-simulation').addEventListener('click', () => {
        if (typeof runImpactSimulationAnimation === 'function') {
            runImpactSimulationAnimation();
        }
    });
});

async function handleSearch() {
    const asteroidsListContainer = document.getElementById('asteroids-list');
    asteroidsListContainer.innerHTML = '<p>Buscando asteroides...</p>';
    try {
        const asteroids = await searchAsteroidsFromApi();
        displayAsteroids(asteroids);
    } catch (error) {
        console.error('Error al buscar asteroides:', error);
        asteroidsListContainer.innerHTML = `<div class="error-message"><strong>Error al cargar los asteroides.</strong><p>Detalles: ${error.message}</p><p>Asegúrate de que el servidor backend (Python) esté corriendo.</p></div>`;
    }
}

function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
    const activeView = document.getElementById(`${viewId}-view`);
    const activeLink = document.querySelector(`nav a[data-view="${viewId}"]`);
    if (activeView) activeView.classList.add('active');
    if (activeLink) activeLink.classList.add('active');
    if (viewId === 'earth') {
        if (typeof initEarthVisualization === 'function') initEarthVisualization();
    } else if (viewId === 'simulation') {
        if (typeof initEarthSimulationCanvas === 'function') initEarthSimulationCanvas();
        updateAsteroidSelect();
    }
}

function displayAsteroids(asteroids) {
    const asteroidsListContainer = document.getElementById('asteroids-list');
    asteroidsListContainer.innerHTML = '';
    window.asteroidsForSimulation = {};
    if (!asteroids || asteroids.length === 0) {
        asteroidsListContainer.innerHTML = `<p>No se encontraron asteroides para los filtros seleccionados.</p>`;
        return;
    }
    asteroids.forEach(asteroidData => {
        const diameter = Math.round(asteroidData.estimated_diameter?.meters?.estimated_diameter_max) || asteroidData.diameter || 'Desconocido';
        const velocity = parseFloat(asteroidData.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second).toFixed(2) || asteroidData.velocity || 'Desconocido';
        const asteroid = { name: asteroidData.name, diameter, velocity, is_potentially_hazardous_asteroid: asteroidData.is_potentially_hazardous_asteroid, riesgo: asteroidData.riesgo, custom: asteroidData.custom };
        window.asteroidsForSimulation[asteroid.name] = asteroid;
        addAsteroidToListHTML(asteroid);
    });
    updateAsteroidSelect();
}

function addAsteroidToListHTML(asteroid) {
    const asteroidsListContainer = document.getElementById('asteroids-list');
    const element = document.createElement('div');
    element.className = 'asteroid-item';
    if (asteroid.is_potentially_hazardous_asteroid || asteroid.riesgo === 'alto') {
        element.classList.add('hazardous');
    }
    element.innerHTML = `<h3>${asteroid.name} ${asteroid.custom ? '⭐' : (asteroid.is_potentially_hazardous_asteroid ? '⚠️' : '')}</h3><p>Diámetro estimado: ${asteroid.diameter} m</p><p>Velocidad relativa: ${asteroid.velocity} km/s</p><p>Riesgo: ${asteroid.riesgo || 'No evaluado'}</p><button class="simulate-btn" data-name="${asteroid.name}">Simular Impacto</button>`;
    element.querySelector('.simulate-btn').addEventListener('click', () => {
        showView('simulation');
        setTimeout(() => {
            document.getElementById('asteroid-select').value = asteroid.name;
            checkSimulationReady();
        }, 50);
    });
    asteroidsListContainer.appendChild(element);
}

async function createCustomAsteroid() {
    const form = document.getElementById('create-asteroid-form');
    const asteroidData = {
        name: document.getElementById('asteroid-name').value.trim(),
        diameter: parseFloat(document.getElementById('asteroid-diameter').value),
        velocity: parseFloat(document.getElementById('asteroid-velocity').value),
        riesgo: document.getElementById('asteroid-risk').value,
        custom: true
    };

    if (!asteroidData.name || isNaN(asteroidData.diameter) || isNaN(asteroidData.velocity)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/asteroids/custom', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(asteroidData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'El servidor no pudo crear el asteroide.');
        }

        const result = await response.json();
        if (result.success) {
            const newAsteroid = result.asteroid;
            window.asteroidsForSimulation[newAsteroid.name] = newAsteroid;
            addAsteroidToListHTML(newAsteroid);
            updateAsteroidSelect();
            form.reset();
            alert(`Asteroide "${newAsteroid.name}" creado con éxito.`);
        }
    } catch (error) {
        console.error('Error al crear asteroide personalizado:', error);
        alert(`Hubo un problema al crear el asteroide: ${error.message}`);
    }
}

function updateAsteroidSelect() {
    const selectElement = document.getElementById('asteroid-select');
    if (!selectElement) return;
    const currentValue = selectElement.value;
    selectElement.innerHTML = '<option value="">Selecciona un asteroide...</option>';
    for (const name in window.asteroidsForSimulation) {
        const asteroid = window.asteroidsForSimulation[name];
        const option = document.createElement('option');
        option.value = name;
        option.textContent = `${name} (${asteroid.diameter} m)`;
        selectElement.appendChild(option);
    }
    selectElement.value = currentValue;
}

function checkSimulationReady() {
    const runButton = document.getElementById('run-simulation');
    const asteroidSelected = document.getElementById('asteroid-select').value !== "";
    const locationSelected = window.selectedImpactPoint != null;
    runButton.disabled = !(asteroidSelected && locationSelected);
}