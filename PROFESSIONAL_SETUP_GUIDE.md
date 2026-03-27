# GeoGuard - Complete Setup & Integration Guide

## 🎯 Project Overview

GeoGuard is a production-ready AI-powered hyperlocal flood risk prediction system with real-time disaster management capabilities. This guide ensures proper integration between frontend, backend, and database.

## 📋 Prerequisites

- **Node.js** v14+ (https://nodejs.org/)
- **MongoDB** v4.4+ (https://www.mongodb.com/try/download/community)
- **npm** v6+ or **yarn**
- **Git** (optional)

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. **Install MongoDB Community Edition**
   - Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
   - macOS: `brew install mongodb-community`
   - Linux: Follow official MongoDB docs

2. **Start MongoDB Service**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Verify Connection**
   ```bash
   mongosh
   > show databases
   > exit
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/geoguard`
4. Update `MONGODB_URI` in backend `.env`

## 🚀 Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment

Create/update `.env` file:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/geoguard
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key_change_in_production
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Step 3: Initialize Database

```bash
# Load sample data
node init-db.js
```

### Step 4: Start Backend Server

```bash
npm run dev
```

Expected output:
```
✓ MongoDB connected successfully
🚀 GeoGuard Backend Server
📍 Running on http://localhost:5000
🔗 Database: Connected
🌍 CORS enabled for: http://localhost:3000
```

### Step 5: Verify Backend

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "GeoGuard Backend Running",
  "database": "Connected",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "2.0.0",
  "environment": "development"
}
```

## 🎨 Frontend Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment

Create/update `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
REACT_APP_VERSION=2.0.0
REACT_APP_APP_NAME=GeoGuard
```

### Step 3: Start Frontend Server

```bash
npm start
```

Expected output:
```
Compiled successfully!

You can now view geoguard-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

## 🔗 Integration Verification

### Test Authentication Flow

1. Open http://localhost:3000
2. Click "Login"
3. Enter email: `test@example.com`
4. System should send OTP (check console for mock OTP)
5. Enter OTP and verify login

### Test API Integration

1. After login, navigate to Dashboard
2. Check browser console for API calls
3. Verify data loads from backend

### Test Database Connection

```bash
# In MongoDB shell
mongosh
> use geoguard
> db.users.find()
> db.floodpredictions.find()
```

## 📊 Database Collections

The system uses these MongoDB collections:

- **users** - User accounts and authentication
- **otpsessions** - OTP verification sessions
- **floodpredictions** - Zone-wise flood risk predictions
- **sosalerts** - Emergency distress signals
- **userreports** - Crowdsourced disaster reports
- **shelters** - Relief center information
- **rescueteams** - Emergency response teams
- **zones** - Geographic zones with risk data
- **policestations** - Police station locations
- **ambulanceservices** - Ambulance service data
- **hospitals** - Hospital information

## 🔐 Security Configuration

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper email service credentials
- [ ] Enable HTTPS/SSL
- [ ] Set up rate limiting
- [ ] Configure CORS for production domain
- [ ] Use MongoDB Atlas with IP whitelist
- [ ] Enable database backups
- [ ] Set up monitoring and logging

## 🐳 Docker Setup (Optional)

### Build and Run with Docker Compose

```bash
docker-compose up
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Request OTP
- `POST /api/auth/verify-login` - Verify OTP and login

### Flood Predictions
- `GET /api/flood-predictions` - Get all predictions
- `POST /api/ml/predict` - Get ML prediction

### Emergency Services
- `POST /api/sos-alert` - Send SOS alert
- `GET /api/sos-alerts` - Get active alerts
- `GET /api/shelters` - Get shelter locations
- `GET /api/rescue-teams` - Get rescue teams

### Admin
- `GET /api/command-center-data` - Get dashboard data
- `GET /api/featured-resources` - Get featured resources
- `GET /api/marketplace-products` - Get marketplace items

## 🧪 Testing

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Test Prediction
```bash
curl -X POST http://localhost:5000/api/ml/predict \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rainfall":50,"waterLevel":60,"elevation":10}'
```

### Test SOS Alert
```bash
curl -X POST http://localhost:5000/api/sos-alert \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "phone":"9876543210",
    "location":"Velachery",
    "message":"Need help",
    "lat":13.0827,
    "lng":80.2707
  }'
```

## 🚨 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB service is running
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Verify `FRONTEND_URL` in backend `.env` matches frontend URL

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill process or change PORT in `.env`
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### API Not Responding
1. Check backend is running: `curl http://localhost:5000/api/health`
2. Check MongoDB connection: `mongosh`
3. Check frontend `.env` has correct `REACT_APP_API_URL`
4. Check browser console for errors

## 📈 Performance Optimization

- Database indexing on frequently queried fields
- API response caching
- Frontend code splitting
- Image optimization
- Lazy loading components

## 🔄 Deployment

### Heroku (Backend)
```bash
heroku create geoguard-backend
git push heroku main
```

### Vercel (Frontend)
```bash
vercel deploy
```

### MongoDB Atlas
- Create cluster at mongodb.com/cloud/atlas
- Update `MONGODB_URI` with connection string

## 📞 Support

- Check logs: `npm run dev` shows detailed errors
- Verify all services running: Backend, MongoDB, Frontend
- Test API endpoints with curl or Postman
- Check browser console for frontend errors

## ✅ Verification Checklist

- [ ] MongoDB running and accessible
- [ ] Backend server started on port 5000
- [ ] Frontend server started on port 3000
- [ ] API health check returns 200
- [ ] Login flow works end-to-end
- [ ] Dashboard loads data from backend
- [ ] Database collections populated
- [ ] No CORS errors in console
- [ ] No authentication errors
- [ ] All pages load correctly

## 🎉 You're Ready!

Once all steps are complete, GeoGuard is fully operational with:
- ✓ Frontend-Backend integration
- ✓ Database connectivity
- ✓ Authentication system
- ✓ Real-time data flow
- ✓ Production-ready architecture

Access the application at: **http://localhost:3000**

---

**GeoGuard v2.0.0** - Professional Disaster Management Platform
