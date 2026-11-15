import os
from pathlib import Path

# Thư mục gốc backend
BASE_DIR = Path(__file__).resolve().parent.parent

# Thư mục chứa dữ liệu SQLite
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

DB_FILE_PATH = DATA_DIR / "database.sqlite"
CSV_FILE_PATH = DATA_DIR / "datasets.csv"

# Thư mục chứa frontend build (dành cho production deploy trên Render)
FRONTEND_DIST_DIR = BASE_DIR.parent / "frontend" / "dist"

# Các cấu hình server
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "*"
]
