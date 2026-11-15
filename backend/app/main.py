import os
from pathlib import Path
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .config import CORS_ORIGINS, FRONTEND_DIST_DIR
from .models import (
    DatasetCreate,
    DatasetUpdate,
    DatasetResponse,
    ComputeStatsRequest,
    StatsResult
)
from .stats import calculate_statistics
from .storage import (
    init_db,
    get_all_datasets,
    get_dataset_by_id,
    save_dataset_item,
    update_dataset_item,
    delete_dataset_item,
    delete_multiple_datasets,
    reset_to_demo_data
)

app = FastAPI(
    title="Thống Kê Toán 10 - API",
    description="Hệ thống thống kê mẫu số liệu không ghép nhóm theo SGK Toán 10 (Kết nối tri thức với cuộc sống)",
    version="1.0.0"
)

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Khởi động và nạp dữ liệu ban đầu."""
    init_db()

# --- API ENDPOINTS ---

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "app": "Thống Kê Toán 10 Clean Dashboard",
        "version": "1.0.0",
        "curriculum": "Toán 10 - Kết nối tri thức với cuộc sống"
    }

@app.post("/api/stats/calculate", response_model=StatsResult)
async def calculate_stats(payload: ComputeStatsRequest):
    """Tính toán thống kê tức thời từ chuỗi số liệu (không lưu vào cơ sở dữ liệu)."""
    try:
        stats = calculate_statistics(payload.raw_data, payload.mode)
        return StatsResult(**stats)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Lỗi tính toán: {str(e)}")

@app.get("/api/datasets", response_model=list[DatasetResponse])
async def list_datasets():
    """Lấy danh sách toàn bộ các bài toán/mẫu số liệu đã lưu trong cơ sở dữ liệu SQLite."""
    return get_all_datasets()

@app.post("/api/datasets", response_model=DatasetResponse, status_code=status.HTTP_201_CREATED)
async def create_dataset(payload: DatasetCreate):
    """Lưu mẫu số liệu mới vào SQLite và tự động tính toán các chỉ số."""
    try:
        new_item = save_dataset_item(
            name=payload.name,
            mode=payload.mode,
            raw_data=payload.raw_data,
            notes=payload.notes or ""
        )
        return new_item
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Lỗi lưu dữ liệu: {str(e)}")

@app.get("/api/datasets/{dataset_id}", response_model=DatasetResponse)
async def get_dataset(dataset_id: str):
    """Lấy chi tiết một mẫu số liệu theo ID."""
    item = get_dataset_by_id(dataset_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy mẫu số liệu.")
    return item

@app.put("/api/datasets/{dataset_id}", response_model=DatasetResponse)
async def update_dataset(dataset_id: str, payload: DatasetUpdate):
    """Cập nhật bài toán/mẫu số liệu trong cơ sở dữ liệu SQLite."""
    try:
        updated = update_dataset_item(dataset_id, payload)
        if not updated:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy mẫu số liệu để sửa.")
        return updated
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Lỗi cập nhật: {str(e)}")

@app.delete("/api/datasets/{dataset_id}")
async def delete_dataset(dataset_id: str):
    """Xóa mẫu số liệu khỏi SQLite."""
    success = delete_dataset_item(dataset_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy mẫu số liệu để xóa.")
    return {"message": "Đã xóa thành công mẫu số liệu.", "id": dataset_id}

@app.post("/api/datasets/batch-delete")
async def batch_delete_datasets(ids: list[str]):
    """Xóa đồng thời nhiều mẫu số liệu khỏi SQLite."""
    count = delete_multiple_datasets(ids)
    return {"message": f"Đã xóa thành công {count} mẫu số liệu.", "deleted_count": count}

@app.post("/api/datasets/reset")
async def reset_datasets():
    """Làm sạch toàn bộ cơ sở dữ liệu SQLite."""
    reset_to_demo_data()
    return {"message": "Đã làm sạch cơ sở dữ liệu SQLite thành công."}

# --- CẤU HÌNH PHỤC VỤ FRONTEND BUILD (DÀNH CHO PRODUCTION DEPLOY TRÊN RENDER) ---
if FRONTEND_DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = FRONTEND_DIST_DIR / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST_DIR / "index.html")
else:
    @app.get("/")
    async def root_dev_info():
        return {
            "message": "Backend FastAPI Thống kê Toán 10 đang hoạt động!",
            "docs": "/docs",
            "frontend_note": "Frontend đang chạy ở chế độ dev (http://localhost:5173) hoặc chưa được build vào frontend/dist."
        }
