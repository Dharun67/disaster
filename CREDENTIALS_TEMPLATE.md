# 🔐 MongoDB Atlas Credentials Template

## Instructions:

1. Go to: https://cloud.mongodb.com
2. Login to your account
3. Click "Databases" → Your Cluster → "Connect"
4. Click "Drivers" → Select "Node.js"
5. Copy the connection string
6. Replace the values below with YOUR actual credentials

## Your Connection String Format:

```
mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.mxw8xkj.mongodb.net/geoguard?retryWrites=true&w=majority
```

## Replace These:

- `YOUR_USERNAME` = Your MongoDB Atlas database user (NOT email)
- `YOUR_PASSWORD` = Your MongoDB Atlas database password
- `cluster0.mxw8xkj.mongodb.net` = Your cluster name (from connection string)

## Example:

If MongoDB gives you:
```
mongodb+srv://admin:mypass123@cluster0.mxw8xkj.mongodb.net/?retryWrites=true&w=majority
```

Your .env should be:
```
MONGODB_URI=mongodb+srv://admin:mypass123@cluster0.mxw8xkj.mongodb.net/geoguard?retryWrites=true&w=majority
```

## Special Characters:

If your password has special characters, URL encode them:
- @ becomes %40
- : becomes %3A
- / becomes %2F
- # becomes %23
- ? becomes %3F
- & becomes %26

Example:
- Password: pass@word
- Encoded: pass%40word

## Final .env File:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.mxw8xkj.mongodb.net/geoguard?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
WEATHER_API_KEY=your_weather_api_key_here
NODE_ENV=development
```

---

## ✅ Verification Checklist:

- [ ] Connection string starts with `mongodb+srv://`
- [ ] Has your actual username (not placeholder)
- [ ] Has your actual password (URL encoded if needed)
- [ ] Has `/geoguard` before the `?`
- [ ] Has `?retryWrites=true&w=majority` at the end
- [ ] Cluster name matches your MongoDB Atlas cluster

---

## 🚀 After Updating .env:

```bash
cd c:\Users\dharu\OneDrive\Desktop\karpagam\backend
node verify-db.js
```

Should show:
```
✓ Connected to MongoDB Atlas
✓ Database ping successful
✓ All required collections present!
```

Then:
```bash
node init-db.js
```

Should show:
```
✅ Database initialization complete!
```
