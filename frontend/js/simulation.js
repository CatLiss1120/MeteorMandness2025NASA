// Funciones para manejar la simulación de impacto

function updateImpactInfo(asteroid) {
    const impactDetails = document.getElementById('impact-details');
    if (!impactDetails) return;

    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    
    if (!asteroid) {
        impactDetails.innerHTML = '<p>Seleccione un asteroide y coordenadas para simular el impacto.</p>';
        return;
    }

    let html = `
        <div class="impact-details">
            <p><strong>Asteroide:</strong> ${asteroid.name}</p>
            <p><strong>Diámetro:</strong> ${asteroid.diameter} metros</p>
            <p><strong>Velocidad:</strong> ${asteroid.velocity} km/s</p>
            <p><strong>Nivel de Riesgo:</strong> ${asteroid.riesgo || 'Desconocido'}</p>
    `;

    if (latitude && longitude) {
        html += `
            <p><strong>Ubicación del Impacto:</strong></p>
            <p>Latitud: ${latitude}°</p>
            <p>Longitud: ${longitude}°</p>
        `;
    }

    html += '</div>';
    impactDetails.innerHTML = html;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const asteroidSelect = document.querySelector('.asteroid-select');
    if (asteroidSelect) {
        asteroidSelect.addEventListener('change', () => {
            const selectedAsteroid = window.asteroidsForSimulation[asteroidSelect.value];
            updateImpactInfo(selectedAsteroid);
        });
    }

    const executeButton = document.getElementById('execute-simulation');
    if (executeButton) {
        executeButton.addEventListener('click', () => {
            const selectedAsteroid = window.asteroidsForSimulation[document.querySelector('.asteroid-select').value];
            if (selectedAsteroid) {
                updateImpactInfo(selectedAsteroid);
            }
        });
    }

    const useCoordinatesButton = document.getElementById('use-coordinates');
    if (useCoordinatesButton) {
        useCoordinatesButton.addEventListener('click', () => {
            const selectedAsteroid = window.asteroidsForSimulation[document.querySelector('.asteroid-select').value];
            updateImpactInfo(selectedAsteroid);
        });
    }
});