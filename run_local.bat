@echo off
setlocal enabledelayedexpansion

REM Dam bao luon chay tai thu muc chua file script nay
cd /d "%~dp0"

echo ====================================================================
echo    KHOI CHAY BANG DIEU KHIEN NHAP LIEU VA THONG KE TOAN 10
echo ====================================================================
echo.

REM 1. Tu dong them Node.js neu chua co trong PATH
if exist "C:\Program Files\nodejs" (
    set "PATH=C:\Program Files\nodejs;!PATH!"
)

REM 2. Tu dong them cac thu muc Python pho bien vao PATH
if exist "%LOCALAPPDATA%\Python\bin" (
    set "PATH=%LOCALAPPDATA%\Python\bin;!PATH!"
)
for /d %%D in ("%LOCALAPPDATA%\Python\pythoncore-*") do (
    if exist "%%D" set "PATH=%%D;%%D\Scripts;!PATH!"
)
for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python*") do (
    if exist "%%D" set "PATH=%%D;%%D\Scripts;!PATH!"
)
for /d %%D in ("C:\Program Files\Python*") do (
    if exist "%%D" set "PATH=%%D;%%D\Scripts;!PATH!"
)

REM 3. Xac dinh lenh Python (Kiem tra kha nang thuc thi thuc te)
set "PYTHON_CMD="

for %%C in (python3.14-64.exe python3.14.exe python.exe py.exe) do (
    if "!PYTHON_CMD!"=="" (
        where %%C >nul 2>nul
        if !errorlevel! equ 0 (
            %%C -c "import sys" >nul 2>nul
            if !errorlevel! equ 0 (
                set "PYTHON_CMD=%%C"
                echo [OK] Phat hien lenh Python hop le: %%C
            )
        )
    )
)

if "!PYTHON_CMD!"=="" (
    echo [!] Khong tim thay trinh thong dich Python kha dung trong PATH.
    echo Vui long kiem tra lai duong dan Python hoac mo file run_local.bat de sua.
    pause
    exit /b 1
)

REM 4. Kiem tra Node.js va npm
where npm >nul 2>nul
if !errorlevel! neq 0 (
    echo [!] Khong tim thay lenh npm hoac Node.js.
    echo Vui long cai dat Node.js tai https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Phat hien Node.js va npm san sang.

echo.
echo [1/2] Dang khoi chay Backend FastAPI voi !PYTHON_CMD! tai http://localhost:8000 ...
start "Backend FastAPI" /d "%~dp0" cmd /k "!PYTHON_CMD! -m pip install -r requirements.txt && !PYTHON_CMD! -m uvicorn backend.app.main:app --reload --port 8000"

echo [2/2] Dang khoi chay Frontend Vite React tai http://localhost:5173 ...
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo Dang cai dat thu vien frontend npm, vui long cho trong giay lat...
    call npm install
)
start "Frontend React" /d "%~dp0frontend" cmd /k "npm run dev"
cd /d "%~dp0"

echo.
echo ====================================================================
echo Da gui lenh khoi dong thanh cong!
echo - Trinh thong dich Python: !PYTHON_CMD!
echo - Giao dien trang web:     http://localhost:5173
echo - Tai lieu API Swagger:    http://localhost:8000/docs
echo ====================================================================
pause
