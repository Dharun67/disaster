# GeoGuard - Complete Setup & Deployment Guide

## Prerequisites
- Node.js 16+
- Python 3.8+
- MongoDB 4.4+
- Git

## Database Setup

### 1. Install MongoDB
```bash
# Windows
choco install mongodb-community

# macOS
brew tap mongodb/brew
brew install mongodb-community

# Linux
sudo apt-get install -y mongodb
```

### 2. Start MongoDB
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
# or
mongod
```

### 3. Initialize Sample Data
```bash
mongo < sample-data.js
```

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create .env File
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/geoguard
PORT=5000
JWT_SECRET=your_secret_key
```

### 3. Start Backend Server
```bash
npm start
```

Server runs on `http://localhost:5000`

## AI Service Setup

### 1. Install Python Dependencies
```bash
cd ai-service
pip install -r requirements.txt
```

### 2. Start AI Service
```bash
python predictor.py
```

Service runs on `http://localhost:5001`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Frontend
```bash
npm start
```

Frontend runs on `http://localhost:3000`

## Docker Deployment

### Build and Run with Docker Compose
```bash
docker-compose up --build
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- AI Service: http://localhost:5001

## API Endpoints

### Flood Predictions
- `GET /api/flood-predictions` - Get all predictions
- `GET /api/flood-predictions/:zone` - Get zone prediction
- `POST /api/flood-predictions` - Create prediction

### SOS Alerts
- `POST /api/sos-alert` - Create SOS alert
- `GET /api/sos-alerts` - Get active alerts
- `PUT /api/sos-alert/:id` - Resolve alert

### User Reports
- `POST /api/user-report` - Create report
- `GET /api/user-reports` - Get all reports

### Shelters
- `GET /api/shelters` - Get all shelters
- `GET /api/shelters/nearby?lat=X&lng=Y` - Get nearby shelters
- `PUT /api/shelters/:id` - Update shelter

### Rescue Teams
- `GET /api/rescue-teams` - Get all teams
- `PUT /api/rescue-teams/:id` - Update team

### Command Center
- `GET /api/command-center-data` - Get aggregated data

## Database Collections

1. **flood_predictions** - Zone-wise risk predictions
2. **sos_alerts** - Emergency distress signals
3. **user_reports** - Crowdsourced disaster reports
4. **shelters** - Relief center information
5. **rescue_teams** - Emergency response teams
6. **command_center_data** - Aggregated dashboard data
7. **drainage_overflow** - Drainage overflow predictions
8. **alerts** - Multi-language alert messages

## Features

### Core Features
- ✅ Live Flood Risk Map
- ✅ Emergency SOS System
- ✅ Shelter Locator
- ✅ Rescue Team Coordination
- ✅ Crowdsourced Reports

### Advanced Features
- ✅ AI Flood Simulation (1, 3, 6 hours)
- ✅ Satellite & Drone Detection
- ✅ Hyperlocal Predictions
- ✅ Drainage Overflow Detection
- ✅ Multi-Language Alerts (EN, TA, HI)
- ✅ Authority Command Center
- ✅ Digital Twin 3D Model

## Testing

### Test Backend APIs
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/flood-predictions
curl http://localhost:5000/api/command-center-data
```

### Test AI Service
```bash
curl -X POST http://localhost:5001/api/predict-flood \
  -H "Content-Type: application/json" \
  -d '{"zone":"Velachery","rainfall":50,"water_level":50,"elevation":5}'
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify port 27017 is accessible

### Backend Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

### Frontend Build Issues
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

## Production Deployment

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
1. Create cluster at mongodb.com/cloud/atlas
2. Update MONGODB_URI in .env

### AWS/GCP (AI Service)
- Deploy as Lambda/Cloud Function
- Or use EC2/Compute Engine

## Performance Optimization

- Database indexing on location fields
- API response caching
- Real-time WebSocket updates
- Lazy loading for maps
- Image optimization

## Security

- JWT authentication for admin
- Input validation on all endpoints
- CORS protection
- Rate limiting ready
- Password hashing with bcryptjs
- Environment variable protection

## Support

For issues or questions:
- Check logs: `tail -f backend/logs.txt`
- Review API documentation
- Check MongoDB collections
- Verify all services running

## License

MIT License - See LICENSE file
