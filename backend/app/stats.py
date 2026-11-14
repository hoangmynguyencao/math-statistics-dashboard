import math
import re
import json
from collections import Counter
from typing import List, Tuple, Dict, Any, Optional

def parse_raw_data(raw_data: str, mode: str = "simple") -> List[float]:
    """
    Phân tích chuỗi số liệu từ người dùng thành danh sách các số thực (float).
    Hỗ trợ cả 2 chế độ:
    - simple: Dãy số phân tách bởi dấu chấm phẩy, dấu phẩy, khoảng trắng, xuống dòng.
              Hỗ trợ cả số thập phân dạng dấu chấm (3.14) hoặc dấu phẩy (3,14 khi dùng dấu chấm phẩy phân cách).
    - frequency: Chuỗi JSON hoặc từng dòng dạng 'giá trị, tần số' hoặc 'giá trị: tần số'
    """
    if not raw_data or not raw_data.strip():
        raise ValueError("Dữ liệu đầu vào trống. Vui lòng nhập số liệu.")

    text = raw_data.strip()

    if mode == "frequency":
        # Thử parse dưới dạng JSON
        try:
            data = json.loads(text)
            if isinstance(data, list):
                result = []
                for item in data:
                    val = float(item.get("value", item.get("x", 0)))
                    freq = int(item.get("frequency", item.get("n", item.get("m", 1))))
                    if freq < 0:
                        raise ValueError(f"Tần số không được là số âm: {freq}")
                    result.extend([val] * freq)
                if not result:
                    raise ValueError("Không có giá trị hợp lệ trong bảng tần số.")
                return result
        except json.JSONDecodeError:
            pass

        # Parse dạng từng dòng: "giá trị: tần số" hoặc "giá trị; tần số" hoặc "giá trị, tần số"
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        result = []
        for line in lines:
            # Tách bởi :, ;, hoặc dấu phẩy/khoảng trắng
            parts = re.split(r'[:;\t\s]+', line.strip())
            if len(parts) >= 2:
                try:
                    val_str = parts[0].replace(",", ".")
                    freq_str = parts[1]
                    val = float(val_str)
                    freq = int(float(freq_str))
                    if freq < 0:
                        raise ValueError(f"Tần số không được là số âm: {freq}")
                    result.extend([val] * freq)
                except ValueError:
                    continue
            elif len(parts) == 1:
                # Nếu chỉ có 1 số, coi tần số là 1
                try:
                    val = float(parts[0].replace(",", "."))
                    result.append(val)
                except ValueError:
                    continue
        if not result:
            raise ValueError("Không thể nhận diện định dạng bảng tần số. Vui lòng nhập theo cú pháp: 'Giá trị : Tần số' trên từng dòng.")
        return result

    else:
        # Chế độ Simple (Dãy số liệu không ghép nhóm)
        # Kiểm tra xem có dấu chấm phẩy không: nếu có dấu chấm phẩy, dấu phẩy có thể là số thập phân kiểu Việt Nam (ví dụ: "7,5; 8,0; 9,5")
        if ";" in text:
            raw_tokens = text.split(";")
            numbers = []
            for t in raw_tokens:
                clean = t.strip().replace(",", ".")
                if clean:
                    try:
                        numbers.append(float(clean))
                    except ValueError:
                        pass
            if numbers:
                return numbers

        # Trường hợp chuẩn: dùng regex trích xuất số (hỗ trợ cả số âm, số thập phân)
        # Chuyển dấu phẩy ngăn cách thông thường: nếu text có dạng "5, 6, 7.5, 8.2"
        # Thay thế dấu phẩy bằng khoảng trắng nếu nó không nằm giữa 2 chữ số không có khoảng cách
        normalized = text.replace(",", " ")
        tokens = normalized.split()
        numbers = []
        for token in tokens:
            token = token.strip()
            if not token:
                continue
            try:
                numbers.append(float(token))
            except ValueError:
                raise ValueError(f"Ký tự không hợp lệ: '{token}'. Vui lòng chỉ nhập số hợp lệ.")

        if not numbers:
            raise ValueError("Không tìm thấy giá trị số nào trong dữ liệu.")
        return numbers

def calculate_median(sorted_arr: List[float]) -> Tuple[float, str]:
    """
    Tính trung vị của một dãy đã sắp xếp theo chuẩn Toán 10 KNTT.
    Trả về (giá trị trung vị, mô tả công thức).
    """
    n = len(sorted_arr)
    if n == 0:
        return 0.0, ""
    if n % 2 == 1:
        # n lẻ: n = 2k + 1 => k = (n-1)//2 => phần tử giữa là x_{k+1}
        idx = (n - 1) // 2
        val = sorted_arr[idx]
        explanation = f"Vì n = {n} là số lẻ, trung vị là phần tử thứ \\frac{{{n}+1}}{{2}} = {idx+1}: x_{{{idx+1}}} = {val}"
        return val, explanation
    else:
        # n chẵn: n = 2k => k = n // 2 => trung bình cộng của x_k và x_{k+1}
        idx1 = (n // 2) - 1
        idx2 = n // 2
        val = (sorted_arr[idx1] + sorted_arr[idx2]) / 2.0
        val = round(val, 4)
        explanation = f"Vì n = {n} là số chẵn, trung vị là trung bình cộng của phần tử thứ {idx1+1} và {idx2+1}: \\frac{{{sorted_arr[idx1]} + {sorted_arr[idx2]}}}{{2}} = {val}"
        return val, explanation

def calculate_statistics(raw_data: str, mode: str = "simple") -> Dict[str, Any]:
    """
    Tính toán toàn diện các số đặc trưng của mẫu số liệu theo SGK Toán 10 Kết nối tri thức với cuộc sống.
    """
    values = parse_raw_data(raw_data, mode)
    n = len(values)
    if n == 0:
        raise ValueError("Mẫu số liệu trống.")

    # 1. Dãy số sắp xếp không giảm
    sorted_values = sorted(values)
    min_val = sorted_values[0]
    max_val = sorted_values[-1]
    range_val = round(max_val - min_val, 4)

    # 2. Số trung bình cộng (\bar{x})
    sum_val = sum(sorted_values)
    mean_val = round(sum_val / n, 4)

    # 3. Trung vị Me và Tứ phân vị (Q1, Q2, Q3) theo chuẩn SGK Toán 10 KNTT
    q2_val, q2_exp = calculate_median(sorted_values)
    median_val = q2_val

    if n == 1:
        q1_val = sorted_values[0]
        q3_val = sorted_values[0]
        lower_half = [sorted_values[0]]
        upper_half = [sorted_values[0]]
    elif n % 2 == 1:
        # n lẻ: không tính giá trị trung vị Q2
        k = (n - 1) // 2
        lower_half = sorted_values[:k]
        upper_half = sorted_values[k+1:]
        q1_val, _ = calculate_median(lower_half)
        q3_val, _ = calculate_median(upper_half)
    else:
        # n chẵn: chia đều thành 2 nửa
        k = n // 2
        lower_half = sorted_values[:k]
        upper_half = sorted_values[k:]
        q1_val, _ = calculate_median(lower_half)
        q3_val, _ = calculate_median(upper_half)

    q1_val = round(q1_val, 4)
    q3_val = round(q3_val, 4)
    iqr_val = round(q3_val - q1_val, 4)

    # 4. Mốt (Mo)
    counts = Counter(sorted_values)
    max_freq = max(counts.values())
    if max_freq == 1 and n > 1:
        # Tất cả phần tử đều xuất hiện 1 lần -> không có mốt
        modes = []
        has_mode = False
        mode_frequency = 1
    elif len(counts) > 1 and len(set(counts.values())) == 1:
        # Tất cả các phần tử có tần số bằng nhau (>1) -> không có mốt
        modes = []
        has_mode = False
        mode_frequency = max_freq
    else:
        modes = [val for val, freq in counts.items() if freq == max_freq]
        modes.sort()
        has_mode = True
        mode_frequency = max_freq

    # 5. Phương sai và độ lệch chuẩn
    # Theo SGK 10 KNTT: s^2 = 1/n * sum((x_i - mean)^2)
    sum_sq_diff = sum((x - mean_val) ** 2 for x in sorted_values)
    variance_val = round(sum_sq_diff / n, 4)
    std_dev_val = round(math.sqrt(variance_val), 4)

    # Phương sai hiệu chỉnh (n-1) đối chiếu
    if n > 1:
        variance_unbiased = round(sum_sq_diff / (n - 1), 4)
        std_dev_unbiased = round(math.sqrt(variance_unbiased), 4)
    else:
        variance_unbiased = 0.0
        std_dev_unbiased = 0.0

    # 6. Giá trị ngoại lệ (Outliers)
    # Điều kiện SGK 10: x < Q1 - 1.5 * Delta_Q hoặc x > Q3 + 1.5 * Delta_Q
    lower_bound = round(q1_val - 1.5 * iqr_val, 4)
    upper_bound = round(q3_val + 1.5 * iqr_val, 4)
    outliers = [x for x in sorted_values if x < lower_bound or x > upper_bound]

    # 7. Bảng phân bố tần số & tần suất
    freq_table = []
    for val in sorted(counts.keys()):
        freq = counts[val]
        rel_freq = round((freq / n) * 100, 2)
        freq_table.append({
            "value": val,
            "frequency": freq,
            "relative_freq": rel_freq
        })

    # 8. Chuẩn bị các bước giải chi tiết bằng công thức LaTeX (KaTeX)
    formula_steps = {
        "mean_latex": f"\\bar{{x}} = \\frac{{\\sum_{{i=1}}^{{n}} x_i}}{{n}} = \\frac{{{sum_val}}}{{{n}}} = {mean_val}",
        "median_latex": f"M_e = Q_2 = {median_val}",
        "median_note": q2_exp,
        "q1_latex": f"Q_1 = {q1_val} \\quad (\\text{{Trung vị của nửa dưới: }} [{', '.join(map(str, lower_half))}])",
        "q3_latex": f"Q_3 = {q3_val} \\quad (\\text{{Trung vị của nửa trên: }} [{', '.join(map(str, upper_half))}])",
        "iqr_latex": f"\\Delta_Q = Q_3 - Q_1 = {q3_val} - {q1_val} = {iqr_val}",
        "range_latex": f"R = x_{{max}} - x_{{min}} = {max_val} - {min_val} = {range_val}",
        "variance_latex": f"s^2 = \\frac{{1}}{{n}}\\sum_{{i=1}}^{{n}} (x_i - \\bar{{x}})^2 = \\frac{{{round(sum_sq_diff, 4)}}}{{{n}}} = {variance_val}",
        "std_dev_latex": f"s = \\sqrt{{s^2}} = \\sqrt{{{variance_val}}} = {std_dev_val}",
        "outlier_condition_latex": f"x < Q_1 - 1{,}5\\Delta_Q = {lower_bound} \\quad \\text{{hoặc}} \\quad x > Q_3 + 1{,}5\\Delta_Q = {upper_bound}",
        "mode_latex": f"M_o = {', '.join(map(str, modes))}" if has_mode else "\\text{Không có mốt}"
    }

    return {
        "sample_size": n,
        "sorted_values": sorted_values,
        "min_value": min_val,
        "max_value": max_val,
        "mean": mean_val,
        "median": median_val,
        "q1": q1_val,
        "q2": q2_val,
        "q3": q3_val,
        "iqr": iqr_val,
        "range_val": range_val,
        "variance": variance_val,
        "std_dev": std_dev_val,
        "variance_unbiased": variance_unbiased,
        "std_dev_unbiased": std_dev_unbiased,
        "modes": modes,
        "mode_frequency": mode_frequency,
        "has_mode": has_mode,
        "outlier_lower_bound": lower_bound,
        "outlier_upper_bound": upper_bound,
        "outliers": outliers,
        "frequency_table": freq_table,
        "formula_steps": formula_steps
    }
