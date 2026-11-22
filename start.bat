@echo off
echo ========================================================
echo Starting AI Root Cause Analysis Agent (RCA Agent)...
echo ========================================================

echo Starting Backend Server on http://localhost:5000...
start "RCA Backend" cmd /k "cd /d %~dp0backend && npm start"

timeout /t 2 /nobreak >nul

echo Starting Frontend on http://localhost:5173...
start "RCA Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo RCA Agent is now launching!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this launcher window...
pause >nul
