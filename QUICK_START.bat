@echo off
REM GeoGuard Quick Start Script

echo.
echo ========================================
echo GeoGuard - Flood Risk Prediction System
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo Error: npm is not installed
    pause
    exit /b 1
)

echo npm version:
npm --version
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo Backend dependencies installed successfully
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo Frontend dependencies installed successfully
echo.

REM Check .env file
if not exist "backend\.env" (
    echo.
    echo WARNING: backend\.env file not found
    echo Please create backend\.env with the following variables:
    echo.
    echo MONGODB_URI=mongodb+srv://dharun143:dbpass@cluster0.mxw8xkj.mongodb.net/geoguard?retryWrites=true^&w=majority
    echo PORT=5000
    echo JWT_SECRET=your_jwt_secret_key_here
    echo EMAIL_USER=your_gmail@gmail.com
    echo EMAIL_PASSWORD=your_app_password
    echo.
    pause
)

REM Check frontend .env file
if not exist "frontend\.env" (
    echo.
    echo WARNING: frontend\.env file not found
    echo Please create frontend\.env with:
    echo REACT_APP_API_URL=http://localhost:5000
    echo.
    pause
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the system:
echo.
echo 1. Open Command Prompt in backend folder:
echo    cd backend
echo    npm start
echo.
echo 2. Open another Command Prompt in frontend folder:
echo    cd frontend
echo    npm start
echo.
echo 3. Access the application:
echo    Frontend: http://localhost:3000
echo    Backend: http://localhost:5000
echo.
echo 4. Initialize database (optional):
echo    node backend/init-db-enhanced.js
echo.
echo ========================================
echo.
pause
