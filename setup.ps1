# Bootstrap script for Nihongo SRS on a fresh Windows machine.
# - Verifies Node.js
# - Installs dependencies
# - Restores Prisma client
# - Seeds DB only if dev.db is missing (preserves copied progress)
# - Launches the dev server on http://localhost:3000
#
# Usage:  Right-click setup.ps1 → "Run with PowerShell"
#         or open Terminal and run:  .\setup.ps1
#
# If PowerShell blocks execution, run once in an admin shell:
#   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot
Set-Location $projectRoot

function Step($msg) {
  Write-Host ""
  Write-Host ">>> $msg" -ForegroundColor Cyan
}

function Ok($msg) {
  Write-Host "  [ok] $msg" -ForegroundColor Green
}

function Fail($msg) {
  Write-Host "  [!!] $msg" -ForegroundColor Red
  exit 1
}

# ----------------------------------------------------------------
Step "Checking Node.js"
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  Fail "Node.js not found. Install LTS from https://nodejs.org and re-run."
}
$nodeVersion = (node --version)
Ok "node $nodeVersion"

$npm = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npm) { Fail "npm not found (should ship with Node.js)" }
Ok "npm $((npm --version))"

# ----------------------------------------------------------------
Step "Installing dependencies (npm install)"
if (Test-Path "node_modules") {
  Write-Host "  node_modules already present — running npm install anyway to verify lockfile state" -ForegroundColor DarkGray
}
npm install
if ($LASTEXITCODE -ne 0) { Fail "npm install failed" }
Ok "dependencies installed"

# ----------------------------------------------------------------
Step "Setting up environment (.env)"
if (-not (Test-Path ".env")) {
  Set-Content -Path ".env" -Value 'DATABASE_URL="file:./dev.db"' -Encoding utf8
  Ok ".env created"
} else {
  Ok ".env already exists"
}

# ----------------------------------------------------------------
Step "Generating Prisma client"
npx prisma generate
if ($LASTEXITCODE -ne 0) { Fail "prisma generate failed" }
Ok "Prisma client generated"

# ----------------------------------------------------------------
Step "Database"
if (Test-Path "dev.db") {
  $size = [math]::Round((Get-Item "dev.db").Length / 1KB, 1)
  Ok "dev.db found ($size KB) — keeping existing progress, skipping seed"

  # Apply any pending migrations on top of the copied DB
  npx prisma migrate deploy
  if ($LASTEXITCODE -ne 0) {
    Write-Host "  migrate deploy failed — DB may be from an older schema. Re-run with -ForceReseed to wipe." -ForegroundColor Yellow
  }
} else {
  Ok "dev.db missing — running full seed sequence"

  npx prisma migrate deploy
  if ($LASTEXITCODE -ne 0) { Fail "prisma migrate deploy failed" }

  $seedSteps = @(
    @{ name = "Starter content";        cmd = "seed" },
    @{ name = "Genki grammar";          cmd = "seed:genki" },
    @{ name = "Grammar explanations";   cmd = "seed:explanations" },
    @{ name = "Extra vocabulary";       cmd = "seed:vocab" },
    @{ name = "Extra N5 kanji & vocab"; cmd = "seed:n5" },
    @{ name = "Listening & reading v3"; cmd = "seed:content:v3" },
    @{ name = "Extra listening/reading"; cmd = "seed:content:extra" },
    @{ name = "Example sentences";      cmd = "seed:examples" },
    @{ name = "Ukrainian translations"; cmd = "translate:uk" },
    @{ name = "Ukrainian (prose pass)";  cmd = "translate:uk:extra" }
  )
  foreach ($s in $seedSteps) {
    Write-Host "    -> $($s.name) (npm run $($s.cmd))" -ForegroundColor DarkGray
    npm run $s.cmd
    if ($LASTEXITCODE -ne 0) { Fail "$($s.name) failed" }
  }
  Ok "all seeders completed"
}

# ----------------------------------------------------------------
Step "Starting dev server"
Write-Host ""
Write-Host "  Site will be available at http://localhost:3000" -ForegroundColor Yellow
Write-Host "  Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

npm run dev
