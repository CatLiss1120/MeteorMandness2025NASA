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
    
    setupVideoModal(); 
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

    const defaultImpactor = {
        name: 'Impactor 2025',
        diameter: 150,
        velocity: 300,
        is_potentially_hazardous_asteroid: true,
        riesgo: 'alto',
        custom: true 
    };
    window.asteroidsForSimulation[defaultImpactor.name] = defaultImpactor;
    addAsteroidToListHTML(defaultImpactor);

    if (!asteroids || asteroids.length === 0) {
        if (Object.keys(window.asteroidsForSimulation).length === 1) { 
            asteroidsListContainer.insertAdjacentHTML('beforeend', `<p>No se encontraron otros asteroides para los filtros seleccionados.</p>`);
        } else {
            asteroidsListContainer.innerHTML = `<p>No se encontraron asteroides para los filtros seleccionados.</p>`;
        }
        updateAsteroidSelect();
        return;
    }

    asteroids.forEach(asteroidData => {
        const diameter = Math.round(asteroidData.estimated_diameter?.meters?.estimated_diameter_max) || asteroidData.diameter || 'Desconocido';
        const velocity = parseFloat(asteroidData.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second).toFixed(2) || asteroidData.velocity || 'Desconocido';
        const asteroid = { name: asteroidData.name, diameter, velocity, is_potentially_hazardous_asteroid: asteroidData.is_potentially_hazardous_asteroid, riesgo: asteroidData.riesgo, custom: asteroidData.custom };
        
        if (!window.asteroidsForSimulation[asteroid.name]) {
            window.asteroidsForSimulation[asteroid.name] = asteroid;
            addAsteroidToListHTML(asteroid);
        }
    });

    updateAsteroidSelect();
}

function addAsteroidToListHTML(asteroid) {
    const asteroidsListContainer = document.getElementById('asteroids-list');
    const lang = window.currentLanguage || localStorage.getItem('language') || 'en';
    const t = window.translations && window.translations[lang] ? window.translations[lang] : {};

    const element = document.createElement('div');
    element.className = 'asteroid-item';
    if (asteroid.is_potentially_hazardous_asteroid || asteroid.riesgo === 'alto') {
        element.classList.add('hazardous');
    }

    const starOrWarn = asteroid.custom ? '⭐' : (asteroid.is_potentially_hazardous_asteroid ? '⚠️' : '');
    const diameterLabel = t['label_diameter'] || 'Diameter:';
    const velocityLabel = t['label_velocity'] || 'Velocity:';
    const riskLabel = t['label_risk'] || 'Risk:';
    const simulateLabel = t['label_simulate'] || 'Simulate Impact';

    element.innerHTML = `<h3>${asteroid.name} ${starOrWarn}</h3>
        <p>${diameterLabel} ${asteroid.diameter} m</p>
        <p>${velocityLabel} ${asteroid.velocity} km/s</p>
        <p>${riskLabel} ${asteroid.riesgo || 'No evaluado'}</p>
        <button class="simulate-btn" data-name="${asteroid.name}">${simulateLabel}</button>`;

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
    if(asteroidData.diameter<=0){
        alert('El diámetro debe ser un número positivo.');
        return;
    }
    if(asteroidData.velocity<=0){
        alert('La velocidad debe ser un número positivo.');
        return;
    }

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

document.getElementById('lang-en').addEventListener('click', () => {
    window.currentLanguage = 'en';
    localStorage.setItem('language', 'en');
    changeLanguage('en');
    document.getElementById('lang-en').classList.add('active');
    document.getElementById('lang-es').classList.remove('active');
    if (window.asteroidsForSimulation) displayAsteroids(Object.values(window.asteroidsForSimulation));
    updateImpactInfo(window.selectedAsteroid);
});

document.getElementById('lang-es').addEventListener('click', () => {
    window.currentLanguage = 'es';
    localStorage.setItem('language', 'es');
    changeLanguage('es');
    document.getElementById('lang-es').classList.add('active');
    document.getElementById('lang-en').classList.remove('active');
    if (window.asteroidsForSimulation) displayAsteroids(Object.values(window.asteroidsForSimulation));
    updateImpactInfo(window.selectedAsteroid);
});

function setupVideoModal() {
    const VIDEO_FOLDER_PATH = '../backend/videos/';
    const playButtons = document.querySelectorAll('.play-video-btn');
    const modal = document.getElementById('video-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const videoContainer = document.getElementById('video-player-container');

    if (!modal || !playButtons.length || !closeModalBtn || !videoContainer) {
        console.error('Faltan elementos del modal en el DOM.');
        return;
    }
    
    const openModal = (videoSrc, shouldLoop) => {
        videoContainer.innerHTML = '';
        const videoElement = document.createElement('video');
        videoElement.src = videoSrc;
        videoElement.controls = true;
        videoElement.autoplay = true;
        videoElement.setAttribute('playsinline', '');
        if (shouldLoop) {
            videoElement.loop = true;
        }
        videoContainer.appendChild(videoElement);
        modal.classList.add('visible');
    };
    
    const closeModal = () => {
        modal.classList.remove('visible');
        videoContainer.innerHTML = '';
    };

    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const videoFileName = button.getAttribute('data-video-src');
            const wantsLoop = button.hasAttribute('data-video-loop');
            if (videoFileName) {
                const fullVideoPath = VIDEO_FOLDER_PATH + videoFileName;
                openModal(fullVideoPath, wantsLoop);
            } else {
                console.warn('El botón no tiene el atributo data-video-src.');
            }
        });
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('visible')) closeModal();
    });
}


function setupTripleClickVideo(triggerElementId, videoOverlayId, videoElementId) {
    const triggerElement = document.getElementById(triggerElementId);
    const videoOverlay = document.getElementById(videoOverlayId);
    const video = document.getElementById(videoElementId);

    if (!triggerElement || !videoOverlay || !video) {
        console.error("Easter Egg: No se encontraron los elementos del DOM. Revisa los IDs.");
        return;
    }

    let clickCount = 0;
    let clickTimer = null;

    const playFullScreenVideo = () => {
        videoOverlay.style.display = 'flex';
        if (videoOverlay.requestFullscreen) {
            videoOverlay.requestFullscreen().catch(err => {
                console.warn(`No se pudo entrar en pantalla completa: ${err.message}`);
            });
        }
        video.play().catch(error => {
            console.error("El video no se pudo reproducir.", error);
        });
    };

    const stopAndHideVideo = () => {
        video.pause();
        video.currentTime = 0;
        videoOverlay.style.display = 'none';
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    };

    triggerElement.addEventListener('click', () => {
        clickCount++;
        if (clickTimer) {
            clearTimeout(clickTimer);
        }
        if (clickCount === 3) {
            playFullScreenVideo();
            clickCount = 0;
        } else {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 500); 
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && videoOverlay.style.display === 'flex') {
            stopAndHideVideo();
        }
    });
}

setupTripleClickVideo('mm', 'video-overlay', 'secret-video');

window.changeLanguage = changeLanguage;
