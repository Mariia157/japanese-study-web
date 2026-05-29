@echo off
REM Double-click launcher for setup.ps1
REM Bypasses ExecutionPolicy for this run only.

cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\setup.ps1"

if errorlevel 1 (
  echo.
  echo Setup finished with errors. Check the log above.
  pause
  exit /b 1
)
pause
