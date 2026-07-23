@echo off
echo Starting Healix AI Full Stack Application...

set "ROOT=%~dp0"
cd /d "%ROOT%"

:: Start Backend
echo Launching Backend...
start cmd /k "cd /d \"%ROOT%backend\" && ..\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8003 --reload --host 0.0.0.0"

:: Start Frontend
echo Launching Frontend...
start cmd /k "cd /d \"%ROOT%frontend\web\" && npm run dev"

echo Application is starting! 
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8003
pause
