# 🚀 GeoGuard - Run Project Guide

## Step 1: Install MongoDB

### Windows
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer and follow steps
3. MongoDB installs as a service (auto-starts)

### Verify MongoDB is running
```bash
mongod --version
```

---

## Step 2: Setup Backend

### Open Terminal 1 (Backend)
```bash
cd backend
npm install
npm start
```

**Expected Output:**
```
Server running on port 5000
MongoDB connected
```

---

## Step 3: Setup AI Service

### Open Terminal 2 (AI Service)
```bash
cd ai-service
pip install -r requirements.txt
python predictor.py
```

**Expected Output:**
```
Flask app running on port 5001
```

---

## Step 4: Setup Frontend

### Open Terminal 3 (Frontend)
```bash
cd frontend
npm install
npm start
```

**Expected Output:**
```
Compiled successfully!
Local: http://localhost:3000
```

---

## Step 5: Access Application

Open browser and go to:
```
http://localhost:3000
```

---

## 🎯 All Pages URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000/ |
| Dashboard | http://localhost:3000/dashboard |
| SOS | http://localhost:3000/sos |
| Shelters | http://localhost:3000/shelters |
| Admin | http://localhost:3000/admin |
| Simulation | http://localhost:3000/simulation |
| Detection | http://localhost:3000/detection |
| Hyperlocal | http://localhost:3000/hyperlocal |
| Drainage | http://localhost:3000/drainage |
| Command Center | http://localhost:3000/command-center |
| Command Pro | http://localhost:3000/command-center-pro |
| Digital Twin | http://localhost:3000/digital-twin |
| Digital Twin Pro | http://localhost:3000/digital-twin-pro |
| Emergency | http://localhost:3000/emergency-contacts |

---

## ⚠️ Troubleshooting

### MongoDB not starting
```bash
# Windows - Start MongoDB service
net start MongoDB

# Or run mongod manually
mongod
```

### Port already in use
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### npm install fails
```bash
# Clear cache
npm cache clean --force

# Try again
npm install
```

### Python dependencies fail
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install requirements
pip install -r requirements.txt
```

---

## ✅ Verification

### Check Backend
```bash
curl http://localhost:5000/api/health
```

### Check AI Service
```bash
curl http://localhost:5001/health
```

### Check Frontend
Open http://localhost:3000 in browser

---

## 🎉 You're Ready!

All services running:
- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:5000
- ✅ AI Service: http://localhost:5001
- ✅ MongoDB: Connected

Enjoy GeoGuard! 🌊
