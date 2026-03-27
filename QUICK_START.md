# GeoGuard - Quick Start Guide

## System Status
✅ **Backend**: Running on http://localhost:5000
✅ **Frontend**: Running on http://localhost:3000
✅ **Database**: MongoDB Atlas Connected

## Login Credentials

### Test Account
- **Email**: test@geoguard.com
- **Password**: test123

### Create New Account
You can also create a new account directly from the login page by clicking "Sign Up"

## What's New

### Professional Login UI
- Clean, modern design (no AI-generated look)
- Simple email/password authentication
- Sign up and login on the same page
- Responsive design for mobile and desktop

### Backend Updates
- Added `/api/auth/login-simple` endpoint for email/password login
- Added `/api/auth/register-simple` endpoint for user registration
- Password hashing with bcryptjs for security
- 30-day session tokens

## How to Use

1. **Open Frontend**: http://localhost:3000
2. **Login Page**: You'll be redirected to the login page
3. **Enter Credentials**:
   - Email: test@geoguard.com
   - Password: test123
4. **Click Login**: You'll be authenticated and redirected to the dashboard

## Features Available

- 🗺️ Live Disaster Dashboard
- 🚨 Emergency SOS System
- 🏠 Shelter Locator
- 👥 Rescue Team Coordination
- 📊 Admin Command Center
- 📱 Crowdsourced Reports

## API Endpoints

### Authentication
- `POST /api/auth/login-simple` - Login with email/password
- `POST /api/auth/register-simple` - Register new user

### Flood Predictions
- `GET /api/flood-predictions` - Get all predictions
- `GET /api/flood-predictions/:zone` - Get zone-specific prediction

### SOS Alerts
- `POST /api/sos-alert` - Create SOS alert
- `GET /api/sos-alerts` - Get active alerts

### Shelters
- `GET /api/shelters` - Get all shelters
- `GET /api/shelters/nearby?lat=X&lng=Y` - Get nearby shelters

### Rescue Teams
- `GET /api/rescue-teams` - Get all teams

## Troubleshooting

### Login Not Working
1. Check if backend is running: http://localhost:5000/api/health
2. Verify MongoDB connection in backend logs
3. Clear browser cache and try again

### Frontend Not Loading
1. Check if frontend is running on port 3000
2. Clear node_modules and reinstall: `npm install`
3. Restart the development server

### Database Connection Issues
1. Verify MongoDB Atlas connection string in `.env`
2. Check internet connection
3. Verify IP whitelist in MongoDB Atlas

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://dharun143:dharun143@cluster0.mxw8xkj.mongodb.net/geoguard?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Next Steps

1. ✅ Login with test account
2. ✅ Explore the dashboard
3. ✅ Test SOS alert feature
4. ✅ Check shelter locator
5. ✅ Create additional test users

---

**GeoGuard** - Transforming Disaster Alerts into Actionable Intelligence
