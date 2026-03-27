# 📋 GeoGuard - How to Run Project

## 🎯 Quick Answer: 3 Ways to Run

---

## ⚡ Way 1: Fastest (Windows Only) - 1 Click

### Step 1: Double-click this file
```
START_ALL.bat
```

### Step 2: Wait 10 seconds
- 4 terminal windows open
- Browser opens to http://localhost:3000
- Done! ✅

---

## 🚀 Way 2: Manual (All Platforms) - 4 Terminals

### Open 4 Terminal Windows

**Terminal 1: MongoDB**
```bash
mongod
```

**Terminal 2: Backend**
```bash
cd backend
npm install
npm start
```

**Terminal 3: AI Service**
```bash
cd ai-service
pip install -r requirements.txt
python predictor.py
```

**Terminal 4: Frontend**
```bash
cd frontend
npm install
npm start
```

### Result
- Frontend: http://localhost:3000 ✅
- Backend: http://localhost:5000 ✅
- AI Service: http://localhost:5001 ✅

---

## 📖 Way 3: Detailed Guide

Read: **COMPLETE_RUN_GUIDE.md**

---

## ✅ Prerequisites (One-Time Setup)

### Install These (if not already installed)

1. **Node.js** (14+)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **Python** (3.8+)
   - Download: https://www.python.org/
   - Verify: `python --version`

3. **MongoDB**
   - Download: https://www.mongodb.com/try/download/community
   - Verify: `mongod --version`

---

## 🔍 Verify Everything Works

### Check Services
```bash
# Check Frontend
http://localhost:3000

# Check Backend
http://localhost:5000/api/health

# Check AI Service
http://localhost:5001/health
```

### Check Console
- No red errors
- Smooth animations
- Professional UI visible

---

## 🎮 Test All 14 Pages

| # | Page | URL |
|---|------|-----|
| 1 | Home | http://localhost:3000/ |
| 2 | Dashboard | http://localhost:3000/dashboard |
| 3 | SOS | http://localhost:3000/sos |
| 4 | Shelters | http://localhost:3000/shelters |
| 5 | Admin | http://localhost:3000/admin |
| 6 | Simulation | http://localhost:3000/simulation |
| 7 | Detection | http://localhost:3000/detection |
| 8 | Hyperlocal | http://localhost:3000/hyperlocal |
| 9 | Drainage | http://localhost:3000/drainage |
| 10 | Command Center | http://localhost:3000/command-center |
| 11 | Command Pro | http://localhost:3000/command-center-pro |
| 12 | Digital Twin | http://localhost:3000/digital-twin |
| 13 | Digital Twin Pro | http://localhost:3000/digital-twin-pro |
| 14 | Emergency | http://localhost:3000/emergency-contacts |

---

## ⚠️ If Something Goes Wrong

### MongoDB Won't Start
```bash
# Windows
net start MongoDB

# Or run manually
mongod
```

### Port Already in Use
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### npm Install Fails
```bash
npm cache clean --force
npm install
```

### Python Issues
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **COMPLETE_RUN_GUIDE.md** | Detailed setup guide |
| **RUN_PROJECT.md** | Quick start |
| **PRE_FLIGHT_CHECKLIST.md** | Verification checklist |
| **QUICK_START.md** | Testing guide |
| **PAGES_VERIFICATION.md** | Page details |
| **UI_BEST_PRACTICES.md** | Design guidelines |

---

## 🎯 Expected Results

### When Everything Works
✅ Frontend loads at http://localhost:3000
✅ Professional UI visible
✅ Smooth animations
✅ All 14 pages accessible
✅ No console errors
✅ Real-time data updating
✅ Maps displaying
✅ 3D models rendering

### Performance
✅ Page load < 2 seconds
✅ Animations 60fps
✅ Responsive design
✅ Professional styling

---

## 🚀 You're Ready!

### Choose Your Method:
1. **Fastest**: Double-click `START_ALL.bat`
2. **Manual**: Open 4 terminals and run commands
3. **Detailed**: Read `COMPLETE_RUN_GUIDE.md`

### Then:
1. Open http://localhost:3000
2. Test all pages
3. Enjoy GeoGuard! 🌊

---

## 💡 Tips

- Keep all 4 terminals open while using the app
- Close any terminal to stop that service
- Use `Ctrl+C` to stop a service
- Check browser console (F12) for errors
- Refresh page if something looks wrong

---

## ✨ What You'll See

### Landing Page
- Professional gradient backgrounds
- Smooth animations
- Feature cards
- Navigation to all pages

### Dashboard
- Interactive map
- Real-time zones
- Risk indicators
- Professional UI

### All Other Pages
- Professional design
- Smooth animations
- Responsive layout
- Real-time data

---

## 🎉 Final Status

**GeoGuard Platform**: ✅ READY TO RUN

**All 14 Pages**: ✅ WORKING

**Professional UI**: ✅ COMPLETE

**Animations**: ✅ SMOOTH

**Documentation**: ✅ COMPLETE

---

## 📞 Need Help?

1. Check **COMPLETE_RUN_GUIDE.md** for detailed steps
2. Check **PRE_FLIGHT_CHECKLIST.md** for verification
3. Check browser console (F12) for errors
4. Verify all services running on correct ports

---

**GeoGuard - Hyperlocal Flood Risk Intelligence Platform**

**Ready to run! 🚀**
