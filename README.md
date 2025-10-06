# Meteor Madness

Interactive web application that simulates asteroid impacts on Earth, featuring 3D visualization, user-generated asteroids, impact simulations, and mitigation options.

## Main Features

- 3D visualization of Earth and celestial bodies  
- Integration with NASA Near-Earth Object (NEO) Web Service API  
- Custom asteroid generation  
- Impact simulation and consequence analysis  
- Impact mitigation options  
- Detailed consequence reports  

## Technologies

- **Frontend:** HTML, CSS, JavaScript (Three.js for 3D visualization)  
- **Backend:** Python (Flask)  
- **Version control:** Git  
- **Cinematics:** Blender  

## Project Structure

MeteorMadness/
├── frontend/
│ ├── index.html
│ │── VideoEspecial.js
│ ├── css/
│ │ └── styles.css
│ ├── js/
│ ├── main.js
│ ├── visualization.js
│ ├── orbit.js
│ ├── impact.js
│ └── api.js
│ └── simulation.js
│ └── i18n.js
├── backend/
│ ├── app.py
│ ├── .env
│ ├── nasa_api.py
│ ├── orbit_calculator.py
│ ├── videos
│ └── impact_simulator.py

## Installation

1. Clone the repository  
2. Install frontend dependencies  
3. Install backend dependencies:  
   ```bash
   pip install -r requirements.txt
4. Configure your NASA API keys or use our NASA API key, is in the .env file
5. Run the backend server:
    - python backend/app.py
6. Alternatively, you can run the backend with:
    - cd backend
    - python app.py 
7. Then run the frontend with:
    - cd frontend
    - python -m http.server 8000
8. Finally, open the app using Live Server or go to http://localhost:5000


## Collaboration
This project is designed for collaboration among a team of five people.
Please follow Git conventions when contributing to the project.
