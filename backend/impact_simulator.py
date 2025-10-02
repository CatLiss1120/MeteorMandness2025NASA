# backend/impact_simulator.py

import math

def get_density_by_composition(composition):
    """Devuelve la densidad en kg/m³ según la composición del asteroide."""
    densities = {
        'rocky': 3000,
        'metallic': 8000,
        'icy': 1000
    }
    return densities.get(composition, 3000) # Por defecto, rocoso

def simulate_impact(data):
    """
    Simula los efectos del impacto de un asteroide.
    """
    asteroid = data.get('asteroid', {})
    location = data.get('location', {})
    
    if not all([asteroid, location, 'diameter' in asteroid, 'velocity' in asteroid]):
        raise ValueError("Datos insuficientes para la simulación de impacto.")

    # Parámetros del asteroide
    diameter = asteroid['diameter'] # en metros
    velocity = asteroid['velocity'] * 1000 # en m/s
    composition = asteroid.get('composition', 'rocky')
    density = get_density_by_composition(composition)
    
    # Calcular energía cinética
    mass = (4/3) * math.pi * ((diameter / 2) ** 3) * density
    energy_joules = 0.5 * mass * (velocity ** 2)
    energy_megatons_tnt = energy_joules / 4.184e15 # Conversión a megatones de TNT

    # Fórmulas más precisas basadas en simuladores científicos\n    crater_diameter_km = 1.3 * (energy_megatons_tnt ** (1/3.4))  # Ajustado para coincidir con ejemplos reales\n    blast_radius_km = 5 * (energy_megatons_tnt ** (1/3))  # Ajustado para radio de daños severos\n\n    # Mejor determinación si es en el océano (simplificada por latitud/longitud)\n    lat = location.get('lat', 0)\n    lon = location.get('lon', 0)\n    # Asumir océano si fuera de rangos típicos de continentes principales (simplificado)\n    is_ocean = (abs(lat) < 70 and (lon < -30 or lon > 180 or (lon > -180 and lon < -70))) or abs(lat) > 60\n    \n    tsunami_height_m = 0\n    if is_ocean:\n        # Fórmula ajustada para altura de tsunami\n        tsunami_height_m = 10 * (energy_megatons_tnt ** 0.25)  # Ajustado para realismo\n        \n    return {\n        'energyMT': energy_megatons_tnt,\n        'craterDiameter': crater_diameter_km,\n        'blastRadius': blast_radius_km,\n        'isOcean': is_ocean,\n        'tsunamiHeight': tsunami_height_m
    