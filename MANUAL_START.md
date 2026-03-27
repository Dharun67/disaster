# 🎯 MANUAL START COMMANDS

## Open 3 Command Prompts (cmd)

### Command Prompt 1 - Backend
```
cd c:\Users\dharu\OneDrive\Desktop\karpagam\backend
npm install
node server.js
```
✅ Wait for: "GeoGuard Backend Server Running on http://localhost:5000"

---

### Command Prompt 2 - AI Service
```
cd c:\Users\dharu\OneDrive\Desktop\karpagam\ai-service
pip install flask pymongo numpy
python predictor.py
```
✅ Wait for: "Running on http://127.0.0.1:5001"

---

### Command Prompt 3 - Frontend
```
cd c:\Users\dharu\OneDrive\Desktop\karpagam\frontend
npm install
npm start
```
✅ Browser will open automatically at http://localhost:3000

---

## ✅ Verification

After all 3 services are running, open a 4th command prompt:

```
cd c:\Users\dharu\OneDrive\Desktop\karpagam
node test-services.js
```

This will verify all services are working correctly.

---

## 🌐 Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/health
- **AI Service:** http://localhost:5001/api/health

---

## 🛑 To Stop Services

Press `Ctrl + C` in each command prompt window.

---

## 📝 Notes

- Keep all 3 command prompts open while using the application
- MongoDB Atlas (cloud) is already configured - no local MongoDB needed
- First time `npm install` may take 2-3 minutes
- Frontend will automatically open in your default browser
