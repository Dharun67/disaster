@echo off
REM MongoDB Quick Setup for Windows

echo.
echo ========================================
echo   MongoDB Setup Helper
echo ========================================
echo.

REM Check if mongod is installed
mongod --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] MongoDB not found!
    echo.
    echo Solutions:
    echo 1. Download: https://www.mongodb.com/try/download/community
    echo 2. Run installer and select "Install MongoDB as a Service"
    echo 3. Restart computer
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
) else (
    echo [OK] MongoDB found!
    mongod --version
    echo.
)

REM Try to start MongoDB service
echo Starting MongoDB service...
net start MongoDB >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Could not start MongoDB service
    echo.
    echo Try running mongod manually:
    echo   mongod
    echo.
) else (
    echo [OK] MongoDB service started
    echo.
)

REM Check if mongod is running
tasklist | find /i "mongod.exe" >nul
if errorlevel 1 (
    echo [INFO] MongoDB not running
    echo.
    echo Start MongoDB with:
    echo   mongod
    echo.
) else (
    echo [OK] MongoDB is running!
    echo.
)

echo ========================================
echo   MongoDB Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Open Terminal 1: mongod
echo 2. Open Terminal 2: cd backend ^&^& npm start
echo 3. Open Terminal 3: cd ai-service ^&^& python predictor.py
echo 4. Open Terminal 4: cd frontend ^&^& npm start
echo.
pause
