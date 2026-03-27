@echo off
REM GeoGuard - Auto Start Script for Windows

echo.
echo ========================================
echo   GeoGuard - Starting All Services
echo ========================================
echo.

REM Check if MongoDB is running
echo [1/4] Checking MongoDB...
tasklist | find /i "mongod.exe" >nul
if errorlevel 1 (
    echo Starting MongoDB...
    start mongod
    timeout /t 3 /nobreak
) else (
    echo MongoDB already running
)

REM Start Backend
echo.
echo [2/4] Starting Backend (Port 5000)...
start cmd /k "cd backend && npm start"
timeout /t 3 /nobreak

REM Start AI Service
echo.
echo [3/4] Starting AI Service (Port 5001)...
start cmd /k "cd ai-service && python predictor.py"
timeout /t 3 /nobreak

REM Start Frontend
echo.
echo [4/4] Starting Frontend (Port 3000)...
start cmd /k "cd frontend && npm start"
timeout /t 3 /nobreak

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo Frontend:   http://localhost:3000
echo Backend:    http://localhost:5000
echo AI Service: http://localhost:5001
echo.
echo Opening browser...
timeout /t 2 /nobreak
start http://localhost:3000

echo.
echo Done! All windows will stay open.
echo Close any window to stop that service.
pause
