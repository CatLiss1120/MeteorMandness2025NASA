// Funciones para manejar la simulación de impacto

function updateImpactInfo(asteroid) {
    
    const impactDetails = document.getElementById('simulation-results');
    if (!impactDetails) return;

    const lang = window.currentLanguage || localStorage.getItem('language') || 'en';
    const t = window.translations?.[lang] || {};

    const latitudeInput = document.getElementById('latitude')?.value;
    const longitudeInput = document.getElementById('longitude')?.value;

    const latitude = parseFloat(latitudeInput);
    const longitude = parseFloat(longitudeInput);

    if (isNaN(latitude) || isNaN(longitude)) {
        console.error("Invalid Coordinates:", latitudeInput, longitudeInput);
        impactDetails.innerHTML = `<p style="color:red;">${t['error_invalid_coordinates'] || 'Invalid coordinates. Please enter numeric values.'}</p>`;
        return;
    }

    if (!asteroid) {
        impactDetails.innerHTML = `<p>${t['impact_no_selection'] || 'Select an asteroid and coordinates to simulate the impact.'}</p>`;
        return;
    }

    let html = `
        <div class="impact-details">
            <p><strong>${t['label_asteroid'] || 'Asteroid:'}</strong> ${asteroid.name}</p>
            <p><strong>${t['label_diameter'] || 'Diameter:'}</strong> ${asteroid.diameter} m</p>
            <p><strong>${t['label_velocity'] || 'Velocity:'}</strong> ${asteroid.velocity} km/s</p>
            <p><strong>${t['label_risk'] || 'Risk Level:'}</strong> ${asteroid.riesgo || t['risk_unknown'] || 'Unknown'}</p>
    `;

    if (!isNaN(latitude) && !isNaN(longitude)) {
        html += `
            <p><strong>${t['label_impact_location'] || 'Impact Location:'}</strong></p>
            <p>${t['label_latitude'] || 'Latitude:'} ${latitude}°</p>
            <p>${t['label_longitude'] || 'Longitude:'} ${longitude}°</p>
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
