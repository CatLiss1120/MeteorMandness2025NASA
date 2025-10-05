from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv
from nasa_api import get_asteroids_by_date
from orbit_calculator import calculate_orbit_parameters
from impact_simulator import simulate_impact

# Carga las variables de entorno desde el archivo .env
load_dotenv()

app = Flask(__name__)
CORS(app)  # Permite solicitudes desde cualquier origen (necesario para el frontend)

# Sirve los archivos estáticos del frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join('../frontend', path)):
        return send_from_directory('../frontend', path)
    else:
        return send_from_directory('../frontend', 'index.html')

# Endpoint para obtener asteroides según la fecha indicada
@app.route('/api/asteroids', methods=['GET'])
def get_asteroids():
    date = request.args.get('date')
    name = request.args.get('name', '').lower()
    diameter = request.args.get('diameter', '').strip()
    type_ = request.args.get('type', '').strip().lower()

    if not date:
        return jsonify({'error': 'Se requiere una fecha'}), 400

    try:
        asteroids = get_asteroids_by_date(date)

        # Filtra por nombre si se proporciona
        if name:
            asteroids = [a for a in asteroids if name in a.get('name', '').lower()]

        # Filtra por diámetro si se proporciona
        if diameter:
            try:
                diameter_val = float(diameter)
                asteroids = [
                    a for a in asteroids
                    if 'estimated_diameter' in a
                    and 'meters' in a['estimated_diameter']
                    and a['estimated_diameter']['meters']['estimated_diameter_max'] >= diameter_val
                ]
            except ValueError:
                pass

        # Filtra por tipo si se proporciona
        if type_:
            def get_type(a):
                comp = a.get('composition')
                if comp:
                    return comp.lower()
                n = a.get('name', '').lower()
                if 'metal' in n:
                    return 'metallic'
                if 'ice' in n or 'icy' in n:
                    return 'icy'
                return 'rocky'

            asteroids = [a for a in asteroids if get_type(a) == type_]

        return jsonify({
            'count': len(asteroids),
            'asteroids': asteroids
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint para calcular parámetros orbitales de un asteroide
@app.route('/api/orbit', methods=['POST'])
def calculate_orbit():
    data = request.json
    if not data:
        return jsonify({'error': 'Se requieren datos del asteroide'}), 400
    
    try:
        orbit_params = calculate_orbit_parameters(data)
        return jsonify(orbit_params)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint para simular el impacto de un asteroide
@app.route('/api/impact', methods=['POST'])
def calculate_impact():
    data = request.json
    if not data:
        return jsonify({'error': 'Se requieren datos del asteroide y ubicación'}), 400
    
    try:
        impact_results = simulate_impact(data)
        return jsonify(impact_results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint para registrar un asteroide personalizado
@app.route('/api/asteroids/custom', methods=['POST'])
def save_custom_asteroid():
    data = request.json
    if not data:
        return jsonify({'error': 'Se requieren datos del asteroide'}), 400
    
    # En esta versión no se guarda en base de datos, solo se devuelve la información recibida
    if 'riesgo' not in data:
        data['riesgo'] = 'desconocido'  # Puede ser: bajo, medio, alto o desconocido

    return jsonify({
        'success': True,
        'asteroid': data,
        'count': 1
    })

if __name__ == '__main__':
    # Obtiene el puerto desde las variables de entorno o usa 5000 por defecto
    port = int(os.environ.get('PORT', 5000))
    # Inicia el servidor Flask
    app.run(host='0.0.0.0', port=port, debug=True)
