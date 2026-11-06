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

:: Free port 3000 if another process or old project is still using it
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo [INFO] Freeing port 3000 from lingering process (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

if not exist "node_modules" (
    echo [INFO] First time setup: Installing frontend dependencies...
    call npm install --legacy-peer-deps
)

echo [INFO] Launching KhetBazaar development server...
echo [INFO] Browser will automatically open once KhetBazaar is ready.
echo [INFO] Press Ctrl+C in this window to stop the server.
echo.

:: Smart browser opener: waits until KhetBazaar server responds HTTP 200 before launching browser
start "" powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$url = 'http://localhost:3000'; for ($i=0; $i -lt 30; $i++) { Start-Sleep -Seconds 1; try { $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2; if ($res.StatusCode -eq 200) { Start-Process $url; break } } catch {} }"

call npm run dev
if %ERRORLEVEL% neq 0 (
    echo.
    echo [INFO] Retrying dev server to continue...
    call npm run dev
)
pause
