# ✅ GeoGuard - Pre-Flight Checklist

## Before Running Project

### System Requirements
- [ ] Windows 10/11 or Mac/Linux
- [ ] Node.js 14+ installed
- [ ] Python 3.8+ installed
- [ ] MongoDB installed
- [ ] 4GB RAM available
- [ ] 500MB disk space

### Verify Installations
```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check Python
python --version

# Check MongoDB
mongod --version
```

---

## Installation Steps

### 1. Install Node.js
- [ ] Download from https://nodejs.org/
- [ ] Install LTS version
- [ ] Verify: `node --version`

### 2. Install Python
- [ ] Download from https://www.python.org/
- [ ] Install Python 3.8+
- [ ] Check "Add Python to PATH"
- [ ] Verify: `python --version`

### 3. Install MongoDB
- [ ] Download from https://www.mongodb.com/try/download/community
- [ ] Install Community Edition
- [ ] Verify: `mongod --version`

### 4. Clone/Download Project
- [ ] Extract GeoGuard project
- [ ] Navigate to project folder

---

## Setup Steps

### 1. Backend Setup
```bash
cd backend
npm install
```
- [ ] No errors during install
- [ ] node_modules folder created

### 2. Frontend Setup
```bash
cd frontend
npm install
```
- [ ] No errors during install
- [ ] node_modules folder created

### 3. AI Service Setup
```bash
cd ai-service
pip install -r requirements.txt
```
- [ ] No errors during install
- [ ] All packages installed

---

## Running Project

### Option A: Manual (4 Terminals)

**Terminal 1 - MongoDB**
```bash
mongod
```
- [ ] Shows "waiting for connections"

**Terminal 2 - Backend**
```bash
cd backend
npm start
```
- [ ] Shows "Server running on port 5000"
- [ ] Shows "MongoDB connected"

**Terminal 3 - AI Service**
```bash
cd ai-service
python predictor.py
```
- [ ] Shows "Flask app running on port 5001"

**Terminal 4 - Frontend**
```bash
cd frontend
npm start
```
- [ ] Shows "Compiled successfully"
- [ ] Browser opens to http://localhost:3000

### Option B: Automatic (Windows)
```bash
START_ALL.bat
```
- [ ] All 4 windows open
- [ ] Browser opens to http://localhost:3000

---

## Verification

### Check Services Running
- [ ] Frontend: http://localhost:3000 (loads)
- [ ] Backend: http://localhost:5000/api/health (responds)
- [ ] AI Service: http://localhost:5001/health (responds)
- [ ] MongoDB: Connected (no errors in backend)

### Test Pages
- [ ] Landing page loads
- [ ] Dashboard shows map
- [ ] SOS form works
- [ ] Shelters display
- [ ] Admin dashboard loads
- [ ] All 14 pages accessible

---

## Common Issues & Fixes

### MongoDB Won't Start
```bash
# Windows - Start service
net start MongoDB

# Or run manually
mongod
```

### Port Already in Use
```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill it
taskkill /PID <PID> /F
```

### npm install fails
```bash
npm cache clean --force
npm install
```

### Python packages fail
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

---

## Performance Check

- [ ] Pages load in < 2 seconds
- [ ] Animations smooth (no stuttering)
- [ ] No console errors
- [ ] No memory leaks
- [ ] Responsive on mobile

---

## Security Check

- [ ] No sensitive data in console
- [ ] No API keys exposed
- [ ] CORS working
- [ ] JWT tokens valid
- [ ] Input validation working

---

## Final Status

- [ ] All services running
- [ ] All pages accessible
- [ ] No errors in console
- [ ] Professional UI displaying
- [ ] Ready for testing

---

## Next Steps

1. ✅ Complete this checklist
2. ✅ Run the project
3. ✅ Test all pages
4. ✅ Check console for errors
5. ✅ Verify API connections
6. ✅ Test on mobile
7. ✅ Ready for deployment

---

**GeoGuard - Ready to Run!** 🚀
