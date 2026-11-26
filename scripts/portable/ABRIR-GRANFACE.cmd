@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0apresentacao.ps1"
if errorlevel 1 (
  echo.
  echo Nao foi possivel abrir a apresentacao. Confira se o ZIP foi extraido completamente.
  pause
)
