# 🔐 UPDATE YOUR MONGODB ATLAS CONNECTION

## 📝 STEP-BY-STEP GUIDE

### Step 1: Get Your Connection String from MongoDB Atlas

1. Go to: https://www.mongodb.com/cloud/atlas
2. Login to your account
3. Click on your cluster name
4. Click the "Connect" button
5. Select "Drivers" option
6. Select "Node.js" driver
7. Copy the connection string (it looks like):
   ```
   mongodb+srv://username:password@cluster0.abc123.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
   ```

---

### Step 2: Update backend/.env File

**File Location:** `c:\Users\dharu\OneDrive\Desktop\karpagam\backend\.env`

**Find this line:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/geoguard?retryWrites=true&w=majority
```

**Replace with your actual connection string:**

Example (replace with YOUR credentials):
```
MONGODB_URI=mongodb+srv://john_doe:myPassword123@cluster0.abc123.mongodb.net/geoguard?retryWrites=true&w=majority
```

**Important:**
- Replace `username` with your MongoDB Atlas username
- Replace `password` with your MongoDB Atlas password
- Keep `/geoguard` at the end (database name)
- Keep `?retryWrites=true&w=majority` at the end

---

### Step 3: Save the File

1. Open `backend/.env` in a text editor
2. Update the MONGODB_URI line
3. Save the file (Ctrl+S)

---

## ✅ VERIFY CONNECTION STRING

Your connection string should look like:
```
mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/geoguard?retryWrites=true&w=majority
```

**Example:**
```
mongodb+srv://admin:password123@cluster0.mongodb.net/geoguard?retryWrites=true&w=majority
```

---

## 🚀 THEN RUN THE PROJECT

Once you've updated the connection string:

**Terminal 1 (Backend):**
```bash
cd c:\Users\dharu\OneDrive\Desktop\karpagam\backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd c:\Users\dharu\OneDrive\Desktop\karpagam\frontend
npm start
```

**Browser:**
```
http://localhost:3000
```

---

## ⚠️ COMMON MISTAKES

### ❌ WRONG:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/geoguard
```
(Missing `?retryWrites=true&w=majority`)

### ✅ CORRECT:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/geoguard?retryWrites=true&w=majority
```

---

### ❌ WRONG:
```
MONGODB_URI=mongodb+srv://john:pass@word@cluster.mongodb.net/geoguard?retryWrites=true&w=majority
```
(Password with @ symbol not URL encoded)

### ✅ CORRECT:
```
MONGODB_URI=mongodb+srv://john:pass%40word@cluster.mongodb.net/geoguard?retryWrites=true&w=majority
```
(@ symbol encoded as %40)

---

## 🔍 IF CONNECTION FAILS

### Error: "MongoDB connection error"

**Check 1: Connection String**
- Make sure you copied the entire string correctly
- Check for typos in username/password

**Check 2: IP Whitelist**
- Go to MongoDB Atlas
- Click "Network Access"
- Make sure your IP is whitelisted
- Or add `0.0.0.0/0` to allow all IPs (for development only)

**Check 3: Database Name**
- Make sure `/geoguard` is in the connection string
- This is the database name

**Check 4: Credentials**
- Make sure username and password are correct
- Check if password has special characters (URL encode them)

---

## 📋 CHECKLIST

- [ ] Got connection string from MongoDB Atlas
- [ ] Updated `backend/.env` with connection string
- [ ] Saved the file
- [ ] Connection string has `/geoguard` at the end
- [ ] Connection string has `?retryWrites=true&w=majority` at the end
- [ ] Ready to run backend

---

## 🎯 NEXT STEPS

1. Update `backend/.env` with your MongoDB Atlas connection string
2. Run backend: `npm start`
3. Run frontend: `npm start`
4. Open: http://localhost:3000
5. Register and test!

---

**Once you update the connection string, your project will be ready to run! 🚀**

