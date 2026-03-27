# GeoGuard - AI-Powered Hyperlocal Flood Risk Prediction System

A full-stack disaster intelligence platform that predicts flood risk at hyperlocal levels, provides real-time evacuation guidance, and enables emergency coordination.

## 🎯 Features

### Core Functionality
- **Hyperlocal Flood Risk Prediction** - AI model predicts risk for specific zones
- **Interactive Disaster Map** - Real-time visualization with color-coded risk levels
- **Emergency SOS System** - One-click distress alerts with location tracking
- **Shelter Locator** - Find nearby relief centers with capacity tracking
- **Admin Command Center** - Monitor all alerts, reports, and rescue operations
- **Crowdsourced Reports** - Users can report floods, blocked roads, water levels
- **Rescue Team Coordination** - Track available teams and assign zones

### Risk Categories
- 🟢 **Low** (< 30) - Safe
- 🟡 **Moderate** (30-55) - Caution advised
- 🟠 **High** (55-75) - Evacuate recommended
- 🔴 **Critical** (> 75) - Immediate evacuation required

## 🏗️ Tech Stack

### Frontend
- React.js 18
- Tailwind CSS
- Framer Motion (animations)
- Leaflet (map visualization)
- Axios (HTTP client)

### Backend
- Node.js + Express.js
- MongoDB
- JWT Authentication
- CORS enabled

### AI/ML
- Python Flask microservice
- Numpy for calculations
- Weighted risk prediction model

## 📁 Project Structure

```
geoguard/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.js
│   │   │   ├── Dashboard.js
│   │   │   ├── SOSPanel.js
│   │   │   ├── ShelterLocator.js
│   │   │   └── AdminDashboard.js
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── backend/
│   ├── models/
│   │   └── schemas.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── ai-service/
│   ├── predictor.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
├── sample-data.js
└── SETUP.md
```

## 🚀 Quick Start

### Option 1: Local Development

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm start
```

**AI Service:**
```bash
cd ai-service
pip install -r requirements.txt
python predictor.py
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

**MongoDB:**
```bash
mongod
mongo < sample-data.js
```

### Option 2: Docker Compose

```bash
docker-compose up
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- AI Service: http://localhost:5001

## 📊 API Endpoints

### Flood Predictions
```
GET  /api/flood-predictions
GET  /api/flood-predictions/:zone
```

### SOS Alerts
```
POST /api/sos-alert
GET  /api/sos-alerts
```

### User Reports
```
POST /api/user-report
GET  /api/user-reports
```

### Shelters
```
GET  /api/shelters
GET  /api/shelters/nearby?lat=X&lng=Y
```

### Rescue Teams
```
GET  /api/rescue-teams
```

## 🔐 Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/geoguard
PORT=5000
JWT_SECRET=your_jwt_secret_key
WEATHER_API_KEY=your_weather_api_key
```

## 📱 Pages

1. **Landing Page** - Overview and navigation
2. **Live Dashboard** - Interactive map with zone details
3. **SOS Panel** - Emergency alert submission
4. **Shelter Locator** - Find relief centers
5. **Admin Center** - Command and control dashboard

## 🧠 AI Prediction Model

Risk Score = (Rainfall × 0.4) + (Water Level × 0.4) + ((100 - Elevation) × 0.2)

**Inputs:**
- Rainfall intensity (mm)
- Water level (%)
- Elevation (meters)

**Output:**
- Risk level (Low/Moderate/High/Critical)
- Risk score (0-100)

## 🗄️ Database Collections

- **users** - User accounts and profiles
- **flood_predictions** - Zone-wise risk predictions
- **weather_data** - Real-time weather information
- **sos_alerts** - Emergency distress signals
- **user_reports** - Crowdsourced disaster reports
- **shelters** - Relief center information
- **rescue_teams** - Emergency response teams

## 🎨 UI/UX Features

- Dark theme emergency dashboard
- Smooth Framer Motion animations
- Responsive design (mobile-first)
- Real-time map updates
- Color-coded risk visualization
- Emergency alert banners
- Capacity tracking visualizations

## 🔒 Security

- JWT authentication for admin
- Input validation on all endpoints
- CORS protection
- Rate limiting ready
- Password hashing with bcryptjs
- Environment variable protection

## 📈 Scalability

- Modular component architecture
- Microservice-based AI service
- Database indexing on location fields
- Caching-ready API design
- Docker containerization
- Cloud-ready deployment

## 🚢 Deployment

### Vercel (Frontend)
```bash
vercel deploy
```

### Heroku (Backend)
```bash
heroku create geoguard-backend
git push heroku main
```

### MongoDB Atlas
- Create cluster at mongodb.com/cloud/atlas
- Update MONGODB_URI in .env

### AWS/GCP (AI Service)
- Deploy as Lambda/Cloud Function
- Or use EC2/Compute Engine

## 📝 Sample Data

Run `mongo < sample-data.js` to populate:
- 3 flood prediction zones
- 2 relief shelters
- 2 rescue teams
- 1 admin user

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

- Email: support@geoguard.com
- Issues: GitHub Issues
- Documentation: See SETUP.md

## 🙏 Acknowledgments

- OpenStreetMap for map data
- Leaflet.js for mapping library
- React community for excellent tools
- All contributors and testers

---

**GeoGuard** - Transforming Disaster Alerts into Actionable Intelligence
