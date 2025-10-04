// js/api.js

/**
 * Busca asteroides en el backend y devuelve los datos.
 * Esta función es independiente y no manipula el DOM.
 * @returns {Promise<Array>} Una promesa que se resuelve con la lista de asteroides.
 * @throws {Error} Lanza un error si la petición falla.
 */
async function searchAsteroidsFromApi() {
    const date = document.getElementById('search-date').value;
    const name = document.getElementById('search-name').value.trim();
    const diameter = document.getElementById('search-diameter').value.trim();

    let url = `http://localhost:5000/api/asteroids?date=${date}`;
    if (name) url += `&name=${encodeURIComponent(name)}`;
    if (diameter) url += `&diameter=${encodeURIComponent(diameter)}`;

    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Respuesta no válida del servidor' }));
        throw new Error(errorData.error || `Error del servidor: ${response.status}`);
    }

    const result = await response.json();
    return result.asteroids;
}