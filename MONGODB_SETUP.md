# 🔧 MongoDB Setup - Windows

## Problem
`mongod` command not recognized - MongoDB not installed or not in PATH

---

## Solution 1: Install MongoDB (Recommended)

### Step 1: Download
Go to: https://www.mongodb.com/try/download/community

### Step 2: Choose Version
- Select: **Windows x64**
- Click: **Download**

### Step 3: Run Installer
1. Double-click downloaded file
2. Click **Next** through all steps
3. Check **Install MongoDB as a Service**
4. Click **Install**
5. Click **Finish**

### Step 4: Verify Installation
```bash
mongod --version
```

Should show version number ✅

---

## Solution 2: Add MongoDB to PATH (If Already Installed)

### Step 1: Find MongoDB Installation
Usually at: `C:\Program Files\MongoDB\Server\7.0\bin`

### Step 2: Add to PATH
1. Press `Win + X` → **System**
2. Click **Advanced system settings**
3. Click **Environment Variables**
4. Under **System variables**, click **Path** → **Edit**
5. Click **New**
6. Paste: `C:\Program Files\MongoDB\Server\7.0\bin`
7. Click **OK** → **OK** → **OK**

### Step 3: Restart PowerShell
Close and reopen PowerShell

### Step 4: Verify
```bash
mongod --version
```

---

## Solution 3: Use MongoDB Atlas (Cloud - No Installation)

### Step 1: Create Account
Go to: https://www.mongodb.com/cloud/atlas

### Step 2: Create Cluster
1. Sign up
2. Create free cluster
3. Get connection string

### Step 3: Update Backend .env
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/geoguard
```

### Step 4: Run Backend
```bash
cd backend
npm start
```

---

## Solution 4: Use Docker (If Installed)

### Run MongoDB in Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### Verify
```bash
docker ps
```

---

## Quick Fix: Skip MongoDB Locally

### Use MongoDB Atlas Instead

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/geoguard
```

6. Run backend:
```bash
cd backend
npm start
```

---

## Recommended: Install MongoDB Properly

### Windows Installation Steps

1. **Download**
   - https://www.mongodb.com/try/download/community
   - Select Windows x64
   - Click Download

2. **Install**
   - Run installer
   - Accept license
   - Choose Setup Type: **Complete**
   - Service Configuration: **Install MongoDB as a Service**
   - Click Install

3. **Verify**
   ```bash
   mongod --version
   ```

4. **Start Service**
   ```bash
   net start MongoDB
   ```

5. **Test Connection**
   ```bash
   mongo
   > show dbs
   > exit()
   ```

---

## If Still Not Working

### Check Installation Path
```bash
# Find MongoDB
where mongod

# If not found, it's not installed
```

### Reinstall MongoDB
1. Uninstall MongoDB from Control Panel
2. Delete `C:\Program Files\MongoDB`
3. Download fresh from https://www.mongodb.com/try/download/community
4. Install again
5. Restart computer
6. Test: `mongod --version`

---

## Now Run Project

### After MongoDB is Working

**Terminal 1:**
```bash
mongod
```

**Terminal 2:**
```bash
cd backend
npm install
npm start
```

**Terminal 3:**
```bash
cd ai-service
pip install -r requirements.txt
python predictor.py
```

**Terminal 4:**
```bash
cd frontend
npm install
npm start
```

---

## ✅ Verification

```bash
# Check MongoDB
mongod --version

# Check Node
node --version

# Check Python
python --version

# Check npm
npm --version
```

All should show version numbers ✅

---

## 🎯 Next Steps

1. Install MongoDB using one of the solutions above
2. Verify: `mongod --version`
3. Run the project
4. Open http://localhost:3000

---

**MongoDB Setup Complete!** ✅
