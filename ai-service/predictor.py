import numpy as np
from flask import Flask, request, jsonify
from datetime import datetime, timedelta
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

# MongoDB Connection
MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/geoguard')
client = MongoClient(MONGO_URI)
db = client['geoguard']

class FloodPredictor:
    def __init__(self):
        self.zones = {
            'Velachery': {'lat': 12.9698, 'lng': 80.2405, 'capacity': 150},
            'T Nagar': {'lat': 13.0349, 'lng': 80.2348, 'capacity': 120},
            'Adyar': {'lat': 13.0089, 'lng': 80.2707, 'capacity': 200},
            'Anna Nagar': {'lat': 13.0827, 'lng': 80.2108, 'capacity': 140},
            'Mylapore': {'lat': 13.0329, 'lng': 80.2711, 'capacity': 100},
            'Tambaram': {'lat': 12.9250, 'lng': 80.1269, 'capacity': 160}
        }
    
    def predict_flood_risk(self, zone, rainfall, water_level, elevation):
        risk_score = (rainfall * 0.4) + (water_level * 0.4) + ((100 - elevation) * 0.2)
        risk_score = min(100, max(0, risk_score))
        
        if risk_score < 30:
            risk_level = 'Low'
        elif risk_score < 55:
            risk_level = 'Moderate'
        elif risk_score < 75:
            risk_level = 'High'
        else:
            risk_level = 'Critical'
        
        zone_data = self.zones.get(zone, {})
        
        prediction = {
            'zone': zone,
            'riskScore': round(risk_score, 2),
            'riskLevel': risk_level,
            'rainfall': rainfall,
            'waterLevel': water_level,
            'elevation': elevation,
            'location': {
                'lat': zone_data.get('lat', 13.0827),
                'lng': zone_data.get('lng', 80.2707)
            },
            'timestamp': datetime.now().isoformat()
        }
        
        # Save to MongoDB
        db['flood_predictions'].insert_one(prediction)
        
        return prediction

class DrainageOverflowPredictor:
    def __init__(self):
        self.zones = {
            'Velachery': {'capacity': 150, 'current_level': 0, 'overflow_history': [2015, 2017, 2020]},
            'T Nagar': {'capacity': 120, 'current_level': 0, 'overflow_history': [2015]},
            'Adyar': {'capacity': 200, 'current_level': 0, 'overflow_history': [2015, 2017, 2020, 2021]},
            'Anna Nagar': {'capacity': 140, 'current_level': 0, 'overflow_history': [2015]},
            'Mylapore': {'capacity': 100, 'current_level': 0, 'overflow_history': [2015, 2020]},
            'Tambaram': {'capacity': 160, 'current_level': 0, 'overflow_history': [2015]}
        }
        
        self.translations = {
            'en': {
                'overflow_risk': 'Drainage overflow risk in {minutes} minutes',
                'critical_overflow': 'CRITICAL: Drainage overflow imminent in {minutes} minutes',
                'evacuate': 'Please evacuate to higher ground'
            },
            'ta': {
                'overflow_risk': '{minutes} நிமிடங்களில் வடிகால் வழிதல் ஆபத்து',
                'critical_overflow': 'முக்கியமான: {minutes} நிமிடங்களில் வடிகால் வழிதல் உடனடி',
                'evacuate': 'உயர் நிலத்திற்கு வெளியேற வேண்டுகிறது'
            },
            'hi': {
                'overflow_risk': '{minutes} मिनट में ड्रेनेज ओवरफ्लो का जोखिम',
                'critical_overflow': 'गंभीर: {minutes} मिनट में ड्रेनेज ओवरफ्लो तत्काल',
                'evacuate': 'कृपया ऊंची जमीन पर जाएं'
            }
        }
    
    def predict_overflow(self, zone_name, rainfall, drainage_capacity):
        zone = self.zones.get(zone_name)
        if not zone:
            return None
        
        inflow_rate = rainfall / 60
        outflow_rate = (drainage_capacity / 100) * 0.5
        net_rate = inflow_rate - outflow_rate
        
        if net_rate <= 0:
            return {
                'zone': zone_name,
                'overflow_risk': False,
                'message': 'No overflow risk',
                'drainage_level': zone['current_level'],
                'capacity': zone['capacity']
            }
        
        remaining_capacity = zone['capacity'] - zone['current_level']
        time_to_overflow = remaining_capacity / net_rate if net_rate > 0 else float('inf')
        
        if time_to_overflow < 30:
            risk_level = 'Critical'
            risk_score = 90
        elif time_to_overflow < 60:
            risk_level = 'High'
            risk_score = 75
        elif time_to_overflow < 120:
            risk_level = 'Moderate'
            risk_score = 50
        else:
            risk_level = 'Low'
            risk_score = 25
        
        result = {
            'zone': zone_name,
            'overflow_risk': True,
            'time_to_overflow_minutes': round(time_to_overflow, 1),
            'risk_level': risk_level,
            'risk_score': risk_score,
            'drainage_level': zone['current_level'],
            'capacity': zone['capacity'],
            'inflow_rate': round(inflow_rate, 2),
            'outflow_rate': round(outflow_rate, 2),
            'net_rate': round(net_rate, 2),
            'overflow_history': zone['overflow_history'],
            'timestamp': datetime.now().isoformat()
        }
        
        # Save to MongoDB
        db['drainage_overflow'].insert_one(result)
        
        return result
    
    def get_alert_message(self, zone_name, rainfall, drainage_capacity, language='en'):
        prediction = self.predict_overflow(zone_name, rainfall, drainage_capacity)
        
        if not prediction['overflow_risk']:
            return {
                'zone': zone_name,
                'language': language,
                'message': 'No overflow risk',
                'alert_level': 'None'
            }
        
        time_minutes = prediction['time_to_overflow_minutes']
        trans = self.translations.get(language, self.translations['en'])
        
        if time_minutes < 30:
            message = trans['critical_overflow'].format(minutes=int(time_minutes))
            alert_level = 'Critical'
        else:
            message = trans['overflow_risk'].format(minutes=int(time_minutes))
            alert_level = 'Warning'
        
        alert = {
            'zone': zone_name,
            'language': language,
            'message': message,
            'alert_level': alert_level,
            'time_to_overflow': time_minutes,
            'risk_level': prediction['risk_level'],
            'evacuation_message': trans['evacuate'],
            'timestamp': datetime.now().isoformat()
        }
        
        # Save to MongoDB
        db['alerts'].insert_one(alert)
        
        return alert

class CommandCenterAggregator:
    def __init__(self):
        self.zones_data = {
            'Velachery': {'lat': 12.9698, 'lng': 80.2405, 'risk_score': 82, 'risk_level': 'High'},
            'T Nagar': {'lat': 13.0349, 'lng': 80.2348, 'risk_score': 45, 'risk_level': 'Moderate'},
            'Adyar': {'lat': 13.0089, 'lng': 80.2707, 'risk_score': 65, 'risk_level': 'Moderate'},
            'Anna Nagar': {'lat': 13.0827, 'lng': 80.2108, 'risk_score': 20, 'risk_level': 'Low'},
            'Mylapore': {'lat': 13.0329, 'lng': 80.2711, 'risk_score': 55, 'risk_level': 'Moderate'},
            'Tambaram': {'lat': 12.9250, 'lng': 80.1269, 'risk_score': 35, 'risk_level': 'Low'}
        }
    
    def get_heatmap_data(self):
        return [{'zone': zone, 'lat': data['lat'], 'lng': data['lng'], 'risk_score': data['risk_score'], 'risk_level': data['risk_level'], 'color': self._get_risk_color(data['risk_score'])} for zone, data in self.zones_data.items()]
    
    def _get_risk_color(self, score):
        if score < 30:
            return '#10b981'
        elif score < 55:
            return '#f59e0b'
        elif score < 75:
            return '#f97316'
        else:
            return '#ef4444'
    
    def get_command_center_summary(self, sos_count=5, active_teams=3, shelter_occupancy=65):
        heatmap = self.get_heatmap_data()
        critical_zones = [z for z in heatmap if z['risk_score'] > 75]
        
        summary = {
            'timestamp': datetime.now().isoformat(),
            'heatmap': heatmap,
            'critical_zones': critical_zones,
            'sos_alerts': sos_count,
            'active_rescue_teams': active_teams,
            'shelter_occupancy_percent': shelter_occupancy,
            'total_zones': len(self.zones_data),
            'high_risk_zones': len([z for z in heatmap if z['risk_score'] > 55])
        }
        
        # Save to MongoDB
        db['command_center_data'].insert_one(summary)
        
        return summary

flood_predictor = FloodPredictor()
drainage_predictor = DrainageOverflowPredictor()
aggregator = CommandCenterAggregator()

@app.route('/api/predict-flood', methods=['POST'])
def predict_flood():
    data = request.json
    zone = data.get('zone', 'Velachery')
    rainfall = data.get('rainfall', 50)
    water_level = data.get('water_level', 50)
    elevation = data.get('elevation', 5)
    
    prediction = flood_predictor.predict_flood_risk(zone, rainfall, water_level, elevation)
    return jsonify(prediction)

@app.route('/api/drainage-overflow', methods=['POST'])
def predict_drainage_overflow():
    data = request.json
    zone = data.get('zone', 'Velachery')
    rainfall = data.get('rainfall', 50)
    drainage_capacity = data.get('drainage_capacity', 100)
    
    prediction = drainage_predictor.predict_overflow(zone, rainfall, drainage_capacity)
    if not prediction:
        return jsonify({'error': 'Zone not found'}), 404
    
    return jsonify(prediction)

@app.route('/api/alert-message', methods=['POST'])
def get_alert_message():
    data = request.json
    zone = data.get('zone', 'Velachery')
    rainfall = data.get('rainfall', 50)
    drainage_capacity = data.get('drainage_capacity', 100)
    language = data.get('language', 'en')
    
    alert = drainage_predictor.get_alert_message(zone, rainfall, drainage_capacity, language)
    return jsonify(alert)

@app.route('/api/command-center-summary', methods=['GET'])
def get_command_center_summary():
    sos_count = request.args.get('sos_count', 5, type=int)
    active_teams = request.args.get('active_teams', 3, type=int)
    shelter_occupancy = request.args.get('shelter_occupancy', 65, type=int)
    
    summary = aggregator.get_command_center_summary(sos_count, active_teams, shelter_occupancy)
    return jsonify(summary)

@app.route('/api/heatmap-data', methods=['GET'])
def get_heatmap_data():
    return jsonify(aggregator.get_heatmap_data())

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'AI Service Running'})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
