@echo off
TITLE Healix AI - Dual Boot System
COLOR 0A

echo ==========================================
echo    HEALIX AI - SELF-HEALING SYSTEM
echo ==========================================
echo.

:: Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install it first.
    pause
    exit
)

:: Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Please install it first.
    pause
    exit
)

echo [1/3] Starting Backend Server (Port 8003)...
start "Healix Backend" cmd /c "cd /d %~dp0backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload"

echo [2/3] Starting Frontend Web (Port 5173)...
start "Healix Frontend" cmd /c "cd /d %~dp0frontend\web && npm run dev"

echo [3/3] System Logic: 
echo - Automatic IP detection enabled.
echo - Dynamic Backend Discovery active.
echo - Connection Retry Protocol active (2 attempts).
echo.
echo ==========================================
echo Healix is running! 
echo Access locally: http://localhost:5173
echo Access from Network: http://[YOUR-IP]:5173
echo ==========================================
echo.
pause
