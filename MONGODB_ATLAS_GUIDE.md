# 🔐 MongoDB Atlas Connection Guide

## Get Your Connection String

### Step 1: Login to MongoDB Atlas
- Go to: https://cloud.mongodb.com
- Login with your account

### Step 2: Navigate to Connection
1. Click "Databases" in left sidebar
2. Find your cluster (e.g., "Cluster0")
3. Click "Connect" button

### Step 3: Get Connection String
1. Click "Drivers" tab
2. Select "Node.js" from dropdown
3. Copy the connection string

### Step 4: Format Your Connection String

**Original format from MongoDB:**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**What you need to do:**
1. Replace `<username>` with your database user (e.g., `db_username`)
2. Replace `<password>` with your password (URL encode special characters)
3. Add `/geoguard` before the `?` to specify database name

**Special Characters to URL Encode:**
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `#` → `%23`
- `?` → `%3F`
- `&` → `%26`

**Example:**
If your password is `dharun@456`, it becomes `dharun%40456`

**Final Connection String:**
```
mongodb+srv://db_username:dharun%40456@cluster0.mxw8xkj.mongodb.net/geoguard?retryWrites=true&w=majority
```

### Step 5: Update .env File

Edit: `c:\Users\dharu\OneDrive\Desktop\karpagam\backend\.env`

```env
MONGODB_URI=mongodb+srv://db_username:dharun%40456@cluster0.mxw8xkj.mongodb.net/geoguard?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
WEATHER_API_KEY=your_weather_api_key_here
NODE_ENV=development
```

---

## ✅ Verify Connection

### Check if cluster is active:
1. Go to MongoDB Atlas Dashboard
2. Look for your cluster
3. Status should be GREEN (running)

### Check IP Whitelist:
1. Click "Network Access" in left menu
2. Check if your IP is listed
3. If not, click "Add IP Address"
4. Add your current IP or `0.0.0.0/0` (all IPs)

### Check Database User:
1. Click "Database Access" in left menu
2. Check if your user exists
3. If not, click "Add New Database User"
4. Create user with your credentials

---

## 🚀 Test Connection

After updating .env, run:

```bash
cd c:\Users\dharu\OneDrive\Desktop\karpagam\backend
node verify-db.js
```

Expected output:
```
✓ MongoDB Atlas connected
✓ All collections present
✓ Database verification complete!
```

---

## 🆘 Common Issues

### Issue 1: "URI must include hostname"
**Solution:** Check connection string format
- Should start with: `mongodb+srv://`
- Should have: `@cluster0.xxxxx.mongodb.net`
- Should have: `/geoguard` before `?`

### Issue 2: "Authentication failed"
**Solution:** Check credentials
- Username correct?
- Password correct?
- Special characters URL encoded?

### Issue 3: "Connection timeout"
**Solution:** Check IP whitelist
- Go to Network Access
- Add your IP address
- Or add `0.0.0.0/0` for all IPs

### Issue 4: "Cluster not found"
**Solution:** Check cluster name
- Verify cluster exists in MongoDB Atlas
- Verify cluster is running (green status)
- Verify cluster name in connection string

---

## 📞 Need Help?

If you're still having issues:

1. **Share your connection string** (without password)
2. **Tell me the error message** you're getting
3. **Confirm:**
   - Cluster is running (green status)
   - Your IP is whitelisted
   - Database user exists
   - Password is correct

---

## ✨ Quick Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created and running
- [ ] Database user created
- [ ] IP whitelisted
- [ ] Connection string copied
- [ ] Special characters URL encoded
- [ ] .env file updated
- [ ] `node verify-db.js` passes
- [ ] `node init-db.js` succeeds
- [ ] `npm start` runs backend
- [ ] `npm start` runs frontend
- [ ] http://localhost:3000 opens

---

**Once you have the correct connection string, the project will run perfectly!**
