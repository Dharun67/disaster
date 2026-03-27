# 🚀 GeoGuard - Quick Start Guide

## ⚡ 5-Minute Setup

### Prerequisites Check
```bash
node --version    # Should be v14+
npm --version     # Should be v6+
mongod --version  # Should be v4.4+
```

---

## 📦 Step 1: Start MongoDB

### Windows
```bash
net start MongoDB
```

### macOS
```bash
brew services start mongodb-community
```

### Linux
```bash
sudo systemctl start mongod
```

**Verify:** `mongosh` should connect successfully

---

## 🔧 Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Initialize database with sample data
node init-db-production.js

# Start backend server
npm run dev
```

**Expected Output:**
```
✓ MongoDB connected successfully
🚀 GeoGuard Backend Server
📍 Running on http://localhost:5000
🔗 Database: Connected
🌍 CORS enabled for: http://localhost:3000
```

**Verify:** Open http://localhost:5000/api/health in browser

---

## 🎨 Step 3: Setup Frontend

Open a **new terminal** and run:

```bash
cd frontend

# Install dependencies
npm install

# Start frontend server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view geoguard-frontend in the browser.

  Local:            http://localhost:3000
```

---

## ✅ Step 4: Verify Integration

1. **Open Browser:** http://localhost:3000
2. **Login Page:** Should load without errors
3. **Enter Email:** `test@example.com`
4. **Check Console:** Should show OTP sent message
5. **Enter OTP:** `123456` (default test OTP)
6. **Dashboard:** Should load with real data from backend

---

## 🧪 Quick Tests

### Test 1: API Health Check
```bash
curl http://localhost:5000/api/health
```

### Test 2: Get Flood Predictions
```bash
curl http://localhost:5000/api/flood-predictions
```

### Test 3: Get Shelters
```bash
curl http://localhost:5000/api/shelters
```

### Test 4: Get Rescue Teams
```bash
curl http://localhost:5000/api/rescue-teams
```

---

## 🎯 Default Test Credentials

| Field | Value |
|-------|-------|
| Email | test@example.com |
| OTP | 123456 |
| Role | User |

---

## 📊 Database Collections

After initialization, you'll have:

- ✓ 3 Users (Admin, Test User, Rescue Lead)
- ✓ 5 Zones (Velachery, Tambaram, Guindy, Adyar, Besant Nagar)
- ✓ 5 Flood Predictions
- ✓ 5 Shelters (2,100 total capacity)
- ✓ 5 Rescue Teams (59 members)
- ✓ 3 Police Stations
- ✓ 3 Ambulance Services
- ✓ 3 Hospitals

---

## 🔗 Access Points

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:3000 | ✓ |
| Backend | http://localhost:5000 | ✓ |
| MongoDB | localhost:27017 | ✓ |
| API Health | http://localhost:5000/api/health | ✓ |

---

## 🚨 Troubleshooting

### Issue: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Fix:** Start MongoDB service
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community
```

### Issue: Port 5000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Fix:** Kill existing process
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: CORS Error in Browser
```
Access to XMLHttpRequest blocked by CORS policy
```
**Fix:** Verify backend `.env` has:
```env
FRONTEND_URL=http://localhost:3000
```

### Issue: API Not Responding
1. Check backend running: `curl http://localhost:5000/api/health`
2. Check MongoDB: `mongosh`
3. Check frontend `.env`: `REACT_APP_API_URL=http://localhost:5000`
4. Check browser console for errors

---

## 📝 Environment Files

### Backend `.env`
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/geoguard
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

---

## 🎉 You're Ready!

Once all steps complete:

1. ✅ Backend running on port 5000
2. ✅ Frontend running on port 3000
3. ✅ MongoDB connected
4. ✅ Database populated with sample data
5. ✅ Full integration working

**Access:** http://localhost:3000

---

## 📚 Next Steps

- Explore Dashboard
- Test SOS Alert feature
- Check Shelter Locator
- View Analytics
- Test Admin Panel

---

## 🆘 Need Help?

1. Check logs in terminal
2. Verify all services running
3. Check browser console (F12)
4. Verify environment variables
5. Restart services if needed

---

**GeoGuard v2.0.0** - Professional Disaster Management Platform

Happy coding! 🚀
