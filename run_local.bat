@echo off
chcp 65001 >nul
echo ====================================================================
echo    KHỞI CHẠY BẢNG ĐIỀU KHIỂN NHẬP LIỆU & THỐNG KÊ TOÁN 10
echo ====================================================================
echo.

REM Đặt lệnh Python theo yêu cầu của bạn
set PYTHON_CMD=python3.14-64.exe

REM Kiểm tra Python
where %PYTHON_CMD% >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Không tìm thấy lệnh %PYTHON_CMD% trong PATH.
    echo Đang thử kiểm tra lệnh python mặc định...
    where python >nul 2>nul
    if %errorlevel% equ 0 (
        set PYTHON_CMD=python
        echo [OK] Đã chuyển sang dùng lệnh: python
    ) else (
        echo [!] Không tìm thấy Python trong hệ thống. Vui lòng kiểm tra lại PATH!
        pause
        exit /b
    )
) else (
    echo [OK] Đã tìm thấy: %PYTHON_CMD%
)

REM Kiểm tra Node.js
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Không tìm thấy lệnh npm trong PATH. Vui lòng cài đặt Node.js 18+
    pause
    exit /b
)

echo.
echo [1/2] Đang khởi chạy Backend FastAPI với %PYTHON_CMD% tại http://localhost:8000 ...
start "Backend FastAPI" cmd /k "%PYTHON_CMD% -m pip install -r requirements.txt && %PYTHON_CMD% -m uvicorn backend.app.main:app --reload --port 8000"

echo [2/2] Đang khởi chạy Frontend Vite React tại http://localhost:5173 ...
cd frontend
if not exist "node_modules" (
    echo Đang cài đặt thư viện frontend npm...
    call npm install
)
start "Frontend React" cmd /k "npm run dev"

echo.
echo ====================================================================
echo Đã khởi động xong!
echo - Trình thông dịch Python sử dụng: %PYTHON_CMD%
echo - Trang web giao diện: http://localhost:5173
echo - Tài liệu API Swagger: http://localhost:8000/docs
echo ====================================================================
pause
