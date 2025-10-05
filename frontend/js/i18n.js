
const translations = {
    en: {
        "nav_earth": "Earth",
        "nav_asteroids": "Asteroids",
        "nav_simulation": "Impact Simulation",
        "nav_mitigation": "Mitigation",
        "toggle_view": "2D/3D View",
        "zoom_in": "+",
        "zoom_out": "-",
        "asteroids_title": "Near-Earth Asteroids",
        "search_button": "Search",
        "create_asteroid_title": "Create Custom Asteroid",
        "asteroid_name": "Name:",
        "asteroid_diameter": "Diameter (meters):",
        "asteroid_velocity": "Velocity (km/s):",
        "asteroid_composition": "Composition:",
        "composition_rocky": "Rocky",
        "composition_metallic": "Metallic",
        "composition_icy": "Icy",
        "create_button": "Create",
        "simulation_title": "Impact Simulation",
        "select_asteroid": "Select Asteroid",
        "select_asteroid_prompt": "Select an asteroid...",
        "impact_location": "Impact Location",
        "impact_location_prompt": "Click on the map to select the impact location",
        "run_simulation": "Run Simulation",
        "mitigation_title": "Mitigation Strategies",
        "user_menu_title": "User Menu",
        "label_diameter": "Estimated diameter:",
        "label_velocity": "Relative velocity:",
        "label_risk": "Risk:",
        "label_simulate": "Simulate Impact", 
        "app_title": "Meteor Madness",
        "lang_en": "EN",
        "lang_es": "ES",
        "search_name_placeholder": "Search by name...",
        "search_diameter_placeholder": "Minimum diameter (m)...",
        "asteroids_list_msg": "Use the filters and click 'Search' to load the asteroids.",
        "asteroid_risk": "Risk level:",
        "risk_low": "Low",
        "risk_medium": "Medium",
        "risk_high": "High",
        "select_coordinates": "Select Coordinates",
        "select_coords_instruction": "Click on the globe or enter the coordinates:",
        "lat_placeholder": "Latitude (e.g., 40.71)",
        "lon_placeholder": "Longitude (e.g., -74.00)",
        "set_coords_button": "Use Coordinates",
        "footer_text": "2025 Meteor Madness - SpaceLights", 
        "impact_no_selection": "Select an asteroid and coordinates to simulate the impact.",
        "label_asteroid": "Asteroid:",
        "label_diameter": "Diameter:",
        "label_velocity": "Velocity:",
        "label_risk": "Risk Level:",
        "label_impact_location": "Impact Location:",
        "label_latitude": "Latitude:",
        "label_longitude": "Longitude:",
        "risk_unknown": "Unknown",
        "error_invalid_coordinates": "Invalid coordinates. Please enter numeric values.",
        "impact_results_title": "Impact Results",
        "impact_energy": "Impact Energy:",
        "impact_damage_radius": "Damage Radius:",
        "impact_crater_diameter": "Crater Diameter:",
        "impact_summary": "Summary:",
        "impact_no_data": "No simulation data available.",
        "impact_marker_info": "Click on the marker to see impact details.", 
        "mitigation_visual_title": "Visual Mitigation Strategies",
        "mitigation_visual_subtitle": "Click on a strategy",
        "mitigation_kinetic_title": "Nuclear Explosion",
        "mitigation_kinetic_desc": "This strategy proposes detonating a nuclear device near an asteroid. The burst of radiation and thermal energy vaporizes part of the asteroid’s surface, creating a thrusting force. This “nuclear ablation” alters the object's trajectory enough to deflect it from a collision course with Earth",
        "mitigation_gravity_title": "Gravity Tractor",
        "mitigation_gravity_desc": "This is a non-contact technique where a massive spacecraft (the gravity tractor) is placed close to the asteroid. The mutual gravitational pull applies a constant, gentle, and highly controlled force on the asteroid. This gradual force, acting over a long period, slowly and safely modifies the object's orbit. It is ideal for long-term threats and for asteroids with unknown or fragile structures.",
        "mitigation_laser_title": "Kinetic Impactor Deflection",
        "mitigation_laser_desc": "This method involves intentionally crashing a spacecraft (the kinetic impactor) into the asteroid at high speed. The goal is to transfer momentum and slightly alter the object's velocity. Given enough lead time (years before impact), this small nudge changes the asteroid's trajectory enough to make it miss Earth. It is the most mature technique and was successfully tested by the DART mission."

    },
    es: {
        "nav_earth": "Tierra",
        "nav_asteroids": "Asteroides",
        "nav_simulation": "Simulación de Impacto",
        "nav_mitigation": "Mitigación",
        "toggle_view": "Vista 2D/3D",
        "zoom_in": "+",
        "zoom_out": "-",
        "asteroids_title": "Asteroides Cercanos a la Tierra",
        "search_button": "Buscar",
        "create_asteroid_title": "Crear Asteroide Personalizado",
        "asteroid_name": "Nombre:",
        "asteroid_diameter": "Diámetro (metros):",
        "asteroid_velocity": "Velocidad (km/s):",
        "asteroid_composition": "Composición:",
        "composition_rocky": "Rocoso",
        "composition_metallic": "Metálico",
        "composition_icy": "Helado",
        "create_button": "Crear",
        "simulation_title": "Simulación de Impacto",
        "select_asteroid": "Seleccionar Asteroide",
        "select_asteroid_prompt": "Selecciona un asteroide...",
        "impact_location": "Ubicación de Impacto",
        "impact_location_prompt": "Haz clic en el mapa para seleccionar la ubicación del impacto",
        "run_simulation": "Ejecutar Simulación",
        "mitigation_title": "Estrategias de Mitigación",
        "user_menu_title": "Menú de Usuario",
        "label_diameter": "Diámetro estimado:",
        "label_velocity": "Velocidad relativa:",
        "label_risk": "Riesgo:",
        "label_simulate": "Simular Impacto",
        "app_title": "Meteor Madness",
        "lang_en": "EN",
        "lang_es": "ES",
        "search_name_placeholder": "Buscar por nombre...",
        "search_diameter_placeholder": "Diámetro mínimo (m)...",
        "asteroids_list_msg": "Usa los filtros y haz clic en 'Buscar' para cargar los asteroides.",
        "asteroid_risk": "Nivel de riesgo:",
        "risk_low": "Bajo",
        "risk_medium": "Medio",
        "risk_high": "Alto",
        "select_coordinates": "Seleccionar Coordenadas",
        "select_coords_instruction": "Haz clic en el globo o introduce las coordenadas:",
        "lat_placeholder": "Latitud (Ej: 40.71)",
        "lon_placeholder": "Longitud (Ej: -74.00)",
        "set_coords_button": "Usar Coordenadas",
        "footer_text": "2025 Meteor Madness - SpaceLights",
        "impact_no_selection": "Seleccione un asteroide y coordenadas para simular el impacto.",
        "label_asteroid": "Asteroide:",
        "label_diameter": "Diámetro:",
        "label_velocity": "Velocidad:",
        "label_risk": "Nivel de riesgo:",
        "label_impact_location": "Ubicación del Impacto:",
        "label_latitude": "Latitud:",
        "label_longitude": "Longitud:",
        "risk_unknown": "Desconocido",
        "error_invalid_coordinates": "Coordenadas inválidas. Introduce valores numéricos.",
        "impact_results_title": "Resultados del Impacto",
        "impact_energy": "Energía del Impacto:",
        "impact_damage_radius": "Radio de Daño:",
        "impact_crater_diameter": "Diámetro del Cráter:",
        "impact_summary": "Resumen:",
        "impact_no_data": "No hay datos de simulación disponibles.",
        "impact_marker_info": "Haz clic en el marcador para ver los detalles del impacto.", 
        "mitigation_visual_title": "Estrategias de Mitigación Visuales",
        "mitigation_visual_subtitle": "Haz clic en una estrategia",
        "mitigation_kinetic_title": "Explosión Nuclear",
        "mitigation_kinetic_desc": "Esta estrategia propone detonar un dispositivo nuclear cerca de un asteroide. El estallido de radiación y energía térmica vaporiza parte de la superficie del asteroide, creando una fuerza de empuje. Esta 'ablación nuclear' altera la trayectoria del objeto lo suficiente como para desviarlo de un curso de colisión con la Tierra.",
        "mitigation_gravity_title": "Tractor Gravitacional",
        "mitigation_gravity_desc": "Esta es una técnica sin contacto donde una nave espacial masiva (el tractor gravitacional) se sitúa cerca del asteroide. La atracción gravitacional mutua aplica una fuerza constante, suave y altamente controlada sobre el asteroide. Esta fuerza gradual, actuando durante un largo período, modifica lenta y seguramente la órbita del objeto. Es ideal para amenazas a largo plazo y para asteroides con estructuras desconocidas o frágiles.",
        "mitigation_laser_title": "Desvío por Impactador Cinético",
        "mitigation_laser_desc": "Este método implica estrellar intencionadamente una nave espacial (el impactador cinético) contra el asteroide a alta velocidad. El objetivo es transferir momento y alterar ligeramente la velocidad del objeto. Con suficiente tiempo de antelación (años antes del impacto), este pequeño empujón cambia la trayectoria del asteroide lo suficiente como para que evite la Tierra. Es la técnica más madura y fue probada con éxito por la misión DART."

    }
};

function changeLanguage(lang) {
    if (!translations[lang]) {
        console.warn('Idioma no disponible:', lang);
        return;
    }

    window.currentLanguage = lang;
    localStorage.setItem('language', lang);

    // 1) Elementos con data-i18n: si es input -> placeholder, si no -> textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = translations[lang][key];
        if (text === undefined) return; // no hay traducción para esa key

        const tag = el.tagName.toLowerCase();
        if ((tag === 'input' || tag === 'textarea') && (el.hasAttribute('placeholder') || el.type === 'text' || el.type === 'search' || el.type === 'date' || el.type === 'number')) {
            el.placeholder = text;
        } else {
            el.textContent = text;
        }
    });

    // 2) Actualizaciones específicas (seguras: comprueba existencia antes de setear)
    updateSpecificTexts(lang);

    console.log('Idioma cambiado a', lang);
}

function updateSpecificTexts(lang) {
    // Navegación
    const aEarth = document.querySelector('a[data-view="earth"]');
    if (aEarth && translations[lang]['nav_earth']) aEarth.textContent = translations[lang]['nav_earth'];

    const aAst = document.querySelector('a[data-view="asteroids"]');
    if (aAst && translations[lang]['nav_asteroids']) aAst.textContent = translations[lang]['nav_asteroids'];

    const aSim = document.querySelector('a[data-view="simulation"]');
    if (aSim && translations[lang]['nav_simulation']) aSim.textContent = translations[lang]['nav_simulation'];

    const aMit = document.querySelector('a[data-view="mitigation"]');
    if (aMit && translations[lang]['nav_mitigation']) aMit.textContent = translations[lang]['nav_mitigation'];

    // Botones y controles
    const toggle = document.getElementById('toggle-view');
    if (toggle && translations[lang]['toggle_view']) toggle.textContent = translations[lang]['toggle_view'];

    const zIn = document.getElementById('zoom-in');
    if (zIn && translations[lang]['zoom_in']) zIn.textContent = translations[lang]['zoom_in'];

    const zOut = document.getElementById('zoom-out');
    if (zOut && translations[lang]['zoom_out']) zOut.textContent = translations[lang]['zoom_out'];

    // Formularios y placeholders
    if (document.getElementById('create-asteroid-form')) {
        const astTitle = document.querySelector('#asteroids-view h2');
        if (astTitle && translations[lang]['asteroids_title']) astTitle.textContent = translations[lang]['asteroids_title'];

        const createH3 = document.querySelector('.create-asteroid h3');
        if (createH3 && translations[lang]['create_asteroid_title']) createH3.textContent = translations[lang]['create_asteroid_title'];

        const labName = document.querySelector('label[for="asteroid-name"]');
        if (labName && translations[lang]['asteroid_name']) labName.textContent = translations[lang]['asteroid_name'];

        const labDiam = document.querySelector('label[for="asteroid-diameter"]');
        if (labDiam && translations[lang]['asteroid_diameter']) labDiam.textContent = translations[lang]['asteroid_diameter'];

        const labVel = document.querySelector('label[for="asteroid-velocity"]');
        if (labVel && translations[lang]['asteroid_velocity']) labVel.textContent = translations[lang]['asteroid_velocity'];

        const compLabel = document.querySelector('label[for="asteroid-composition"]');
        if (compLabel && translations[lang]['asteroid_composition']) compLabel.textContent = translations[lang]['asteroid_composition'];

        // opciones del select de composición (por value)
        const compositionSelect = document.getElementById('asteroid-composition');
        if (compositionSelect) {
            for (let i = 0; i < compositionSelect.options.length; i++) {
                const option = compositionSelect.options[i];
                const value = option.value;
                const key = `composition_${value}`;
                if (translations[lang][key]) option.textContent = translations[lang][key];
            }
        }

        const createBtn = document.querySelector('#create-asteroid-form button[type="submit"]');
        if (createBtn && translations[lang]['create_button']) createBtn.textContent = translations[lang]['create_button'];
    }

    // Simulación
    const simH2 = document.querySelector('#simulation-view h2');
    if (simH2 && translations[lang]['simulation_title']) simH2.textContent = translations[lang]['simulation_title'];

    const selH3 = document.querySelector('.asteroid-selection h3');
    if (selH3 && translations[lang]['select_asteroid']) selH3.textContent = translations[lang]['select_asteroid'];

    const runBtn = document.getElementById('run-simulation');
    if (runBtn && translations[lang]['run_simulation']) runBtn.textContent = translations[lang]['run_simulation'];

    // Traduce placeholders de búsqueda
    const searchName = document.getElementById('search-name');
    if (searchName && translations[lang]['select_asteroid_prompt']) searchName.placeholder = translations[lang]['select_asteroid_prompt'];

    // Traducir texto default del option de lista (si existe)
    const defaultOption = document.getElementById('lista');
    if (defaultOption && translations[lang]['select_asteroid_prompt']) defaultOption.textContent = translations[lang]['select_asteroid_prompt'];
}

// Exportar para uso desde otros scripts
window.changeLanguage = changeLanguage;
window.translations = translations;
