import math

def get_density_by_composition(composition):
    densities = {
        'rocky': 3000,
        'metallic': 8000,
        'icy': 1000
    }
    return densities.get(composition, 3000)

def simulate_impact(data):
    asteroid = data.get('asteroid', {})
    location = data.get('location', {})
    
    if not all([asteroid, location, 'diameter' in asteroid, 'velocity' in asteroid]):
        raise ValueError("Datos insuficientes para la simulación de impacto.")

    try:
        diameter = float(asteroid['diameter'])
        velocity = float(asteroid['velocity']) * 1000
    except (ValueError, TypeError):
        raise ValueError("El diámetro y la velocidad del asteroide deben ser valores numéricos.")

    composition = asteroid.get('composition', 'rocky')
    density = get_density_by_composition(composition)
    
    mass = (4/3) * math.pi * ((diameter / 2) ** 3) * density
    energy_joules = 0.5 * mass * (velocity ** 2)
    energy_megatons_tnt = energy_joules / 4.184e15

    crater_diameter_km = 1.3 * (energy_megatons_tnt ** (1/3.4))
    blast_radius_km = 5 * (energy_megatons_tnt ** (1/3))

    lat = location.get('lat', 0)
    lon = location.get('lon', 0)
    
    is_ocean = (abs(lat) < 70 and (lon < -30 or lon > 180 or (lon > -180 and lon < -70))) or abs(lat) > 60
    
    tsunami_height_m = 0
    if is_ocean:
        tsunami_height_m = 10 * (energy_megatons_tnt ** 0.25)
        
    return {
        'energyMT': energy_megatons_tnt,
        'craterDiameter': crater_diameter_km,
        'blastRadius': blast_radius_km,
        'isOcean': is_ocean,
        'tsunamiHeight': tsunami_height_m
    }