# 🚀 GeoGuard - Error-Free Setup Guide

## ✅ Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v14+) - Download from https://nodejs.org
- ✅ Python (v3.8+) - Download from https://python.org
- ✅ MongoDB Atlas account (FREE) - Already configured in .env

## 🎯 Quick Start (3 Steps)

### Step 1: Install Dependencies

Open 3 separate terminals in the project folder:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

**Terminal 3 - AI Service:**
```bash
cd ai-service
pip install flask pymongo numpy
```

### Step 2: Start Services

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```
✅ Should show: "GeoGuard Backend Server Running on http://localhost:5000"

**Terminal 2 - AI Service:**
```bash
cd ai-service
python predictor.py
```
✅ Should show: "Running on http://127.0.0.1:5001"

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```
✅ Should open browser at http://localhost:3000

### Step 3: Access Application

Open browser: **http://localhost:3000**

## 🔧 Common Issues & Fixes

### Issue 1: "Port already in use"
**Fix:** Change port in .env file or kill existing process

### Issue 2: "Module not found"
**Fix:** Run `npm install` in the respective folder

### Issue 3: "MongoDB connection error"
**Fix:** Already using MongoDB Atlas (cloud) - no local MongoDB needed!

### Issue 4: Python packages missing
**Fix:** 
```bash
pip install flask pymongo numpy
```

## 📱 Test the Application

1. **Register:** Create account at http://localhost:3000
2. **Login:** Use your credentials
3. **Dashboard:** View flood risk map
4. **SOS:** Test emergency alert
5. **Shelters:** Find nearby shelters

## 🌐 MongoDB Atlas (Already Configured)

Your .env file already has MongoDB Atlas connection:
```
MONGODB_URI=mongodb+srv://dharun143:dharun143@cluster0.mxw8xkj.mongodb.net/geoguard
```

✅ No local MongoDB installation needed!
✅ Cloud database - works from anywhere!

## 🎨 Features Available

- ✅ User Registration & Login
- ✅ Flood Risk Prediction
- ✅ Interactive Map
- ✅ SOS Alerts
- ✅ Shelter Locator
- ✅ Admin Dashboard
- ✅ ML Predictions

## 📞 Support

If you encounter any errors:
1. Check all 3 services are running
2. Verify ports: 3000 (frontend), 5000 (backend), 5001 (AI)
3. Check internet connection (for MongoDB Atlas)

## 🚀 One-Click Start (Windows)

Double-click: **START_PROJECT.bat**

This will automatically:
1. Install all dependencies
2. Start all 3 services
3. Open browser

---

**You're all set! 🎉**
