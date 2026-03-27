@echo off
REM GeoGuard Quick Start Script for Windows

echo.
echo ========================================
echo   GeoGuard - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] Checking Node.js installation...
node --version
echo.

REM Initialize database
echo [2/5] Initializing database...
cd backend
call npm install >nul 2>&1
node init-db.js
if errorlevel 1 (
    echo ERROR: Database initialization failed
    pause
    exit /b 1
)
echo.

REM Start backend in new window
echo [3/5] Starting backend server...
start "GeoGuard Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak
echo.

REM Install frontend dependencies
echo [4/5] Installing frontend dependencies...
cd ..\frontend
call npm install >nul 2>&1
echo.

REM Start frontend in new window
echo [5/5] Starting frontend application...
start "GeoGuard Frontend" cmd /k "npm start"
timeout /t 3 /nobreak
echo.

echo ========================================
echo   GeoGuard is starting...
echo ========================================
echo.
echo Frontend will open at: http://localhost:3000
echo Backend running at: http://localhost:5000
echo.
echo Press any key to continue...
pause

REM Open browser
start http://localhost:3000

echo.
echo ========================================
echo   Application Started Successfully!
echo ========================================
echo.
echo Available Pages:
echo   - Landing Page: http://localhost:3000/
echo   - Live Dashboard: http://localhost:3000/dashboard
echo   - Emergency SOS: http://localhost:3000/sos
echo   - Shelter Locator: http://localhost:3000/shelters
echo   - Admin Dashboard: http://localhost:3000/admin
echo   - Command Center: http://localhost:3000/command-center-pro
echo   - Emergency Contacts: http://localhost:3000/emergency-contacts
echo.
echo API Health Check: http://localhost:5000/api/health
echo Database Status: http://localhost:5000/api/db-status
echo.
echo To stop the application, close both command windows.
echo.
pause
