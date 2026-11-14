#!/usr/bin/env bash

echo "===================================================================="
echo "   KHỞI CHẠY BẢNG ĐIỀU KHIỂN NHẬP LIỆU & THỐNG KÊ TOÁN 10"
echo "===================================================================="

# Cài đặt requirements cho Backend
echo "[1/2] Cài đặt dependencies và chạy Backend FastAPI..."
pip install -r requirements.txt
uvicorn backend.app.main:app --reload --port 8000 &
BACKEND_PID=$!

# Chạy Frontend
echo "[2/2] Chạy Frontend React..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run dev &
FRONTEND_PID=$!

echo "Đã khởi chạy:"
echo " - Frontend: http://localhost:5173"
echo " - Backend API: http://localhost:8000"
echo "Nhấn Ctrl+C để dừng cả 2 tiến trình."

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
