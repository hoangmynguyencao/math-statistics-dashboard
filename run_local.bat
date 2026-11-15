@echo off
setlocal enabledelayedexpansion

REM Dam bao luon chay tai thu muc chua file script nay
cd /d "%~dp0"

echo ====================================================================
echo    KHOI CHAY BANG DIEU KHIEN NHAP LIEU VA THONG KE TOAN 10
echo ====================================================================
echo.

REM 1. Them thu muc uv vao PATH
set "UV_DIR=%USERPROFILE%\.local\bin"
if exist "%UV_DIR%\uv.exe" (
    set "PATH=%UV_DIR%;!PATH!"
    echo [OK] Phat hien uv tai: %UV_DIR%\uv.exe
) else (
    echo [!] Khong tim thay uv. Dang cai dat uv...
    powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
    if exist "%UV_DIR%\uv.exe" (
        set "PATH=%UV_DIR%;!PATH!"
        echo [OK] Da cai dat uv thanh cong.
    ) else (
        echo [!] Khong the cai dat uv. Vui long cai thu cong tai https://docs.astral.sh/uv/
        pause
        exit /b 1
    )
)

REM 2. Them Node.js neu chua co trong PATH
if exist "C:\Program Files\nodejs" (
    set "PATH=C:\Program Files\nodejs;!PATH!"
)

REM 3. Kiem tra Node.js va npm
where npm >nul 2>nul
if !errorlevel! neq 0 (
    echo [!] Khong tim thay lenh npm hoac Node.js.
    echo Vui long cai dat Node.js tai https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Phat hien Node.js va npm san sang.

REM 4. Kiem tra/tao virtual environment Python voi uv
if not exist ".venv" (
    echo [*] Dang tao Python virtual environment voi uv...
    uv sync
    echo [OK] Da tao .venv va cai dat cac thu vien Python.
) else (
    echo [OK] Virtual environment .venv da ton tai.
)

echo.
echo [1/2] Dang khoi chay Backend FastAPI (uv run uvicorn) tai http://localhost:8000 ...
start "Backend FastAPI" /d "%~dp0" cmd /k "uv run uvicorn backend.app.main:app --reload --port 8000"

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
echo - Quan ly Python: uv (virtual environment .venv)
echo - Giao dien trang web:     http://localhost:5173
echo - Tai lieu API Swagger:    http://localhost:8000/docs
echo ====================================================================
pause
