// Sistema de internacionalización para Meteor Madness
const translations = {
    en: {
        // Navegación
        "nav_earth": "Earth",
        "nav_asteroids": "Asteroids",
        "nav_simulation": "Impact Simulation",
        "nav_mitigation": "Mitigation",
        
        // Controles de visualización
        "toggle_view": "2D/3D View",
        "zoom_in": "+",
        "zoom_out": "-",
        
        // Vista de asteroides
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
        
        // Vista de simulación
        "simulation_title": "Impact Simulation",
        "select_asteroid": "Select Asteroid",
        "select_asteroid_prompt": "Select an asteroid...",
        "impact_location": "Impact Location",
        "impact_location_prompt": "Click on the map to select the impact location",
        "run_simulation": "Run Simulation",
        
        // Resultados de simulación
        "impact_energy": "Impact Energy",
        "crater_size": "Crater Size",
        "blast_radius": "Blast Radius",
        "casualties": "Estimated Casualties",
        "infrastructure_damage": "Infrastructure Damage",
        
        // Vista de mitigación
        "mitigation_title": "Mitigation Strategies",
        "kinetic_title": "Kinetic Impactor",
        "kinetic_desc": "Impact the asteroid with a spacecraft to change its trajectory.",
        "gravity_title": "Gravity Tractor",
        "gravity_desc": "Use a spacecraft's gravity to slowly alter the asteroid's orbit.",
        "nuclear_title": "Nuclear Explosion",
        "nuclear_desc": "Detonate a nuclear device near the asteroid to change its course.",
        "apply_button": "Apply",
        
        // Menú de usuario
        "user_menu_title": "User Menu",
        "menu_impact-2025": "Simulate Impact (Impact-2025)",
        "menu_create-asteroid": "Create an asteroid and simulate its impact",
        "menu_mitigation": "Mitigation Strategy",
        "menu_other-asteroids": "Test other asteroids"
    },
    es: {
        // Navegación
        "nav_earth": "Tierra",
        "nav_asteroids": "Asteroides",
        "nav_simulation": "Simulación de Impacto",
        "nav_mitigation": "Mitigación",
        
        // Controles de visualización
        "toggle_view": "Vista 2D/3D",
        "zoom_in": "+",
        "zoom_out": "-",
        
        // Vista de asteroides
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
        
        // Vista de simulación
        "simulation_title": "Simulación de Impacto",
        "select_asteroid": "Seleccionar Asteroide",
        "select_asteroid_prompt": "Selecciona un asteroide...",
        "impact_location": "Ubicación de Impacto",
        "impact_location_prompt": "Haz clic en el mapa para seleccionar la ubicación del impacto",
        "run_simulation": "Ejecutar Simulación",
        
        // Resultados de simulación
        "impact_energy": "Energía de Impacto",
        "crater_size": "Tamaño del Cráter",
        "blast_radius": "Radio de Explosión",
        "casualties": "Víctimas Estimadas",
        "infrastructure_damage": "Daño a Infraestructura",
        
        // Vista de mitigación
        "mitigation_title": "Estrategias de Mitigación",
        "kinetic_title": "Desviación Cinética",
        "kinetic_desc": "Impactar el asteroide con una nave espacial para cambiar su trayectoria.",
        "gravity_title": "Tractor Gravitacional",
        "gravity_desc": "Usar la gravedad de una nave espacial para alterar lentamente la órbita del asteroide.",
        "nuclear_title": "Explosión Nuclear",
        "nuclear_desc": "Detonar un dispositivo nuclear cerca del asteroide para cambiar su curso.",
        "apply_button": "Aplicar",
        
        // Menú de usuario
        "user_menu_title": "Menú de Usuario",
        "menu_impact-2025": "Simular el impacto (Impacto-2025)",
        "menu_create-asteroid": "Crear un asteroide y simular su impacto",
        "menu_mitigation": "Estrategia de mitigación",
        "menu_other-asteroids": "Probar otros asteroides"
    }
};

// Función para cambiar el idioma de la aplicación
function changeLanguage(lang) {
    // Guardar la preferencia de idioma
    localStorage.setItem('language', lang);
    
    // Obtener todos los elementos con atributos de traducción
    const elements = document.querySelectorAll('[data-i18n]');
    
    // Actualizar el texto de cada elemento
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Actualizar textos específicos
    updateSpecificTexts(lang);
}

// Actualizar textos específicos que no tienen atributo data-i18n
function updateSpecificTexts(lang) {
    // Navegación
    document.querySelector('a[data-view="earth"]').textContent = translations[lang]['nav_earth'];
    document.querySelector('a[data-view="asteroids"]').textContent = translations[lang]['nav_asteroids'];
    document.querySelector('a[data-view="simulation"]').textContent = translations[lang]['nav_simulation'];
    document.querySelector('a[data-view="mitigation"]').textContent = translations[lang]['nav_mitigation'];
    
    // Botones y títulos
    document.getElementById('toggle-view').textContent = translations[lang]['toggle_view'];
    document.getElementById('zoom-in').textContent = translations[lang]['zoom_in'];
    document.getElementById('zoom-out').textContent = translations[lang]['zoom_out'];
    
    // Menú de usuario
    document.querySelector('#user-menu h2').textContent = translations[lang]['user_menu_title'];
    document.querySelectorAll('.menu-option').forEach(option => {
        const action = option.getAttribute('data-action');
        if (translations[lang][`menu_${action}`]) {
            option.textContent = translations[lang][`menu_${action}`];
        }
    });
    
    // Actualizar placeholder y etiquetas de formularios
    updateFormLabels(lang);
}

// Actualizar etiquetas de formularios
function updateFormLabels(lang) {
    // Formulario de creación de asteroides
    if (document.getElementById('create-asteroid-form')) {
        document.querySelector('#asteroids-view h2').textContent = translations[lang]['asteroids_title'];
        document.querySelector('.create-asteroid h3').textContent = translations[lang]['create_asteroid_title'];
        document.querySelector('label[for="asteroid-name"]').textContent = translations[lang]['asteroid_name'];
        document.querySelector('label[for="asteroid-diameter"]').textContent = translations[lang]['asteroid_diameter'];
        document.querySelector('label[for="asteroid-velocity"]').textContent = translations[lang]['asteroid_velocity'];
        document.querySelector('label[for="asteroid-composition"]').textContent = translations[lang]['asteroid_composition'];
        
        // Opciones del select
        const compositionSelect = document.getElementById('asteroid-composition');
        for (let i = 0; i < compositionSelect.options.length; i++) {
            const option = compositionSelect.options[i];
            const value = option.value;
            if (translations[lang][`composition_${value}`]) {
                option.textContent = translations[lang][`composition_${value}`];
            }
        }
        
        // Botón de crear
        document.querySelector('#create-asteroid-form button').textContent = translations[lang]['create_button'];
    }
    
    // Simulación
    if (document.getElementById('simulation-view')) {
        document.querySelector('#simulation-view h2').textContent = translations[lang]['simulation_title'];
        document.querySelector('.asteroid-selection h3').textContent = translations[lang]['select_asteroid'];
        document.getElementById('run-simulation').textContent = translations[lang]['run_simulation'];
    }
    
    // Mitigación
    if (document.getElementById('mitigation-view')) {
        document.querySelector('#mitigation-view h2').textContent = translations[lang]['mitigation_title'];
    }
}

// Inicializar el idioma al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el idioma guardado o usar el predeterminado
    const savedLang = localStorage.getItem('language') || 'es';
    
    // Aplicar el idioma
    changeLanguage(savedLang);
    
    // Activar el botón correspondiente
    if (savedLang === 'es') {
        document.getElementById('lang-es').classList.add('active');
        document.getElementById('lang-en').classList.remove('active');
    } else {
        document.getElementById('lang-en').classList.add('active');
        document.getElementById('lang-es').classList.remove('active');
    }
});

// Exportar la función para uso en otros archivos
window.changeLanguage = changeLanguage;