# 🚀 GeoGuard - Complete Run Guide

## Quick Start (5 Minutes)

### Prerequisites Check
```bash
node --version      # Should be 14+
npm --version       # Should be 6+
python --version    # Should be 3.8+
mongod --version    # Should show version
```

---

## Method 1: Automatic (Windows Only)

### Step 1: Double-click
```
START_ALL.bat
```

### Step 2: Wait for browser
- 4 terminal windows open
- Browser opens to http://localhost:3000
- Done! ✅

---

## Method 2: Manual (All Platforms)

### Terminal 1: MongoDB
```bash
mongod
```
**Wait for**: "waiting for connections on port 27017"

### Terminal 2: Backend
```bash
cd backend
npm install
npm start
```
**Wait for**: "Server running on port 5000"

### Terminal 3: AI Service
```bash
cd ai-service
pip install -r requirements.txt
python predictor.py
```
**Wait for**: "Flask app running on port 5001"

### Terminal 4: Frontend
```bash
cd frontend
npm install
npm start
```
**Wait for**: "Compiled successfully" + Browser opens

---

## Detailed Setup

### 1. Install Node.js
- Download: https://nodejs.org/ (LTS version)
- Run installer
- Verify: `node --version`

### 2. Install Python
- Download: https://www.python.org/ (3.8+)
- Run installer
- Check "Add Python to PATH"
- Verify: `python --version`

### 3. Install MongoDB
- Download: https://www.mongodb.com/try/download/community
- Run installer
- Verify: `mongod --version`

### 4. Navigate to Project
```bash
cd c:\Users\dharu\OneDrive\Desktop\karpagam
```

---

## Running Services

### Backend Setup
```bash
cd backend
npm install
npm start
```

**Expected Output:**
```
✓ Server running on port 5000
✓ MongoDB connected
✓ API endpoints ready
```

### AI Service Setup
```bash
cd ai-service
pip install -r requirements.txt
python predictor.py
```

**Expected Output:**
```
✓ Flask app running on port 5001
✓ AI models loaded
✓ Ready for predictions
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

**Expected Output:**
```
✓ Compiled successfully
✓ Local: http://localhost:3000
✓ Browser opens automatically
```

---

## Access Application

### URLs
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000 |
| AI Service | http://localhost:5001 |

### All Pages
```
Home:              http://localhost:3000/
Dashboard:         http://localhost:3000/dashboard
SOS:               http://localhost:3000/sos
Shelters:          http://localhost:3000/shelters
Admin:             http://localhost:3000/admin
Simulation:        http://localhost:3000/simulation
Detection:         http://localhost:3000/detection
Hyperlocal:        http://localhost:3000/hyperlocal
Drainage:          http://localhost:3000/drainage
Command Center:    http://localhost:3000/command-center
Command Pro:       http://localhost:3000/command-center-pro
Digital Twin:      http://localhost:3000/digital-twin
Digital Twin Pro:  http://localhost:3000/digital-twin-pro
Emergency:         http://localhost:3000/emergency-contacts
```

---

## Troubleshooting

### MongoDB Issues
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or run manually
mongod

# Check if running
tasklist | find "mongod"
```

### Port Already in Use
```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Same for port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### npm Install Fails
```bash
# Clear cache
npm cache clean --force

# Delete node_modules
rmdir /s /q node_modules

# Reinstall
npm install
```

### Python Issues
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install requirements
pip install -r requirements.txt

# Check installation
pip list
```

### Frontend Won't Compile
```bash
# Clear cache
npm cache clean --force

# Delete node_modules
rmdir /s /q node_modules

# Reinstall
npm install

# Start
npm start
```

---

## Verification

### Check Backend
```bash
curl http://localhost:5000/api/health
```
**Expected**: `{"status":"ok"}`

### Check AI Service
```bash
curl http://localhost:5001/health
```
**Expected**: `{"status":"ok"}`

### Check Frontend
Open http://localhost:3000 in browser
**Expected**: Landing page loads with professional UI

### Check MongoDB
```bash
mongo
> show dbs
> exit()
```
**Expected**: Shows databases

---

## Testing

### Test Each Page
1. ✅ Landing - Click feature cards
2. ✅ Dashboard - View map and zones
3. ✅ SOS - Fill form and submit
4. ✅ Shelters - View nearby shelters
5. ✅ Admin - Monitor alerts
6. ✅ Simulation - Adjust sliders
7. ✅ Detection - Upload image
8. ✅ Hyperlocal - View zones
9. ✅ Drainage - Check alerts
10. ✅ Command Center - View heatmap
11. ✅ Command Pro - Advanced dashboard
12. ✅ Digital Twin - 3D model
13. ✅ Digital Twin Pro - Advanced 3D
14. ✅ Emergency - View services

### Check Console
- No red errors
- No warnings
- Smooth animations
- Fast load times

---

## Performance

### Expected Performance
- Page load: < 2 seconds
- Animations: 60fps (smooth)
- No stuttering
- Responsive design
- Professional UI

### Monitor Performance
1. Open DevTools (F12)
2. Go to Performance tab
3. Record page load
4. Check FPS and load time

---

## Stopping Services

### Stop Frontend
- Press `Ctrl+C` in frontend terminal

### Stop Backend
- Press `Ctrl+C` in backend terminal

### Stop AI Service
- Press `Ctrl+C` in AI service terminal

### Stop MongoDB
```bash
# Windows
net stop MongoDB

# Or close terminal
```

---

## Common Commands

### Backend
```bash
cd backend
npm install      # Install dependencies
npm start        # Start server
npm test         # Run tests
```

### Frontend
```bash
cd frontend
npm install      # Install dependencies
npm start        # Start dev server
npm build        # Build for production
npm test         # Run tests
```

### AI Service
```bash
cd ai-service
pip install -r requirements.txt  # Install dependencies
python predictor.py              # Start service
```

---

## Environment Setup

### Backend .env
```env
MONGODB_URI=mongodb://localhost:27017/geoguard
PORT=5000
JWT_SECRET=your_jwt_secret_key
WEATHER_API_KEY=your_weather_api_key
```

### Frontend .env
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AI_URL=http://localhost:5001
```

---

## Docker (Optional)

### Run with Docker
```bash
docker-compose up
```

### Services
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- AI Service: http://localhost:5001
- MongoDB: localhost:27017

---

## Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy Backend
```bash
# Use Heroku, AWS, or your hosting
heroku create geoguard-backend
git push heroku main
```

### Deploy AI Service
```bash
# Use AWS Lambda, Google Cloud, or your hosting
```

---

## Support

### Documentation
- RUN_PROJECT.md - Quick start
- PRE_FLIGHT_CHECKLIST.md - Checklist
- QUICK_START.md - Detailed guide
- PAGES_VERIFICATION.md - Page details

### Troubleshooting
1. Check console for errors
2. Verify all services running
3. Check port availability
4. Review documentation
5. Check GitHub issues

---

## ✅ Final Checklist

- [ ] Node.js installed
- [ ] Python installed
- [ ] MongoDB installed
- [ ] Project extracted
- [ ] Backend running (port 5000)
- [ ] AI Service running (port 5001)
- [ ] Frontend running (port 3000)
- [ ] Browser opens to http://localhost:3000
- [ ] All pages accessible
- [ ] No console errors
- [ ] Professional UI displaying
- [ ] Ready for testing

---

## 🎉 You're Ready!

All services running:
- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:5000
- ✅ AI Service: http://localhost:5001
- ✅ MongoDB: Connected

**Enjoy GeoGuard!** 🌊

---

**GeoGuard - Hyperlocal Flood Risk Intelligence Platform**
