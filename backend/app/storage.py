import sqlite3
import json
import uuid
import csv
from datetime import datetime
from typing import List, Optional, Dict, Any
from pathlib import Path
from .config import DB_FILE_PATH, CSV_FILE_PATH, DATA_DIR
from .stats import calculate_statistics
from .models import DatasetResponse, DatasetCreate, DatasetUpdate, StatsResult

def get_db_connection() -> sqlite3.Connection:
    """Tạo kết nối tới cơ sở dữ liệu SQLite."""
    conn = sqlite3.connect(str(DB_FILE_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Khởi tạo cơ sở dữ liệu SQLite và bảng datasets nếu chưa tồn tại."""
    DATA_DIR.mkdir(exist_ok=True, parents=True)
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS datasets (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                mode TEXT NOT NULL,
                raw_data TEXT NOT NULL,
                sample_size INTEGER,
                mean REAL,
                median REAL,
                q1 REAL,
                q3 REAL,
                iqr REAL,
                range_val REAL,
                variance REAL,
                std_dev REAL,
                outliers TEXT,
                notes TEXT,
                created_at TEXT,
                updated_at TEXT
            )
        """)
        conn.commit()

        # Tự động di chuyển dữ liệu từ file CSV cũ vào SQLite (nếu có và SQLite chưa có dữ liệu)
        cursor.execute("SELECT COUNT(*) as count FROM datasets")
        count = cursor.fetchone()["count"]
        if count == 0 and CSV_FILE_PATH.exists() and CSV_FILE_PATH.stat().st_size > 0:
            try:
                with open(CSV_FILE_PATH, mode="r", newline="", encoding="utf-8-sig") as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        if row.get("id") and row.get("name") and row.get("raw_data"):
                            cursor.execute("""
                                INSERT OR IGNORE INTO datasets (
                                    id, name, mode, raw_data, sample_size, mean, median,
                                    q1, q3, iqr, range_val, variance, std_dev, outliers,
                                    notes, created_at, updated_at
                                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            """, (
                                row.get("id"),
                                row.get("name"),
                                row.get("mode", "simple"),
                                row.get("raw_data"),
                                int(row.get("sample_size", 0)),
                                float(row.get("mean", 0)),
                                float(row.get("median", 0)),
                                float(row.get("q1", 0)),
                                float(row.get("q3", 0)),
                                float(row.get("iqr", 0)),
                                float(row.get("range_val", 0)),
                                float(row.get("variance", 0)),
                                float(row.get("std_dev", 0)),
                                row.get("outliers", "[]"),
                                row.get("notes", ""),
                                row.get("created_at", ""),
                                row.get("updated_at", "")
                            ))
                conn.commit()
            except Exception as e:
                print(f"[!] Chuyển đổi dữ liệu CSV cũ sang SQLite bỏ qua: {e}")

def row_to_dataset(row: Any) -> DatasetResponse:
    """Chuyển đổi một dòng SQLite Row thành đối tượng DatasetResponse kèm thống kê chi tiết."""
    raw_data = row["raw_data"]
    mode = row["mode"] if "mode" in row.keys() else "simple"
    try:
        stats_dict = calculate_statistics(raw_data, mode)
    except Exception as e:
        # Fallback nếu dữ liệu lỗi
        stats_dict = {
            "sample_size": int(row["sample_size"] or 0),
            "sorted_values": [],
            "min_value": 0,
            "max_value": 0,
            "mean": float(row["mean"] or 0),
            "median": float(row["median"] or 0),
            "q1": float(row["q1"] or 0),
            "q2": float(row["median"] or 0),
            "q3": float(row["q3"] or 0),
            "iqr": float(row["iqr"] or 0),
            "range_val": float(row["range_val"] or 0),
            "variance": float(row["variance"] or 0),
            "std_dev": float(row["std_dev"] or 0),
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
        notes=row["notes"] or "",
        stats=StatsResult(**stats_dict),
        created_at=row["created_at"] or "",
        updated_at=row["updated_at"] or ""
    )

def get_all_datasets() -> List[DatasetResponse]:
    """Đọc toàn bộ danh sách các mẫu số liệu từ cơ sở dữ liệu SQLite."""
    init_db()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM datasets ORDER BY created_at DESC, id DESC")
        rows = cursor.fetchall()
        results = []
        for row in rows:
            try:
                results.append(row_to_dataset(row))
            except Exception:
                continue
        return results

def get_dataset_by_id(dataset_id: str) -> Optional[DatasetResponse]:
    """Tìm một mẫu số liệu theo ID trong SQLite."""
    init_db()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM datasets WHERE id = ?", (dataset_id,))
        row = cursor.fetchone()
        if row:
            return row_to_dataset(row)
    return None

def save_dataset_item(name: str, mode: str, raw_data: str, notes: str = "") -> DatasetResponse:
    """Lưu một mẫu số liệu mới vào cơ sở dữ liệu SQLite."""
    init_db()
    stats = calculate_statistics(raw_data, mode)
    item_id = str(uuid.uuid4())[:8]
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO datasets (
                id, name, mode, raw_data, sample_size, mean, median,
                q1, q3, iqr, range_val, variance, std_dev, outliers,
                notes, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            item_id,
            name,
            mode,
            raw_data,
            stats["sample_size"],
            stats["mean"],
            stats["median"],
            stats["q1"],
            stats["q3"],
            stats["iqr"],
            stats["range_val"],
            stats["variance"],
            stats["std_dev"],
            json.dumps(stats["outliers"]),
            notes,
            now_str,
            now_str
        ))
        conn.commit()

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
    """Cập nhật thông tin một mẫu số liệu trong SQLite."""
    init_db()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM datasets WHERE id = ?", (dataset_id,))
        existing = cursor.fetchone()
        if not existing:
            return None

        new_name = data.name if data.name is not None else existing["name"]
        new_mode = data.mode if data.mode is not None else existing["mode"]
        new_raw = data.raw_data if data.raw_data is not None else existing["raw_data"]
        new_notes = data.notes if data.notes is not None else existing["notes"]

        stats = calculate_statistics(new_raw, new_mode)
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        cursor.execute("""
            UPDATE datasets SET
                name = ?,
                mode = ?,
                raw_data = ?,
                sample_size = ?,
                mean = ?,
                median = ?,
                q1 = ?,
                q3 = ?,
                iqr = ?,
                range_val = ?,
                variance = ?,
                std_dev = ?,
                outliers = ?,
                notes = ?,
                updated_at = ?
            WHERE id = ?
        """, (
            new_name,
            new_mode,
            new_raw,
            stats["sample_size"],
            stats["mean"],
            stats["median"],
            stats["q1"],
            stats["q3"],
            stats["iqr"],
            stats["range_val"],
            stats["variance"],
            stats["std_dev"],
            json.dumps(stats["outliers"]),
            new_notes,
            now_str,
            dataset_id
        ))
        conn.commit()

        return DatasetResponse(
            id=dataset_id,
            name=new_name,
            mode=new_mode,
            raw_data=new_raw,
            notes=new_notes,
            stats=StatsResult(**stats),
            created_at=existing["created_at"] or now_str,
            updated_at=now_str
        )

def delete_dataset_item(dataset_id: str) -> bool:
    """Xóa một mẫu số liệu khỏi cơ sở dữ liệu SQLite."""
    init_db()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM datasets WHERE id = ?", (dataset_id,))
        conn.commit()
        return cursor.rowcount > 0

def reset_to_demo_data():
    """Làm sạch toàn bộ dữ liệu trong cơ sở dữ liệu SQLite."""
    init_db()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM datasets")
        conn.commit()
