@echo off
REM SAM.CHAT Desktop Application Launcher
REM This batch file starts the SAM.CHAT application

echo Starting SAM.CHAT...
cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Start the Next.js server
echo Launching SAM.CHAT on http://localhost:3000
start http://localhost:3000
call npm start
