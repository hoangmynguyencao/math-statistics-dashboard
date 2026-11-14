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

DEMO_DATASETS = [
    {
        "name": "Điểm kiểm tra giữa kì môn Toán 10 (Lớp 10A1)",
        "mode": "simple",
        "raw_data": "7.5, 8.0, 6.5, 9.0, 8.5, 7.0, 8.0, 9.5, 4.0, 8.5, 9.0, 8.0, 7.5, 10.0, 1.5, 8.0, 7.0, 8.5, 9.0, 6.0",
        "notes": "Mẫu số liệu có chứa điểm ngoại lệ bất thường x = 1.5 (học sinh bị ốm phải bỏ dở bài thi)."
    },
    {
        "name": "Bảng tần số: Số con trong 40 hộ gia đình ở thôn An Bình",
        "mode": "frequency",
        "raw_data": "0: 4\n1: 12\n2: 18\n3: 5\n4: 1",
        "notes": "Khảo sát theo SGK Toán 10 KNTT về số con trong gia đình. Cỡ mẫu n = 40."
    },
    {
        "name": "Chiều cao 15 học sinh nam đội bóng rổ lớp 10 (cm)",
        "mode": "simple",
        "raw_data": "168, 172, 170, 175, 169, 171, 174, 182, 170, 173, 168, 176, 172, 170, 195",
        "notes": "Chiều cao trung bình và nhận diện học sinh có chiều cao đột biến x = 195 cm."
    },
    {
        "name": "Thời gian chạy cự ly 100m của các vận động viên (giây)",
        "mode": "simple",
        "raw_data": "12.2, 11.8, 12.5, 11.5, 12.0, 13.1, 11.9, 12.3, 12.1, 11.7, 14.8",
        "notes": "Khảo sát chỉ số độ phân tán (R, Delta_Q, s) và phát hiện giá trị ngoại lệ x = 14.8s."
    }
]

def init_db():
    """Khởi tạo file CSV nếu chưa tồn tại, thêm dữ liệu mẫu SGK 10."""
    DATA_DIR.mkdir(exist_ok=True, parents=True)
    if not CSV_FILE_PATH.exists() or CSV_FILE_PATH.stat().st_size == 0:
        with open(CSV_FILE_PATH, mode="w", newline="", encoding="utf-8-sig") as f:
            writer = csv.writer(f)
            writer.writerow(CSV_HEADERS)

        # Nạp dữ liệu mẫu
        for item in DEMO_DATASETS:
            save_dataset_item(item["name"], item["mode"], item["raw_data"], item["notes"])

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
