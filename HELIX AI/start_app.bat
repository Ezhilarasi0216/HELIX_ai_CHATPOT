@echo off
SETLOCAL EnableDelayedExpansion

echo ==========================================
echo    Healix AI - Universal Startup Script
echo ==========================================

:: 1. Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    pause
    exit /b 1
)

:: 2. Setup Virtual Environment
if exist ".venv" (
    :: Validate existing venv (can break if base Python was uninstalled/moved)
    .venv\Scripts\python.exe --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo [WARN] Existing virtual environment appears broken.
        echo [WARN] This can happen if the Python version used to create it was removed.
        choice /M "Recreate .venv now"
        if errorlevel 2 (
            echo [ERROR] Cannot continue with a broken .venv. Please delete ".venv" and re-run this script.
            pause
            exit /b 1
        )
        echo [INFO] Recreating virtual environment...
        rmdir /s /q .venv
        python -m venv .venv
    )
) else (
    echo [INFO] Creating new virtual environment...
    python -m venv .venv
)

:: 3. Activate and Install Dependencies
echo [INFO] Updating dependencies...
call .venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r backend\requirements.txt

:: 4. Start the Application
echo [SUCCESS] Everything is ready. Starting Healix AI...
npm run dev

pause
