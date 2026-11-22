@echo off
echo ========================================================
echo Starting Coroot AI - Root Cause Analysis Agent
echo ========================================================
echo.

echo [1/2] Launching Backend Server (Port 5000)...
start "Coroot AI - Backend Server" cmd /k "cd /d %~dp0backend && npm.cmd start"

timeout /t 2 /nobreak >nul

echo [2/2] Launching Frontend Console (Port 5173)...
start "Coroot AI - Frontend Console" cmd /k "cd /d %~dp0frontend && npm.cmd run dev"

echo.
echo ========================================================
echo Services are now launching in separate windows:
echo - Frontend:  http://localhost:5173
echo - Backend:   http://localhost:5000
echo - Demo User: harsh@test.com / password123
echo ========================================================
echo.
echo You can close this launcher window at any time.
pause
