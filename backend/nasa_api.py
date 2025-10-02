# backend/nasa_api.py

import os
import requests
from dotenv import load_dotenv

# Cargar la clave de API desde el archivo .env
load_dotenv()
NASA_API_KEY = os.getenv('NASA_API_KEY')
NASA_API_BASE_URL = 'https://api.nasa.gov/neo/rest/v1'

def get_asteroids_by_date(date):
    """
    Obtiene los asteroides cercanos a la Tierra para una fecha específica desde la API de la NASA.
    """
    if not NASA_API_KEY:
        raise Exception("No se encontró la clave de API de la NASA en las variables de entorno.")

    url = f"{NASA_API_BASE_URL}/feed?start_date={date}&end_date={date}&api_key={NASA_API_KEY}"
    
    response = requests.get(url)
    
    # Lanza una excepción si la respuesta no fue exitosa (código 200)
    response.raise_for_status() 
    
    data = response.json()
    
    # Devuelve la lista de asteroides para la fecha solicitada
    return data.get('near_earth_objects', {}).get(date, [])