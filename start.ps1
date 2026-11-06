$ErrorActionPreference = "Continue"

Write-Host "======================================================================" -ForegroundColor Green
Write-Host "   KHETBAZAAR: LOCAL FARMER MANAGEMENT SYSTEM" -ForegroundColor Green
Write-Host "   Project Folder: $PSScriptRoot" -ForegroundColor Yellow
Write-Host "   Target URL:     http://localhost:3000" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Green
Write-Host ""

Set-Location "$PSScriptRoot\frontend"

# Free port 3000 if occupied by another process
$occupied = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($occupied) {
    Write-Host "[INFO] Freeing port 3000 from process PID $($occupied.OwningProcess)..." -ForegroundColor Yellow
    Stop-Process -Id $occupied.OwningProcess -Force -ErrorAction SilentlyContinue
}

# Install dependencies if missing
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing dependencies..." -ForegroundColor Cyan
    npm install --legacy-peer-deps
}

# Background job to open browser once server is responding with HTTP 200
Start-Job -ScriptBlock {
    $url = "http://localhost:3000"
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 1
        try {
            $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
            if ($res.StatusCode -eq 200) {
                Start-Process $url
                break
            }
        } catch {}
    }
} | Out-Null

Write-Host "[INFO] Starting Next.js Turbopack dev server..." -ForegroundColor Green
Write-Host "[INFO] Browser will open automatically once KhetBazaar is ready." -ForegroundColor Gray
Write-Host "[INFO] Press Ctrl + C to stop the server." -ForegroundColor Yellow
Write-Host ""

npm run dev
if ($LASTEXITCODE -ne 0) {
    Write-Host "[INFO] Resuming dev server..." -ForegroundColor Yellow
    npm run dev
}
