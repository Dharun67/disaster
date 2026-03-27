# GeoGuard - Full Stack Deployment Guide

## Project Structure

```
geoguard/
├── frontend/                 # React.js application
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── App.js
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Node.js/Express server
│   ├── models/
│   │   └── schemas.js       # MongoDB schemas
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── ai-service/              # Python prediction service
│   ├── predictor.py
│   └── requirements.txt
└── sample-data.js           # MongoDB seed data
```

## Prerequisites

- Node.js v16+
- Python 3.8+
- MongoDB 4.4+
- npm or yarn

## Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and API keys
npm start
```

Backend runs on: http://localhost:5000

### 2. AI Service Setup

```bash
cd ai-service
pip install -r requirements.txt
python predictor.py
```

AI Service runs on: http://localhost:5001

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000

### 4. MongoDB Setup

```bash
# Start MongoDB
mongod

# In another terminal, seed sample data
mongo < sample-data.js
```

## API Endpoints

### Flood Predictions
- GET `/api/flood-predictions` - Get all predictions
- GET `/api/flood-predictions/:zone` - Get zone prediction

### SOS Alerts
- POST `/api/sos-alert` - Send emergency alert
- GET `/api/sos-alerts` - Get active alerts (admin)

### User Reports
- POST `/api/user-report` - Submit disaster report
- GET `/api/user-reports` - Get all reports

### Shelters
- GET `/api/shelters` - Get all shelters
- GET `/api/shelters/nearby?lat=X&lng=Y` - Get nearby shelters

### Rescue Teams
- GET `/api/rescue-teams` - Get available teams

## Features

✅ Hyperlocal flood risk prediction
✅ Interactive map dashboard
✅ Real-time SOS alerts
✅ Shelter locator with capacity tracking
✅ Admin command center
✅ Crowdsourced disaster reports
✅ Rescue team coordination
✅ Dark theme emergency UI

## Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/geoguard
PORT=5000
JWT_SECRET=your_secret_key
WEATHER_API_KEY=your_api_key
```

## Testing

1. Open http://localhost:3000
2. Click "Dashboard" to view flood risk map
3. Click "Send SOS" to test emergency alerts
4. Click "Find Shelter" to locate relief centers
5. Visit http://localhost:3000/admin for command center

## Deployment

### Docker Deployment

```bash
docker-compose up
```

### Cloud Deployment

- Frontend: Vercel, Netlify
- Backend: Heroku, AWS EC2
- Database: MongoDB Atlas
- AI Service: AWS Lambda, Google Cloud Functions

## Performance Optimization

- Implement caching for predictions
- Use WebSockets for real-time updates
- Optimize map rendering with clustering
- Add database indexing on location fields

## Security

- Implement JWT authentication
- Add rate limiting on APIs
- Validate all user inputs
- Use HTTPS in production
- Secure MongoDB with authentication

## Support

For issues or questions, contact: support@geoguard.com
