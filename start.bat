@echo off
title KhetBazaar - Local Farmer Management (http://localhost:3000)
color 0A

echo ======================================================================
echo    KHETBAZAAR: LOCAL FARMER MANAGEMENT SYSTEM
echo    Project Folder: %~dp0
echo    Local Server URL: http://localhost:3000
echo ======================================================================
echo.

cd /d "%~dp0frontend"

:: Free port 3000 if occupied
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" >nul 2>&1

if not exist "node_modules" (
    echo [INFO] First time setup: Installing frontend dependencies...
    call npm install --legacy-peer-deps
)

echo [INFO] Launching KhetBazaar development server...
echo [INFO] Browser will automatically open once KhetBazaar is ready.
echo [INFO] Press Ctrl+C in this terminal window to stop the server.
echo.

:: Launch background watcher that opens browser once server is ready
start "" powershell -NoProfile -ExecutionPolicy Bypass -Command "$u='http://localhost:3000'; for($i=0;$i -lt 30;$i++){Start-Sleep -Seconds 1; try{if((Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 2).StatusCode -eq 200){Start-Process $u; break}}catch{}}"

call npm run dev
if %ERRORLEVEL% neq 0 (
    echo.
    echo [INFO] Retrying dev server to continue...
    call npm run dev
)
pause
