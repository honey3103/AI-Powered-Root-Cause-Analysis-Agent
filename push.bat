@echo off
setlocal
echo ========================================================
echo   Push to GitHub: AI-Powered-Root-Cause-Analysis-Agent
echo ========================================================
echo.
echo NOTE: GitHub requires a Personal Access Token (PAT) for git operations.
echo Account passwords are no longer supported by GitHub.
echo.
echo If you need to generate a token:
echo 1. Open: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Check the "repo" scope and generate
echo 4. Copy your token (starts with ghp_...)
echo.
set /p TOKEN="Enter your GitHub Personal Access Token: "

if "%TOKEN%"=="" (
    echo No token provided. Operation cancelled.
    pause
    exit /b
)

echo.
echo Pushing latest changes to GitHub...
cd /d "%~dp0"
git push https://%TOKEN%@github.com/honey3103/AI-Powered-Root-Cause-Analysis-Agent.git main -u

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   SUCCESS: Code successfully pushed to GitHub!
    echo   Repository: https://github.com/honey3103/AI-Powered-Root-Cause-Analysis-Agent
    echo ========================================================
) else (
    echo.
    echo [ERROR] Push failed. Please check your token and repository permissions.
)

pause
