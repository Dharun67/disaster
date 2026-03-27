# ⚡ MongoDB Not Found - Quick Fix

## Your Error
```
mongod: The term 'mongod' is not recognized
```

---

## 🔧 Fix (Choose One)

### Option 1: Install MongoDB (5 minutes)
1. Download: https://www.mongodb.com/try/download/community
2. Run installer
3. Check "Install MongoDB as a Service"
4. Restart computer
5. Test: `mongod --version`

### Option 2: Use MongoDB Atlas (Cloud - No Installation)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/geoguard
```
6. Run: `cd backend && npm start`

### Option 3: Use Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

---

## ✅ Verify Installation

```bash
mongod --version
```

Should show version number

---

## 🚀 Then Run Project

**Terminal 1:**
```bash
mongod
```

**Terminal 2:**
```bash
cd backend && npm install && npm start
```

**Terminal 3:**
```bash
cd ai-service && pip install -r requirements.txt && python predictor.py
```

**Terminal 4:**
```bash
cd frontend && npm install && npm start
```

---

## 📖 Detailed Guide

Read: **MONGODB_SETUP.md**

---

**Choose an option above and continue!** ✅
