#!/usr/bin/env bash
# exit on error
set -o errexit

echo "================================================="
echo "   BẮT ĐẦU QUÁ TRÌNH BUILD TRÊN RENDER"
echo "================================================="

# 1. Cài đặt các gói phụ thuộc Python cho Backend
echo "--> [1/3] Cài đặt Python requirements..."
pip install --upgrade pip
pip install -r requirements.txt

# 2. Build giao diện React Tailwind CSS
echo "--> [2/3] Cài đặt npm packages và build Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "--> [3/3] Kiểm tra thư mục frontend/dist..."
if [ -d "frontend/dist" ]; then
    echo "Frontend build thành công! Thư mục frontend/dist đã sẵn sàng."
else
    echo "Lỗi: Thư mục frontend/dist không tồn tại sau khi build!"
    exit 1
fi

echo "================================================="
echo "   BUILD HOÀN TẤT THÀNH CÔNG!"
echo "================================================="
