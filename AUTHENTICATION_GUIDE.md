# Enhanced Authentication System - Complete Guide

## 🎯 Overview

Your GeoGuard project now has a professional authentication system with:
- ✅ OTP-based login (no password needed for login)
- ✅ Email verification
- ✅ Persistent sessions (30 days)
- ✅ Remember me functionality
- ✅ Session expiry warnings
- ✅ Auto-logout on expiry
- ✅ Session extension capability

---

## 🔐 Authentication Features

### 1. OTP-Based Login
- Users receive a 6-digit OTP via email
- OTP valid for 10 minutes
- Can resend OTP if expired
- No password required for login

### 2. User Registration
- Email verification via OTP
- Full name and phone number required
- Password set during registration
- Automatic login after registration

### 3. Persistent Sessions
- Sessions valid for 30 days
- Token stored with expiry timestamp
- Automatic session validation
- Session extension on user activity

### 4. Remember Me
- Option to remember email address
- Pre-fills email on next login
- Checkbox on login page

### 5. Session Management
- Session time display in navbar
- Warning when 5 minutes remaining
- Option to extend session
- Auto-logout on expiry

---

## 📁 Files Created

### Authentication Service
**`frontend/src/services/authService.js`**
- Token management
- User data storage
- Session tracking
- OTP verification
- Remember me functionality

### Enhanced Login Page
**`frontend/src/pages/EnhancedLoginPage.js`**
- Professional UI with Tailwind CSS
- OTP input with timer
- Registration form
- Remember me checkbox
- Error/success messages
- Responsive design

### Session Manager
**`frontend/src/components/SessionManager.js`**
- Session validation
- Expiry warnings
- Auto-logout
- Session extension

### Protected Route
**`frontend/src/components/ProtectedRoute.js`**
- Route protection
- Authentication check
- Redirect to login if not authenticated

### Updated Files
- `frontend/src/App.js` - New routing with SessionManager
- `frontend/src/Navigation.js` - Logout button and session display

---

## 🚀 How It Works

### Login Flow
```
1. User enters email
   ↓
2. OTP sent to email
   ↓
3. User enters OTP
   ↓
4. Token generated and stored
   ↓
5. User redirected to dashboard
   ↓
6. Session valid for 30 days
```

### Registration Flow
```
1. User enters email
   ↓
2. OTP sent to email
   ↓
3. User fills registration form
   ↓
4. User enters OTP
   ↓
5. Account created
   ↓
6. User automatically logged in
   ↓
7. Session valid for 30 days
```

### Session Management Flow
```
Every minute:
├─ Check if session is valid
├─ Calculate time remaining
├─ Show warning if 5 minutes left
└─ Auto-logout if expired

User can:
├─ Extend session (adds 30 days)
├─ Logout manually
└─ Session auto-extends on activity
```

---

## 💾 Local Storage Structure

### Token Storage
```javascript
localStorage.authToken = "jwt_token_here"
localStorage.tokenExpiry = "1699999999999" // Timestamp
```

### User Data
```javascript
localStorage.user = {
  id: "user_id",
  email: "user@email.com",
  name: "User Name",
  phone: "+91 98765 43210",
  role: "user"
}
```

### Session Data
```javascript
localStorage.lastLogin = "2024-11-03T10:30:00Z"
localStorage.rememberMe = "user@email.com"
```

---

## 🔧 API Endpoints Used

### Request OTP
```
POST /api/auth/login
Body: { email: "user@email.com" }
Response: { success: true, message: "OTP sent", expiresIn: 600 }
```

### Verify OTP (Login)
```
POST /api/auth/verify-login
Body: { email: "user@email.com", otp: "123456" }
Response: { 
  success: true, 
  token: "jwt_token",
  user: { id, email, name, phone, role }
}
```

### Register
```
POST /api/auth/register
Body: { email: "user@email.com", name: "Name", phone: "+91..." }
Response: { success: true, message: "OTP sent", expiresIn: 600 }
```

### Verify Registration
```
POST /api/auth/verify-otp
Body: { 
  email: "user@email.com", 
  otp: "123456",
  name: "Name",
  phone: "+91...",
  password: "password"
}
Response: { 
  success: true, 
  token: "jwt_token",
  user: { id, email, name, phone, role }
}
```

---

## 🎨 UI Components

### Login Page
- Email input with validation
- OTP input (6 digits)
- Timer showing OTP expiry
- Resend OTP button
- Toggle between login/register
- Remember me checkbox
- Error/success messages
- Professional gradient design

### Session Warning Modal
- Shows when 5 minutes remaining
- Option to extend session
- Option to logout
- Displays time remaining

### Navbar Updates
- User name display
- Session time remaining
- Logout button with icon
- Responsive design

---

## 🔒 Security Features

### Token Security
- JWT tokens with expiry
- Tokens stored in localStorage
- Automatic validation on each request
- Tokens cleared on logout

### OTP Security
- 6-digit OTP
- 10-minute expiry
- 3 attempt limit
- Resend functionality

### Session Security
- 30-day session expiry
- Automatic logout on expiry
- Session warning before expiry
- Manual logout option

### Data Protection
- User data stored securely
- Passwords hashed on backend
- HTTPS recommended for production
- CORS enabled

---

## 📱 Usage Guide

### For Users

#### First Time Login
1. Go to `/enhanced-login`
2. Enter your email
3. Click "Send OTP"
4. Check your email for OTP
5. Enter OTP on the page
6. Click "Verify OTP"
7. You're logged in!

#### Subsequent Logins
1. Go to `/enhanced-login`
2. Your email is pre-filled (if you checked "Remember me")
3. Click "Send OTP"
4. Enter OTP from email
5. Click "Verify OTP"
6. You're logged in!

#### Registration
1. Go to `/enhanced-login`
2. Click "Create Account"
3. Enter your email
4. Click "Send OTP"
5. Check your email for OTP
6. Fill in your details (name, phone, password)
7. Enter OTP
8. Click "Create Account"
9. You're registered and logged in!

#### Extending Session
1. When you see "Session Expiring Soon" modal
2. Click "Continue Session"
3. Your session is extended for 30 more days

#### Logout
1. Click "Logout" button in navbar
2. You'll be redirected to login page
3. Your session is cleared

---

## 🛠️ Developer Guide

### Using authService

```javascript
import authService from '../services/authService';

// Check if authenticated
if (authService.isAuthenticated()) {
  // User is logged in
}

// Get current user
const user = authService.getUser();
console.log(user.name);

// Get token
const token = authService.getToken();

// Get session time remaining (in minutes)
const timeLeft = authService.getSessionTimeRemaining();

// Extend session
authService.refreshSession();

// Logout
authService.logout();

// Request OTP
await authService.requestOTP('user@email.com');

// Verify OTP
await authService.verifyOTP('user@email.com', '123456');

// Register
await authService.register('user@email.com', 'Name', '+91...', 'password');

// Verify registration
await authService.verifyRegistration('user@email.com', '123456', 'Name', '+91...', 'password');
```

### Using ProtectedRoute

```javascript
import ProtectedRoute from './components/ProtectedRoute';

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Using SessionManager

```javascript
import SessionManager from './components/SessionManager';

<Router>
  <SessionManager>
    <Routes>
      {/* Your routes */}
    </Routes>
  </SessionManager>
</Router>
```

---

## ⚙️ Configuration

### Session Duration
Edit `authService.js`:
```javascript
// Change from 30 to desired days
authService.setToken(token, 30); // 30 days
```

### OTP Expiry
Backend configuration (server.js):
```javascript
const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
```

### Warning Time
Edit `SessionManager.js`:
```javascript
// Show warning when 5 minutes left
if (timeRemaining === 5) {
  setSessionWarning(true);
}
```

---

## 🧪 Testing

### Test Login
1. Start backend: `npm start` (in backend folder)
2. Start frontend: `npm start` (in frontend folder)
3. Go to `http://localhost:3000/enhanced-login`
4. Enter test email
5. Check backend console for OTP (or email if configured)
6. Enter OTP
7. Should redirect to dashboard

### Test Registration
1. Go to `/enhanced-login`
2. Click "Create Account"
3. Enter email
4. Click "Send OTP"
5. Fill in all fields
6. Enter OTP
7. Click "Create Account"
8. Should redirect to dashboard

### Test Session Expiry
1. Login successfully
2. Wait for session to expire (or modify timer in SessionManager)
3. Should see warning modal
4. Can extend or logout

### Test Remember Me
1. Login with "Remember me" checked
2. Logout
3. Go back to login page
4. Email should be pre-filled

---

## 🐛 Troubleshooting

### OTP Not Received
- Check email spam folder
- Verify email address is correct
- Check backend is running
- Check email service is configured

### Session Not Persisting
- Check localStorage is enabled
- Check token expiry is set correctly
- Check SessionManager is wrapping app
- Check ProtectedRoute is used

### Can't Login
- Check backend is running on port 5000
- Check API endpoints are correct
- Check CORS is enabled
- Check email is valid

### Session Warning Not Showing
- Check SessionManager is in App.js
- Check warning time is set correctly
- Check browser console for errors

---

## 📊 Session Information

### Default Settings
- Session Duration: 30 days
- OTP Validity: 10 minutes
- Warning Time: 5 minutes before expiry
- OTP Attempts: 3 maximum

### Session States
- **Active**: User is logged in and session is valid
- **Warning**: 5 minutes remaining, user can extend
- **Expired**: Session has expired, user must login again
- **Logged Out**: User manually logged out

---

## 🔄 Workflow Summary

```
User visits app
    ↓
SessionManager checks authentication
    ↓
If not authenticated → Redirect to /enhanced-login
    ↓
User enters email → OTP sent
    ↓
User enters OTP → Token generated
    ↓
Token stored with 30-day expiry
    ↓
User redirected to dashboard
    ↓
SessionManager monitors session
    ↓
If 5 minutes left → Show warning
    ↓
User can extend or logout
    ↓
If expired → Auto logout
```

---

## ✅ Checklist

- [x] OTP-based authentication
- [x] Email verification
- [x] Persistent sessions (30 days)
- [x] Remember me functionality
- [x] Session expiry warnings
- [x] Auto-logout
- [x] Session extension
- [x] Professional UI
- [x] Error handling
- [x] Security features
- [x] Complete documentation

---

## 🎉 You're All Set!

Your authentication system is now:
- ✅ Secure with OTP verification
- ✅ User-friendly with persistent login
- ✅ Professional with modern UI
- ✅ Scalable and maintainable
- ✅ Production-ready

**Start using it at `/enhanced-login`!**
