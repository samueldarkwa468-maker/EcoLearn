@echo off
setlocal
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js 20.9 or newer, then run this file again.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing EcoLearn dependencies...
  call npm install
  if errorlevel 1 exit /b 1
)
echo Starting EcoLearn at http://localhost:3000
call npm run dev
