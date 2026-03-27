from flask import Flask, render_template, jsonify, request
import random
from datetime import datetime

app = Flask(__name__)

# All Chennai zones with coordinates
CHENNAI_ZONES = [
    # North Chennai
    {"name": "Tondiarpet", "lat": 13.1667, "lng": 80.3167, "area": "North"},
    {"name": "Royapuram", "lat": 13.1500, "lng": 80.3333, "area": "North"},
    {"name": "Kolathur", "lat": 13.1333, "lng": 80.2500, "area": "North"},
    {"name": "Perambur", "lat": 13.1167, "lng": 80.2833, "area": "North"},
    
    # Central Chennai
    {"name": "Velachery", "lat": 12.9750, "lng": 80.2207, "area": "Central"},
    {"name": "T Nagar", "lat": 13.0418, "lng": 80.2341, "area": "Central"},
    {"name": "Adyar", "lat": 13.0067, "lng": 80.2570, "area": "Central"},
    {"name": "Anna Nagar", "lat": 13.0850, "lng": 80.2101, "area": "Central"},
    {"name": "Mylapore", "lat": 13.0339, "lng": 80.2707, "area": "Central"},
    {"name": "Teynampet", "lat": 13.0333, "lng": 80.2500, "area": "Central"},
    
    # South Chennai
    {"name": "Tambaram", "lat": 12.9229, "lng": 80.1275, "area": "South"},
    {"name": "Pallavaram", "lat": 12.9667, "lng": 80.1500, "area": "South"},
    {"name": "Chromepet", "lat": 12.9833, "lng": 80.1667, "area": "South"},
    {"name": "Madipakkam", "lat": 12.9500, "lng": 80.1833, "area": "South"},
    
    # East Chennai
    {"name": "Besant Nagar", "lat": 13.0167, "lng": 80.2667, "area": "East"},
    {"name": "Thiruvanmiyur", "lat": 12.9833, "lng": 80.2667, "area": "East"},
    {"name": "Kottivakkam", "lat": 12.9667, "lng": 80.2833, "area": "East"},
    
    # West Chennai
    {"name": "Guindy", "lat": 13.0000, "lng": 80.1667, "area": "West"},
    {"name": "Saidapet", "lat": 13.0167, "lng": 80.1833, "area": "West"},
    {"name": "Nungambakkam", "lat": 13.0500, "lng": 80.2167, "area": "West"},
]

# Emergency Services Database
EMERGENCY_SERVICES = {
    "police": [
        {"name": "North Chennai Police", "lat": 13.1667, "lng": 80.3167, "phone": "100", "area": "North"},
        {"name": "Central Chennai Police", "lat": 13.0418, "lng": 80.2341, "phone": "100", "area": "Central"},
        {"name": "South Chennai Police", "lat": 12.9229, "lng": 80.1275, "phone": "100", "area": "South"},
        {"name": "East Chennai Police", "lat": 13.0167, "lng": 80.2667, "phone": "100", "area": "East"},
        {"name": "West Chennai Police", "lat": 13.0000, "lng": 80.1667, "phone": "100", "area": "West"},
    ],
    "ambulance": [
        {"name": "108 Ambulance - North", "lat": 13.1667, "lng": 80.3167, "phone": "108", "area": "North"},
        {"name": "108 Ambulance - Central", "lat": 13.0418, "lng": 80.2341, "phone": "108", "area": "Central"},
        {"name": "108 Ambulance - South", "lat": 12.9229, "lng": 80.1275, "phone": "108", "area": "South"},
        {"name": "108 Ambulance - East", "lat": 13.0167, "lng": 80.2667, "phone": "108", "area": "East"},
        {"name": "108 Ambulance - West", "lat": 13.0000, "lng": 80.1667, "phone": "108", "area": "West"},
    ],
    "hospitals": [
        {"name": "Stanley Medical College", "lat": 13.1500, "lng": 80.3000, "phone": "044-2535-0000", "area": "North", "beds": 1200},
        {"name": "Rajiv Gandhi Government Hospital", "lat": 13.0500, "lng": 80.2500, "phone": "044-2536-0000", "area": "Central", "beds": 1500},
        {"name": "Government General Hospital", "lat": 13.0667, "lng": 80.2667, "phone": "044-2532-0000", "area": "Central", "beds": 2000},
        {"name": "Kilpauk Medical College", "lat": 13.0833, "lng": 80.2333, "phone": "044-2531-0000", "area": "Central", "beds": 1000},
        {"name": "Madras Medical College", "lat": 13.0667, "lng": 80.2833, "phone": "044-2530-0000", "area": "East", "beds": 1800},
        {"name": "Sri Ramachandra Medical College", "lat": 12.9833, "lng": 80.2333, "phone": "044-2476-0000", "area": "South", "beds": 1200},
        {"name": "Apollo Hospitals", "lat": 13.0667, "lng": 80.1667, "phone": "044-2829-0000", "area": "West", "beds": 800},
        {"name": "Fortis Malar Hospital", "lat": 13.0500, "lng": 80.2500, "phone": "044-4000-0000", "area": "Central", "beds": 600},
    ],
    "rescue_teams": [
        {"name": "NDRF - North Chennai", "lat": 13.1667, "lng": 80.3167, "phone": "011-2671-0000", "area": "North", "members": 50},
        {"name": "NDRF - Central Chennai", "lat": 13.0418, "lng": 80.2341, "phone": "011-2671-0000", "area": "Central", "members": 60},
        {"name": "NDRF - South Chennai", "lat": 12.9229, "lng": 80.1275, "phone": "011-2671-0000", "area": "South", "members": 45},
        {"name": "Fire & Rescue - East", "lat": 13.0167, "lng": 80.2667, "phone": "101", "area": "East", "members": 40},
        {"name": "Fire & Rescue - West", "lat": 13.0000, "lng": 80.1667, "phone": "101", "area": "West", "members": 35},
    ]
}

def predict_risk(rainfall, water_level, elevation):
    score = (rainfall * 0.4) + (water_level * 0.4) + ((100 - elevation) * 0.2)
    if score < 30: return "Low"
    if score < 55: return "Moderate"
    if score < 75: return "High"
    return "Critical"

def get_nearest_services(lat, lng, service_type, count=3):
    """Get nearest emergency services based on location"""
    services = EMERGENCY_SERVICES.get(service_type, [])
    
    # Calculate distance
    def distance(s):
        return ((s['lat'] - lat) ** 2 + (s['lng'] - lng) ** 2) ** 0.5
    
    sorted_services = sorted(services, key=distance)
    return sorted_services[:count]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/zones')
def get_zones():
    """Get all Chennai zones with risk data"""
    zones_data = []
    for zone in CHENNAI_ZONES:
        rainfall = random.randint(10, 150)
        water_level = random.randint(20, 90)
        elevation = random.randint(5, 50)
        risk_level = predict_risk(rainfall, water_level, elevation)
        risk_score = (rainfall * 0.4) + (water_level * 0.4) + ((100 - elevation) * 0.2)
        
        zones_data.append({
            "name": zone["name"],
            "lat": zone["lat"],
            "lng": zone["lng"],
            "area": zone["area"],
            "rainfall": rainfall,
            "water_level": water_level,
            "elevation": elevation,
            "risk_level": risk_level,
            "risk_score": round(risk_score, 2)
        })
    return jsonify(zones_data)

@app.route('/api/emergency-contacts/<zone_name>')
def get_emergency_contacts(zone_name):
    """Get emergency contacts for a specific zone"""
    zone = next((z for z in CHENNAI_ZONES if z["name"] == zone_name), None)
    
    if not zone:
        return jsonify({"error": "Zone not found"}), 404
    
    lat, lng = zone["lat"], zone["lng"]
    
    return jsonify({
        "zone": zone_name,
        "area": zone["area"],
        "timestamp": datetime.now().isoformat(),
        "emergency_services": {
            "police": get_nearest_services(lat, lng, "police", 2),
            "ambulance": get_nearest_services(lat, lng, "ambulance", 2),
            "hospitals": get_nearest_services(lat, lng, "hospitals", 3),
            "rescue_teams": get_nearest_services(lat, lng, "rescue_teams", 2)
        }
    })

@app.route('/api/all-emergency-services')
def get_all_emergency_services():
    """Get all emergency services across Chennai"""
    return jsonify({
        "total_zones": len(CHENNAI_ZONES),
        "services": EMERGENCY_SERVICES,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/disaster-alert', methods=['POST'])
def create_disaster_alert():
    """Create disaster alert and get emergency contacts"""
    data = request.json
    zone_name = data.get('zone')
    disaster_type = data.get('type', 'flood')
    severity = data.get('severity', 'high')
    
    zone = next((z for z in CHENNAI_ZONES if z["name"] == zone_name), None)
    
    if not zone:
        return jsonify({"error": "Zone not found"}), 404
    
    lat, lng = zone["lat"], zone["lng"]
    
    alert = {
        "alert_id": f"ALERT-{datetime.now().timestamp()}",
        "zone": zone_name,
        "area": zone["area"],
        "disaster_type": disaster_type,
        "severity": severity,
        "timestamp": datetime.now().isoformat(),
        "location": {"lat": lat, "lng": lng},
        "emergency_contacts": {
            "police": get_nearest_services(lat, lng, "police", 1),
            "ambulance": get_nearest_services(lat, lng, "ambulance", 1),
            "hospitals": get_nearest_services(lat, lng, "hospitals", 2),
            "rescue_teams": get_nearest_services(lat, lng, "rescue_teams", 1)
        },
        "action_items": [
            "📞 Call Police: 100",
            "🚑 Call Ambulance: 108",
            "🚒 Call Fire & Rescue: 101",
            "🏥 Nearest Hospital: " + get_nearest_services(lat, lng, "hospitals", 1)[0]["name"],
            "👥 Rescue Team: " + get_nearest_services(lat, lng, "rescue_teams", 1)[0]["name"]
        ]
    }
    
    return jsonify(alert)

@app.route('/api/area-coverage/<area>')
def get_area_coverage(area):
    """Get all zones and services in a specific area"""
    zones = [z for z in CHENNAI_ZONES if z["area"] == area]
    
    if not zones:
        return jsonify({"error": "Area not found"}), 404
    
    area_data = {
        "area": area,
        "zones": zones,
        "total_zones": len(zones),
        "services": {
            "police": [s for s in EMERGENCY_SERVICES["police"] if s["area"] == area],
            "ambulance": [s for s in EMERGENCY_SERVICES["ambulance"] if s["area"] == area],
            "hospitals": [s for s in EMERGENCY_SERVICES["hospitals"] if s["area"] == area],
            "rescue_teams": [s for s in EMERGENCY_SERVICES["rescue_teams"] if s["area"] == area]
        }
    }
    
    return jsonify(area_data)

@app.route('/api/route')
def get_route():
    """Get evacuation route and nearest shelter"""
    return jsonify({
        "route": [[12.9750, 80.2207], [12.9850, 80.2307], [13.0067, 80.2570]],
        "shelter": {"name": "Relief Center - Adyar", "lat": 13.0067, "lng": 80.2570}
    })

@app.route('/api/health')
def health():
    return jsonify({"status": "GeoGuard AI Service Running", "zones": len(CHENNAI_ZONES)})

if __name__ == '__main__':
    app.run(debug=True)
