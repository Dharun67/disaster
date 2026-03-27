# 🚀 GeoGuard - Production Deployment Guide

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] SSL/HTTPS configured
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Monitoring setup
- [ ] Error logging configured
- [ ] Performance optimized
- [ ] Documentation updated

---

## 🌐 Backend Deployment

### Option 1: Heroku (Recommended for Beginners)

#### Step 1: Install Heroku CLI
```bash
# Windows
choco install heroku-cli

# macOS
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

#### Step 2: Login to Heroku
```bash
heroku login
```

#### Step 3: Create Heroku App
```bash
cd backend
heroku create geoguard-backend
```

#### Step 4: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_strong_secret_key
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set FRONTEND_URL=https://your-frontend-domain.com
```

#### Step 5: Deploy
```bash
git push heroku main
```

#### Step 6: Verify
```bash
heroku logs --tail
heroku open
```

---

### Option 2: AWS EC2

#### Step 1: Launch EC2 Instance
- AMI: Ubuntu 20.04 LTS
- Instance Type: t3.micro (free tier)
- Security Group: Allow ports 22, 80, 443, 5000

#### Step 2: Connect and Setup
```bash
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
sudo apt install -y mongodb

# Install PM2
sudo npm install -g pm2
```

#### Step 3: Deploy Application
```bash
git clone https://github.com/yourusername/geoguard.git
cd geoguard/backend
npm install
pm2 start server.js --name "geoguard-backend"
pm2 startup
pm2 save
```

#### Step 4: Setup Nginx Reverse Proxy
```bash
sudo apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/geoguard

# Add:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/geoguard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: Setup SSL with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Option 3: DigitalOcean App Platform

#### Step 1: Connect GitHub
- Go to DigitalOcean App Platform
- Connect your GitHub repository

#### Step 2: Configure App
```yaml
name: geoguard-backend
services:
- name: backend
  github:
    repo: yourusername/geoguard
    branch: main
  build_command: cd backend && npm install
  run_command: cd backend && npm start
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGODB_URI
    value: ${db.connection_string}
  http_port: 5000
databases:
- name: db
  engine: MONGODB
  version: "4.4"
```

#### Step 3: Deploy
- Click "Create App"
- DigitalOcean handles deployment automatically

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy
```bash
cd frontend
vercel
```

#### Step 3: Configure Environment
```bash
vercel env add REACT_APP_API_URL
# Enter: https://your-backend-domain.com
```

#### Step 4: Redeploy
```bash
vercel --prod
```

---

### Option 2: Netlify

#### Step 1: Connect GitHub
- Go to Netlify
- Click "New site from Git"
- Select your repository

#### Step 2: Configure Build
```
Build command: npm run build
Publish directory: build
```

#### Step 3: Set Environment Variables
- Go to Site settings → Build & deploy → Environment
- Add: `REACT_APP_API_URL=https://your-backend-domain.com`

#### Step 4: Deploy
- Netlify automatically deploys on push to main

---

### Option 3: AWS S3 + CloudFront

#### Step 1: Build Frontend
```bash
cd frontend
npm run build
```

#### Step 2: Create S3 Bucket
```bash
aws s3 mb s3://geoguard-frontend
```

#### Step 3: Upload Build
```bash
aws s3 sync build/ s3://geoguard-frontend --delete
```

#### Step 4: Create CloudFront Distribution
- Origin: S3 bucket
- Default root object: index.html
- Enable HTTPS

---

## 🗄️ Database Deployment

### MongoDB Atlas (Recommended)

#### Step 1: Create Account
- Go to https://www.mongodb.com/cloud/atlas
- Sign up for free account

#### Step 2: Create Cluster
- Click "Create a Cluster"
- Select M0 (free tier)
- Choose region closest to your users
- Click "Create Cluster"

#### Step 3: Configure Security
- Go to "Network Access"
- Add IP address (or 0.0.0.0/0 for development)
- Go to "Database Access"
- Create database user with strong password

#### Step 4: Get Connection String
- Click "Connect"
- Select "Connect your application"
- Copy connection string
- Replace `<password>` with your password

#### Step 5: Update Backend
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/geoguard
```

---

## 🔐 Security Configuration

### Production Environment Variables

```env
# Backend
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/geoguard
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=generate_strong_random_string_here
JWT_EXPIRY=30d

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### SSL/HTTPS Setup

```bash
# Using Let's Encrypt (free)
sudo certbot certonly --standalone -d your-domain.com

# Update backend to use SSL
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/your-domain.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/your-domain.com/fullchain.pem')
};

https.createServer(options, app).listen(443);
```

---

## 📊 Monitoring & Logging

### Setup Error Tracking

#### Sentry Integration
```bash
npm install @sentry/node
```

```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.errorHandler());
```

### Setup Performance Monitoring

#### New Relic
```bash
npm install newrelic
```

```javascript
require('newrelic');
// Add at the very top of server.js
```

### Setup Logging

#### Winston Logger
```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: |
          cd backend
          npm install
      
      - name: Run tests
        run: |
          cd backend
          npm test
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "geoguard-backend"
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
          appdir: "backend"
```

---

## 📈 Performance Optimization

### Database Optimization
```javascript
// Add indexes
db.floodpredictions.createIndex({ zone: 1 });
db.floodpredictions.createIndex({ timestamp: -1 });
db.shelters.createIndex({ location: "2dsphere" });
```

### API Caching
```bash
npm install redis
```

### CDN Setup
- Use CloudFlare for DNS and caching
- Configure cache rules for static assets
- Set TTL for API responses

---

## 🧪 Post-Deployment Testing

### Health Checks
```bash
curl https://your-backend-domain.com/api/health
```

### Load Testing
```bash
npm install -g artillery

artillery quick --count 100 --num 1000 https://your-backend-domain.com/api/health
```

### Security Scanning
```bash
npm audit
npm audit fix
```

---

## 📞 Troubleshooting

### Deployment Issues

**Issue:** Build fails on Heroku
```bash
# Check logs
heroku logs --tail

# Rebuild
heroku rebuild
```

**Issue:** Database connection timeout
```bash
# Check MongoDB Atlas IP whitelist
# Add your server IP to Network Access
```

**Issue:** CORS errors in production
```env
FRONTEND_URL=https://your-exact-frontend-domain.com
```

---

## ✅ Deployment Checklist

- [ ] All environment variables set
- [ ] Database backups configured
- [ ] SSL/HTTPS enabled
- [ ] Monitoring setup
- [ ] Error logging configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers enabled
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] Team notified
- [ ] Rollback plan ready

---

## 🎉 Deployment Complete!

Your GeoGuard system is now live in production!

**Access Points:**
- Frontend: https://your-frontend-domain.com
- Backend: https://your-backend-domain.com
- API Health: https://your-backend-domain.com/api/health

---

**GeoGuard v2.0.0** - Production Ready
