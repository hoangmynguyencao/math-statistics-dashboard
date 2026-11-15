#!/usr/bin/env bash
# exit on error
set -o errexit

echo "================================================="
echo "   BẮT ĐẦU QUÁ TRÌNH BUILD TRÊN RENDER"
echo "================================================="

# 1. Cài đặt uv nếu chưa có
echo "--> [1/4] Kiểm tra và cài uv..."
if ! command -v uv &> /dev/null; then
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.local/bin:$PATH"
fi
uv --version

# 2. Cài đặt các gói phụ thuộc Python cho Backend qua uv
echo "--> [2/4] Cài đặt Python requirements qua uv..."
uv pip install --system -r requirements.txt

# 3. Build giao diện React Tailwind CSS
echo "--> [3/4] Cài đặt npm packages và build Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "--> [4/4] Kiểm tra thư mục frontend/dist..."
if [ -d "frontend/dist" ]; then
    echo "Frontend build thành công! Thư mục frontend/dist đã sẵn sàng."
else
    echo "Lỗi: Thư mục frontend/dist không tồn tại sau khi build!"
    exit 1
fi

echo "================================================="
echo "   BUILD HOÀN TẤT THÀNH CÔNG!"
echo "================================================="
