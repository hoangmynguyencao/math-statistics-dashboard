import csv
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from pathlib import Path
from .config import CSV_FILE_PATH, DATA_DIR
from .stats import calculate_statistics
from .models import DatasetResponse, DatasetCreate, DatasetUpdate, StatsResult

CSV_HEADERS = [
    "id",
    "name",
    "mode",
    "raw_data",
    "sample_size",
    "mean",
    "median",
    "q1",
    "q3",
    "iqr",
    "range_val",
    "variance",
    "std_dev",
    "outliers",
    "notes",
    "created_at",
    "updated_at"
]

DEMO_DATASETS = []

def init_db():
    """Khởi tạo file CSV nếu chưa tồn tại (chỉ tạo tiêu đề, người dùng sẽ tự nhập dữ liệu)."""
    DATA_DIR.mkdir(exist_ok=True, parents=True)
    if not CSV_FILE_PATH.exists() or CSV_FILE_PATH.stat().st_size == 0:
        with open(CSV_FILE_PATH, mode="w", newline="", encoding="utf-8-sig") as f:
            writer = csv.writer(f)
            writer.writerow(CSV_HEADERS)

def row_to_dataset(row: Dict[str, str]) -> DatasetResponse:
    """Chuyển đổi một dòng CSV thành đối tượng DatasetResponse kèm thống kê chi tiết."""
    raw_data = row["raw_data"]
    mode = row.get("mode", "simple")
    try:
        stats_dict = calculate_statistics(raw_data, mode)
    except Exception as e:
        # Fallback nếu dữ liệu lỗi
        stats_dict = {
            "sample_size": int(row.get("sample_size", 0)),
            "sorted_values": [],
            "min_value": 0,
            "max_value": 0,
            "mean": float(row.get("mean", 0)),
            "median": float(row.get("median", 0)),
            "q1": float(row.get("q1", 0)),
            "q2": float(row.get("median", 0)),
            "q3": float(row.get("q3", 0)),
            "iqr": float(row.get("iqr", 0)),
            "range_val": float(row.get("range_val", 0)),
            "variance": float(row.get("variance", 0)),
            "std_dev": float(row.get("std_dev", 0)),
            "variance_unbiased": None,
            "std_dev_unbiased": None,
            "modes": [],
            "mode_frequency": None,
            "has_mode": False,
            "outlier_lower_bound": 0,
            "outlier_upper_bound": 0,
            "outliers": [],
            "frequency_table": [],
            "formula_steps": {}
        }

    return DatasetResponse(
        id=row["id"],
        name=row["name"],
        mode=mode,
        raw_data=raw_data,
        notes=row.get("notes", ""),
        stats=StatsResult(**stats_dict),
        created_at=row.get("created_at", ""),
        updated_at=row.get("updated_at", "")
    )

def get_all_datasets() -> List[DatasetResponse]:
    """Đọc toàn bộ danh sách các mẫu số liệu từ file CSV."""
    init_db()
    results = []
    with open(CSV_FILE_PATH, mode="r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("id"):
                try:
                    results.append(row_to_dataset(row))
                except Exception as e:
                    continue
    # Sắp xếp mới nhất lên đầu
    results.reverse()
    return results

def get_dataset_by_id(dataset_id: str) -> Optional[DatasetResponse]:
    """Tìm một mẫu số liệu theo ID."""
    init_db()
    with open(CSV_FILE_PATH, mode="r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("id") == dataset_id:
                return row_to_dataset(row)
    return None

def save_dataset_item(name: str, mode: str, raw_data: str, notes: str = "") -> DatasetResponse:
    """Lưu một mẫu số liệu mới vào file CSV."""
    init_db()
    stats = calculate_statistics(raw_data, mode)
    item_id = str(uuid.uuid4())[:8]
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    row = {
        "id": item_id,
        "name": name,
        "mode": mode,
        "raw_data": raw_data,
        "sample_size": stats["sample_size"],
        "mean": stats["mean"],
        "median": stats["median"],
        "q1": stats["q1"],
        "q3": stats["q3"],
        "iqr": stats["iqr"],
        "range_val": stats["range_val"],
        "variance": stats["variance"],
        "std_dev": stats["std_dev"],
        "outliers": json.dumps(stats["outliers"]),
        "notes": notes,
        "created_at": now_str,
        "updated_at": now_str
    }

    with open(CSV_FILE_PATH, mode="a", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_HEADERS)
        writer.writerow(row)

    return DatasetResponse(
        id=item_id,
        name=name,
        mode=mode,
        raw_data=raw_data,
        notes=notes,
        stats=StatsResult(**stats),
        created_at=now_str,
        updated_at=now_str
    )

def update_dataset_item(dataset_id: str, data: DatasetUpdate) -> Optional[DatasetResponse]:
    """Cập nhật thông tin một mẫu số liệu trong CSV."""
    init_db()
    rows = []
    updated_obj = None

    with open(CSV_FILE_PATH, mode="r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("id") == dataset_id:
                # Cập nhật thông tin
                new_name = data.name if data.name is not None else row["name"]
                new_mode = data.mode if data.mode is not None else row.get("mode", "simple")
                new_raw = data.raw_data if data.raw_data is not None else row["raw_data"]
                new_notes = data.notes if data.notes is not None else row.get("notes", "")

                stats = calculate_statistics(new_raw, new_mode)
                now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                row["name"] = new_name
                row["mode"] = new_mode
                row["raw_data"] = new_raw
                row["sample_size"] = str(stats["sample_size"])
                row["mean"] = str(stats["mean"])
                row["median"] = str(stats["median"])
                row["q1"] = str(stats["q1"])
                row["q3"] = str(stats["q3"])
                row["iqr"] = str(stats["iqr"])
                row["range_val"] = str(stats["range_val"])
                row["variance"] = str(stats["variance"])
                row["std_dev"] = str(stats["std_dev"])
                row["outliers"] = json.dumps(stats["outliers"])
                row["notes"] = new_notes
                row["updated_at"] = now_str

                updated_obj = DatasetResponse(
                    id=dataset_id,
                    name=new_name,
                    mode=new_mode,
                    raw_data=new_raw,
                    notes=new_notes,
                    stats=StatsResult(**stats),
                    created_at=row.get("created_at", now_str),
                    updated_at=now_str
                )
            rows.append(row)

    if updated_obj:
        with open(CSV_FILE_PATH, mode="w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=CSV_HEADERS)
            writer.writeheader()
            writer.writerows(rows)

    return updated_obj

def delete_dataset_item(dataset_id: str) -> bool:
    """Xóa một mẫu số liệu khỏi CSV."""
    init_db()
    rows = []
    found = False

    with open(CSV_FILE_PATH, mode="r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("id") == dataset_id:
                found = True
                continue
            rows.append(row)

    if found:
        with open(CSV_FILE_PATH, mode="w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=CSV_HEADERS)
            writer.writeheader()
            writer.writerows(rows)

    return found

def reset_to_demo_data():
    """Khôi phục lại toàn bộ dữ liệu mẫu ban đầu."""
    if CSV_FILE_PATH.exists():
        CSV_FILE_PATH.unlink()
    init_db()
