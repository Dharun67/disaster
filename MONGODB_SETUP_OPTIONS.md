# 🔧 Local MongoDB Setup (Alternative)

If MongoDB Atlas is not working, use Local MongoDB instead.

## Option 1: Use Local MongoDB (Easiest)

### Step 1: Update .env file

Replace the MongoDB URI in `backend/.env` with:

```env
MONGODB_URI=mongodb://localhost:27017/geoguard
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
WEATHER_API_KEY=your_weather_api_key_here
NODE_ENV=development
```

### Step 2: Install MongoDB Community Edition

**For Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Install MongoDB as a Service"
4. Complete installation

**Or use Chocolatey:**
```bash
choco install mongodb-community
```

### Step 3: Start MongoDB Service

**Windows:**
```bash
# MongoDB should start automatically as a service
# Or manually start it:
net start MongoDB
```

### Step 4: Verify MongoDB is Running

```bash
# Open new terminal and run:
mongosh
```

You should see:
```
test>
```

If yes, MongoDB is running! Type `exit` to quit.

### Step 5: Initialize Database

```bash
cd backend
node init-db.js
```

---

## Option 2: Use MongoDB Atlas (Cloud)

If you want to use MongoDB Atlas, you need valid credentials:

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a cluster
4. Create a database user
5. Get connection string

### Step 2: Update .env with correct credentials

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/geoguard?retryWrites=true&w=majority
```

**Important:** 
- Replace `username` with your MongoDB user
- Replace `password` with your MongoDB password (URL encode special characters)
- Replace `cluster0.xxxxx` with your cluster name

### Step 3: Whitelist Your IP

1. Go to MongoDB Atlas Dashboard
2. Network Access → IP Whitelist
3. Add your IP address (or 0.0.0.0/0 for all)

### Step 4: Initialize Database

```bash
cd backend
node init-db.js
```

---

## 🚀 Quick Fix: Use Local MongoDB

### Run these commands:

```bash
# 1. Update .env file
# Edit: c:\Users\dharu\OneDrive\Desktop\karpagam\backend\.env
# Change MONGODB_URI to: mongodb://localhost:27017/geoguard

# 2. Start MongoDB (if installed)
net start MongoDB

# 3. Initialize database
cd c:\Users\dharu\OneDrive\Desktop\karpagam\backend
node init-db.js

# 4. Start backend
npm start
```

---

## ✅ Verification

After initialization, you should see:

```
✓ MongoDB connected
✓ Cleared existing data
✓ Created 5 zones
✓ Created flood predictions
✓ Created 5 shelters
✓ Created 4 rescue teams
✓ Created 4 police stations
✓ Created 4 ambulance services
✓ Created 4 hospitals
✓ Created sample SOS alerts
✓ Created sample user reports
✓ Created sample disaster alerts

✅ Database initialization complete!
```

---

## 🆘 Troubleshooting

### MongoDB not starting?

```bash
# Check if MongoDB is installed
mongosh --version

# If not installed, install it:
# Windows: Download from https://www.mongodb.com/try/download/community
# Or: choco install mongodb-community
```

### Still getting connection error?

```bash
# Verify MongoDB is running
netstat -ano | findstr :27017

# If nothing shows, MongoDB is not running
# Start it: net start MongoDB
```

### Connection string issues?

Make sure `.env` file has:
```
MONGODB_URI=mongodb://localhost:27017/geoguard
```

No special characters, no @ symbols in the URI.

---

## 📝 Next Steps

1. Choose Option 1 (Local) or Option 2 (Atlas)
2. Update `.env` file
3. Run `node init-db.js`
4. Run `npm start` for backend
5. Run `npm start` for frontend
6. Open http://localhost:3000

---

**Which option do you prefer?**
- **Option 1: Local MongoDB** (Easiest, no account needed)
- **Option 2: MongoDB Atlas** (Cloud, requires account)
