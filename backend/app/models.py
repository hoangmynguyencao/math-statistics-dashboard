from typing import List, Optional, Union
from pydantic import BaseModel, Field

class FrequencyPair(BaseModel):
    value: float = Field(..., description="Giá trị x_i")
    frequency: int = Field(..., ge=1, description="Tần số n_i (>= 1)")

class FrequencyItemOutput(BaseModel):
    value: float
    frequency: int
    relative_freq: float = Field(..., description="Tần suất (%)")

class StatsResult(BaseModel):
    sample_size: int = Field(..., description="Cỡ mẫu n")
    sorted_values: List[float] = Field(..., description="Dãy số liệu sắp xếp không giảm")
    min_value: float = Field(..., description="Giá trị nhỏ nhất x_min")
    max_value: float = Field(..., description="Giá trị lớn nhất x_max")
    mean: float = Field(..., description="Số trung bình cộng")
    median: float = Field(..., description="Trung vị Me = Q2")
    q1: float = Field(..., description="Tứ phân vị thứ nhất Q1")
    q2: float = Field(..., description="Tứ phân vị thứ hai Q2")
    q3: float = Field(..., description="Tứ phân vị thứ ba Q3")
    iqr: float = Field(..., description="Khoảng tứ phân vị Delta_Q = Q3 - Q1")
    range_val: float = Field(..., description="Khoảng biến thiên R = x_max - x_min")
    variance: float = Field(..., description="Phương sai mẫu s^2 (chia cho n theo SGK 10)")
    std_dev: float = Field(..., description="Độ lệch chuẩn s (căn bậc hai của s^2)")
    variance_unbiased: Optional[float] = Field(None, description="Phương sai hiệu chỉnh (chia cho n-1)")
    std_dev_unbiased: Optional[float] = Field(None, description="Độ lệch chuẩn hiệu chỉnh")
    modes: List[float] = Field(default_factory=list, description="Danh sách mốt Mo")
    mode_frequency: Optional[int] = Field(None, description="Tần số của mốt")
    has_mode: bool = Field(True, description="Mẫu có mốt hay không")
    outlier_lower_bound: float = Field(..., description="Ngưỡng dưới: Q1 - 1.5 * Delta_Q")
    outlier_upper_bound: float = Field(..., description="Ngưỡng trên: Q3 + 1.5 * Delta_Q")
    outliers: List[float] = Field(default_factory=list, description="Danh sách các giá trị ngoại lệ")
    frequency_table: List[FrequencyItemOutput] = Field(default_factory=list, description="Bảng phân bố tần số")
    formula_steps: dict = Field(default_factory=dict, description="Các bước tính toán chi tiết kèm công thức KaTeX")

class DatasetCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=150, description="Tên bài toán / mẫu số liệu")
    mode: str = Field(default="simple", description="'simple' (dãy số) hoặc 'frequency' (bảng tần số)")
    raw_data: str = Field(..., description="Chuỗi số liệu thô hoặc JSON tần số")
    notes: Optional[str] = Field(default="", description="Ghi chú về bài toán")

class DatasetUpdate(BaseModel):
    name: Optional[str] = None
    mode: Optional[str] = None
    raw_data: Optional[str] = None
    notes: Optional[str] = None

class DatasetResponse(BaseModel):
    id: str
    name: str
    mode: str
    raw_data: str
    notes: str
    stats: StatsResult
    created_at: str
    updated_at: str

class ComputeStatsRequest(BaseModel):
    mode: str = Field(default="simple", description="'simple' hoặc 'frequency'")
    raw_data: str = Field(..., description="Chuỗi nhập liệu của người dùng")
