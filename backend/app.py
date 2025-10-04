from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv
from nasa_api import get_asteroids_by_date
from orbit_calculator import calculate_orbit_parameters
from impact_simulator import simulate_impact

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

# Ruta para servir archivos estáticos del frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join('../frontend', path)):
        return send_from_directory('../frontend', path)
    else:
        return send_from_directory('../frontend', 'index.html')

# API para obtener asteroides por fecha
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
        # Filtrar por nombre si se proporciona
        if name:
            asteroids = [a for a in asteroids if name in a.get('name', '').lower()]
        # Filtrar por diámetro si se proporciona
        if diameter:
            try:
                diameter_val = float(diameter)
                asteroids = [a for a in asteroids if 'estimated_diameter' in a and 'meters' in a['estimated_diameter'] and a['estimated_diameter']['meters']['estimated_diameter_max'] >= diameter_val]
            except ValueError:
                pass
        # Filtrar por tipo si se proporciona
        if type_:
            def get_type(a):
                # Si el asteroide tiene composición, usarla; si no, asignar por heurística
                comp = a.get('composition', None)
                if comp:
                    return comp.lower()
                # Heurística: si el nombre contiene "metal", "ice", etc.
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

# API para calcular parámetros orbitales
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

# API para simular impacto
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

# API para guardar un asteroide personalizado
@app.route('/api/asteroids/custom', methods=['POST'])
def save_custom_asteroid():
    data = request.json
    if not data:
        return jsonify({'error': 'Se requieren datos del asteroide'}), 400
    
    # En una implementación real, aquí se guardarían los datos en una base de datos
    # Por ahora, simplemente devolvemos los datos recibidos
    # Agregar campo de nivel de riesgo si no existe
    if 'riesgo' not in data:
        data['riesgo'] = 'desconocido'  # Puede ser: bajo, medio, alto, desconocido
    return jsonify({
        'success': True,
        'asteroid': data,
        'count': 1
    })

if __name__ == '__main__':
    # Obtener puerto del entorno o usar 5000 por defecto
    port = int(os.environ.get('PORT', 5000))
    # Ejecutar la aplicación
    app.run(host='0.0.0.0', port=port, debug=True)