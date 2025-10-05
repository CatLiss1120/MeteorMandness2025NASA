// js/api.js

// Función que consulta los asteroides disponibles desde el backend.
// Usa la fecha y los filtros ingresados por el usuario.
async function searchAsteroidsFromApi() {
    const date = document.getElementById('search-date').value;
    const name = document.getElementById('search-name').value.trim();
    const diameter = document.getElementById('search-diameter').value.trim();

    // URL base del backend (ajustar si se despliega en producción)
    let url = `http://localhost:5000/api/asteroids?date=${date}`;
    if (name) url += `&name=${encodeURIComponent(name)}`;
    if (diameter) url += `&diameter=${encodeURIComponent(diameter)}`;

    // Realiza la solicitud al backend
    const response = await fetch(url);

    // Manejo de errores si el servidor responde con un estado distinto a 200
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Respuesta no válida del servidor' }));
        throw new Error(errorData.error || `Error del servidor: ${response.status}`);
    }

    // Convierte la respuesta a JSON y devuelve la lista de asteroides
    const result = await response.json();
    return result.asteroids;
}
