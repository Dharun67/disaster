@echo off
color 0A
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║           🚀 GeoGuard Platform - Auto Startup                ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Starting all services...
echo.

echo [1/3] Starting Backend Server...
cd backend
start "GeoGuard Backend" cmd /k "color 0B && echo Backend Server && npm install && node server.js"
timeout /t 3 /nobreak >nul

echo [2/3] Starting AI Service...
cd ..\ai-service
start "GeoGuard AI Service" cmd /k "color 0E && echo AI Service && pip install flask pymongo numpy && python predictor.py"
timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend...
cd ..\frontend
start "GeoGuard Frontend" cmd /k "color 0D && echo Frontend && npm install && npm start"

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   ✅ All Services Starting                    ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║  Frontend:   http://localhost:3000                           ║
echo ║  Backend:    http://localhost:5000                           ║
echo ║  AI Service: http://localhost:5001                           ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║  Note: Keep all 3 windows open while using the app           ║
echo ║  Browser will open automatically in 10-15 seconds            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Press any key to close this window (services will keep running)
pause >nul
