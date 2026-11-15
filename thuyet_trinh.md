# 📊 Bảng Điều Khiển Thống Kê Toán 10
## Bài Thuyết Trình Giới Thiệu Dự Án

---

# PHẦN 1
# 🌟 GIỚI THIỆU TỔNG QUAN

---

## Đây là gì?

> **Một trang web miễn phí, chạy trực tiếp trên trình duyệt, giúp học sinh và giáo viên tính toán thống kê theo đúng chương trình Toán 10 (SGK Kết nối tri thức với cuộc sống — GDPT 2018) một cách tự động, chính xác và trực quan.**

Thay vì tính tay từng bước dễ nhầm lẫn, bạn chỉ cần **nhập dãy số liệu** — trang web tự động tính toán và trình bày toàn bộ lời giải với công thức đẹp mắt.

---

## Vấn đề cần giải quyết

| ❌ Cách cũ (tính tay) | ✅ Với trang web này |
|---|---|
| Sắp xếp dãy số thủ công, dễ nhầm | Tự động sắp xếp ngay khi nhập |
| Tính trung vị, tứ phân vị mất nhiều bước | Cho kết quả tức thì, có lời giải từng bước |
| Khó phát hiện số liệu bất thường | Tự động đánh dấu và cảnh báo giá trị ngoại lệ |
| Không có biểu đồ | Biểu đồ hộp & biểu đồ cột tự động |
| Phải tính lại từ đầu mỗi lần | Lưu nhiều bài toán, xem lại bất cứ lúc nào |

---

## Ai có thể dùng?

- 🎓 **Học sinh THPT** — Làm bài tập, kiểm tra kết quả, học công thức
- 👩‍🏫 **Giáo viên** — Soạn ví dụ, kiểm tra đáp án, minh họa trên lớp
- 📱 **Mọi thiết bị** — Máy tính, điện thoại, máy tính bảng

---

# PHẦN 2
# 🛠️ CÔNG NGHỆ & KIẾN TRÚC

---

## Tổng quan kiến trúc — "Nhà có 2 tầng"

```
┌─────────────────────────────────────────────────────────────┐
│                    TRÌNH DUYỆT CỦA BẠN                      │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              TẦNG TRÊN — FRONTEND                   │   │
│   │         (Giao diện người dùng nhìn thấy)            │   │
│   │                                                     │   │
│   │   React 18  •  Tailwind CSS  •  KaTeX  •  Lucide    │   │
│   └────────────────────┬────────────────────────────────┘   │
│                        │ Gửi/nhận dữ liệu qua API           │
│   ┌────────────────────▼────────────────────────────────┐   │
│   │              TẦNG DƯỚI — BACKEND                    │   │
│   │          (Xử lý tính toán & lưu trữ)                │   │
│   │                                                     │   │
│   │          FastAPI (Python)  •  SQLite                │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Tầng trên — Frontend (Giao diện)

> **Frontend = Những gì bạn nhìn thấy và tương tác trên màn hình.**

### ⚛️ React 18
- Thư viện JavaScript phổ biến nhất thế giới để xây dựng giao diện web.
- Giúp giao diện **cập nhật tức thì** mà không cần tải lại trang — khi bạn nhập số, kết quả hiện ngay lập tức.
- Do **Meta (Facebook)** phát triển và duy trì.

### 🎨 Tailwind CSS
- Bộ công cụ thiết kế giúp web **đẹp, gọn và responsive** (hiển thị tốt trên mọi màn hình).
- Tạo ra phong cách **Clean Dashboard** chuyên nghiệp, hỗ trợ cả Light Mode (sáng) và Dark Mode (tối).

### 📐 KaTeX
- Thư viện hiển thị **công thức toán học chuẩn LaTeX** sắc nét, đúng định dạng SGK.
- Thay vì hiện chữ xấu `x_bar = sum/n`, nó hiển thị: $\bar{x} = \dfrac{\sum x_i}{n}$

### 🎯 Lucide React
- Bộ hơn 1.000 icon vector sắc nét, phù hợp với mọi kích thước màn hình.

### 📊 XLSX (SheetJS)
- Thư viện đọc file Excel (`.xlsx`, `.xls`) ngay trong trình duyệt — không cần upload lên server.

---

## Tầng dưới — Backend (Xử lý & Lưu trữ)

> **Backend = "Bếp núc" — người dùng không nhìn thấy nhưng mọi tính toán đều diễn ra ở đây.**

### 🐍 Python + FastAPI
- **Python** là ngôn ngữ lập trình nổi tiếng, dễ đọc, cực mạnh trong tính toán khoa học.
- **FastAPI** là framework Python để xây dựng API — "cầu nối" giữa giao diện và cơ sở dữ liệu.
- Toàn bộ thuật toán thống kê (trung bình, trung vị, tứ phân vị, phương sai...) được tính chính xác ở đây.

### 🗄️ SQLite
- Cơ sở dữ liệu nhỏ gọn, **tích hợp sẵn trong Python** — không cần cài thêm phần mềm nào.
- Lưu trữ tất cả mẫu số liệu bạn đã nhập vào file `database.sqlite` ngay trên server.
- Giống như một "cuốn sổ tay điện tử" lưu trữ vĩnh viễn các bài toán của bạn.

### 📦 uv (Quản lý môi trường Python)
- Công cụ thế hệ mới để quản lý các thư viện Python — **nhanh hơn pip truyền thống ~100 lần**.
- Tự động tạo môi trường ảo (`.venv`) đảm bảo chương trình chạy ổn định trên mọi máy.

---

## Luồng dữ liệu — "Dữ liệu đi đâu khi bạn nhập số?"

```
Bạn nhập số liệu
       │
       ▼
  React (Frontend)
  → Hiển thị preview tức thì (sắp xếp, cỡ mẫu n)
       │
       │  Nhấn "Lưu mẫu số liệu"
       ▼
  FastAPI (Backend)
  → Nhận dữ liệu
  → Chạy thuật toán tính toán thống kê (Python)
  → Lưu vào SQLite
  → Trả kết quả về
       │
       ▼
  React (Frontend)
  → Hiển thị KPI Cards, công thức KaTeX, Biểu đồ
```

---

## Triển khai — "Làm sao web chạy được trên Internet?"

```
┌─────────────┐    push code    ┌─────────────┐    auto deploy   ┌──────────────┐
│   Máy tính  │ ──────────────▶ │   GitHub    │ ───────────────▶ │    Render    │
│  (VS Code)  │                 │ (Kho mã)    │                  │  (Server)    │
└─────────────┘                 └─────────────┘                  └──────────────┘
                                                                        │
                                                                        ▼
                                                               URL công khai:
                                                       math-statistics-dashboard
                                                              .onrender.com
```

| Công cụ | Vai trò | Chi phí |
|---------|---------|---------|
| **GitHub** | Lưu trữ mã nguồn, quản lý phiên bản | Miễn phí |
| **Render** | Chạy web server trên Internet 24/7 | Miễn phí |

---

## Tóm tắt công nghệ

```
📦 DỰ ÁN
│
├── 🖥️  FRONTEND (Giao diện)
│   ├── React 18          → Xây dựng UI động, cập nhật tức thì
│   ├── Tailwind CSS      → Thiết kế đẹp, Responsive, Dark Mode
│   ├── KaTeX             → Hiển thị công thức toán chuẩn SGK
│   ├── Lucide React      → Bộ icon vector chuyên nghiệp
│   └── XLSX (SheetJS)    → Đọc file Excel trong trình duyệt
│
├── ⚙️  BACKEND (Xử lý)
│   ├── Python 3.10+      → Ngôn ngữ lập trình tính toán
│   ├── FastAPI           → API kết nối Frontend & Backend
│   ├── SQLite            → Cơ sở dữ liệu lưu mẫu số liệu
│   └── uv                → Quản lý môi trường Python
│
└── 🚀 TRIỂN KHAI
    ├── GitHub            → Lưu trữ & quản lý mã nguồn
    └── Render            → Hosting miễn phí trên Internet
```

---

# PHẦN 3
# 📖 HƯỚNG DẪN SỬ DỤNG

---

## Giao diện tổng quan

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 Thống Kê Toán 10            [🌙 Dark Mode]  [⚙️ Cài đặt]   │
├──────────────────┬──────────────────────────────────────────────┤
│                  │                                              │
│   SIDEBAR        │            NỘI DUNG CHÍNH                   │
│   (Bên trái)     │            (Bên phải)                        │
│                  │                                              │
│  🏠 Trang chủ    │   ← Nội dung thay đổi tùy tab bạn chọn      │
│  📊 Tổng quan    │                                              │
│  ✏️  Nhập liệu   │                                              │
│  📈 Báo cáo      │                                              │
│                  │                                              │
│  [+ Thêm mới]    │                                              │
│                  │                                              │
│  🗄️ Cơ sở dữ    │                                              │
│     liệu SQLite  │                                              │
└──────────────────┴──────────────────────────────────────────────┘
```

---

## Bước 1 — Mở trang web & Bắt đầu

1. Truy cập link web (ví dụ: `https://math-statistics-dashboard.onrender.com`)
2. Bạn sẽ thấy **Trang chủ** với banner giới thiệu và 6 tính năng nổi bật.
3. Nhấn nút **"NHẤN ĐỂ BẮT ĐẦU THỐNG KÊ"** để vào không gian làm việc.

---

## Bước 2 — Nhập dãy số liệu

### Vào tab "Nhập liệu mới" trên Sidebar bên trái

---

### Cách A: Nhập dãy số thông thường

Chọn chế độ **"Dãy số liệu"**, rồi gõ trực tiếp các số:

```
Ví dụ bài toán: Điểm kiểm tra Toán của 12 học sinh:

  7.5; 8.0; 6.5; 9.0; 8.5; 7.0; 8.0; 9.5; 4.0; 8.5; 1.5; 10.0

👉 Có thể ngăn cách bằng:  dấu phẩy ","  hoặc  chấm phẩy ";"  hoặc  khoảng trắng
```

**Ngay khi gõ**, hệ thống tự động hiện bên dưới:
- ✅ Cỡ mẫu: **n = 12**
- ✅ Dãy sắp xếp không giảm: `1.5; 4.0; 6.5; 7.0; 7.5; 8.0; 8.0; 8.5; 8.5; 9.0; 9.5; 10.0`

---

### Cách B: Nhập bảng phân bố tần số

Chọn chế độ **"Có tần số"**, rồi nhập mỗi dòng theo dạng `Giá trị : Tần số`:

```
Ví dụ: Số con trong mỗi gia đình (40 hộ)

  0: 4
  1: 12
  2: 18
  3: 5
  4: 1

→ Hệ thống tự tính: n = 4 + 12 + 18 + 5 + 1 = 40
```

---

### Cách C: Nhập từ file Excel 📂

1. Nhấn nút **"Nhập từ Excel (.xlsx / .xls)"**
2. Chọn file Excel trên máy tính của bạn
3. Hệ thống **tự động nhận diện** cấu trúc dữ liệu:

```
Dạng CỘT DỌC (thông thường):        Dạng HÀNG NGANG (chuẩn SGK):
┌────┬────┐                          ┌────┬────┬────┬────┬────┐
│ xi │ ni │                          │ xi │ 0  │ 1  │ 2  │ 3  │
├────┼────┤                          ├────┼────┼────┼────┼────┤
│  0 │  4 │                          │ ni │ 4  │ 12 │ 18 │ 5  │
│  1 │ 12 │                          └────┴────┴────┴────┴────┘
│  2 │ 18 │
│  3 │  5 │     ← Cả 2 dạng đều đọc được tự động ✅
└────┴────┘
```

---

## Bước 3 — Lưu mẫu số liệu

1. Nhập **Tên bài toán** (ví dụ: *"Điểm Toán lớp 10A1 - HK1"*)
2. Thêm **Ghi chú** nếu muốn
3. Nhấn nút **"Lưu mẫu số liệu"**

**Sau khi lưu thành công:**

```
✅ Đã lưu thành công!

[Nhập mẫu tiếp theo]    [Xem báo cáo →]
```

- Nhấn **"Nhập mẫu tiếp theo"** → Làm mới form để nhập bài toán khác
- Nhấn **"Xem báo cáo →"** → Chuyển sang xem kết quả phân tích ngay

---

## Bước 4 — Xem kết quả tại tab "Báo cáo & Thống kê"

### 4.1. Mẫu số liệu sau khi nhập

Phần đầu trang hiển thị:

```
📋 DÃY SỐ GỐC:
1.5  4.0  7.0  7.5  8.0  8.0  8.5  8.5  9.0  9.5  10.0
(+ 6.5 bị bỏ sót trong ví dụ — đây là minh họa)

📋 DÃY SỐ SẮP XẾP KHÔNG GIẢM:
1.5  4.0  6.5  7.0  7.5  8.0  8.0  8.5  8.5  9.0  9.5  10.0
 🔴          ← Giá trị ngoại lệ được đánh dấu đỏ

📋 BẢNG PHÂN BỐ TẦN SỐ & TẦN SUẤT

📋 5 SỐ TÓM TẮT:  Min | Q₁ | Q₂ | Q₃ | Max
```

---

### 4.2. Bốn thẻ KPI (Chỉ số chính)

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Cỡ mẫu    │  │  Trung bình │  │   Trung vị  │  │  Khoảng     │
│             │  │             │  │             │  │  tứ phân vị │
│    n = 12   │  │  x̄ = 7.75  │  │  Mₑ = 8.0   │  │  ΔQ = 1.75  │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

---

### 4.3. Cảnh báo giá trị ngoại lệ

Nếu có số liệu bất thường, hệ thống cảnh báo ngay:

```
⚠️  PHÁT HIỆN 2 GIÁ TRỊ NGOẠI LỆ

Điều kiện: x < Q₁ - 1,5×ΔQ  hoặc  x > Q₃ + 1,5×ΔQ
           x < 6.25 - 2.625        x > 8.0 + 2.625
           x < 3.625               x > 10.625

→ Giá trị ngoại lệ tìm được: 1.5 ; 4.0
```

---

### 4.4. Lời giải công thức KaTeX từng bước

Mỗi số đặc trưng được trình bày đầy đủ theo chuẩn SGK:

```
SỐ TRUNG BÌNH CỘNG (x̄)

Công thức:        x̄ = (x₁ + x₂ + ... + xₙ) / n

Thế số:           x̄ = (1.5 + 4.0 + 6.5 + ... + 10.0) / 12
                     = 93.0 / 12

Kết quả:          x̄ ≈ 7.75
```

*(Hiển thị đẹp bằng KaTeX chuẩn LaTeX trong trang web thực)*

**Tính toán đầy đủ cho tất cả:**
- $\bar{x}$ (Số trung bình), $M_e$ (Trung vị)
- $Q_1, Q_2, Q_3$ (Tứ phân vị), $M_o$ (Mốt)
- $R$ (Khoảng biến thiên), $\Delta_Q$ (Khoảng tứ phân vị)
- $s^2$ (Phương sai), $s$ (Độ lệch chuẩn)

---

### 4.5. Biểu đồ hộp (Box Plot)

```
        Q₁      Mₑ     Q₃
         │       │       │
 ○───────┼───────┼───────┼──────────── ─ ─ ─ ─ ○
1.5    6.25    8.0    8.0  10.0              (ngoại lệ)
 🔴                                              🔴

Giải thích:
  ○  = Giá trị ngoại lệ (chấm đỏ)
 ─── = Râu (Whisker): vùng dữ liệu bình thường
 ███ = Thân hộp (Box): chứa 50% dữ liệu trung tâm
  |  = Vạch giữa: Trung vị Mₑ
```

**Rê chuột vào chấm đỏ** để xem giá trị chính xác của điểm ngoại lệ.

---

### 4.6. Biểu đồ cột tần số

```
Tần số
  │
8 │      ████
7 │      ████
6 │      ████
5 │      ████  ████
4 │ ████  ████  ████
3 │ ████  ████  ████
2 │ ████  ████  ████  ████
1 │ ████  ████  ████  ████  ████
  └──────────────────────────────
     1.5   4.0   6.5  7.0 ... 10.0
```

---

## Bước 5 — Quản lý nhiều mẫu số liệu

### Tab "Tổng quan" — Bảng quản lý

```
┌────┬─────────────────────────┬────────┬───────────┬──────────┐
│ #  │ Tên bài toán            │ Cỡ mẫu │ Trung bình│  Thao tác│
├────┼─────────────────────────┼────────┼───────────┼──────────┤
│ 1  │ Điểm Toán lớp 10A1     │  n=12  │  x̄=7.75   │ ✏️ 🗑️   │
│ 2  │ Chiều cao học sinh      │  n=30  │  x̄=165.3  │ ✏️ 🗑️   │
│ 3  │ Số con trong gia đình   │  n=40  │  x̄=1.675  │ ✏️ 🗑️   │
└────┴─────────────────────────┴────────┴───────────┴──────────┘
```

- Nhấp vào dòng bất kỳ → Xem chi tiết mẫu số liệu đó
- **✏️ Sửa** → Chỉnh sửa lại số liệu
- **🗑️ Xóa** → Xóa khỏi cơ sở dữ liệu

### Chuyển đổi nhanh trong trang Báo cáo

```
Đang xem: [Điểm Toán lớp 10A1 ▾]
           ↓ Nhấn để chọn bài toán khác
           ● Điểm Toán lớp 10A1
           ○ Chiều cao học sinh
           ○ Số con trong gia đình
```

---

## Bước 6 — Chuyển Dark Mode / Light Mode

Nhấn nút **🌙** (trên góc phải màn hình) để chuyển giữa chế độ sáng và tối.

---

## Tổng hợp các nút & chức năng chính

| Nút / Vị trí | Chức năng |
|---|---|
| **"NHẤN ĐỂ BẮT ĐẦU THỐNG KÊ"** | Vào không gian làm việc từ Trang chủ |
| **"Thêm mẫu số liệu mới"** (Sidebar) | Làm mới form, bắt đầu nhập bài toán mới |
| **"Nhập từ Excel"** | Đọc dữ liệu tự động từ file .xlsx/.xls |
| **"Lưu mẫu số liệu"** | Lưu vào cơ sở dữ liệu SQLite |
| **"Cập nhật"** | Lưu lại chỉnh sửa của mẫu đã có |
| **"Nhập mẫu tiếp theo"** | Làm mới form sau khi lưu thành công |
| **"Xem báo cáo →"** | Chuyển sang tab Báo cáo & Thống kê |
| **✏️** (icon cây bút) | Sửa mẫu số liệu trong bảng |
| **🗑️** (icon thùng rác) | Xóa mẫu số liệu khỏi cơ sở dữ liệu |
| **⚙️** (icon bánh răng) | Mở cài đặt: xóa toàn bộ dữ liệu, xem công thức |
| **🌙 / ☀️** | Chuyển Dark Mode / Light Mode |

---

# PHẦN 4
# 📐 NỘI DUNG TOÁN HỌC

---

## Các số đặc trưng được tính tự động

### Nhóm 1 — Đo xu thế trung tâm (Dữ liệu tập trung ở đâu?)

| Ký hiệu | Tên | Ý nghĩa |
|---------|-----|---------|
| $\bar{x}$ | Số trung bình cộng | Giá trị "bình quân" của toàn bộ mẫu |
| $M_e$ | Trung vị | Giá trị chính giữa khi sắp xếp tăng dần |
| $Q_1, Q_2, Q_3$ | Tứ phân vị | Chia mẫu thành 4 phần bằng nhau |
| $M_o$ | Mốt | Giá trị xuất hiện nhiều nhất |

### Nhóm 2 — Đo độ phân tán (Dữ liệu trải rộng như thế nào?)

| Ký hiệu | Tên | Ý nghĩa |
|---------|-----|---------|
| $R$ | Khoảng biến thiên | Hiệu số giữa Max và Min |
| $\Delta_Q$ | Khoảng tứ phân vị | Độ rộng của 50% dữ liệu trung tâm |
| $s^2$ | Phương sai | Mức độ phân tán trung bình (bình phương) |
| $s$ | Độ lệch chuẩn | Mức độ phân tán trung bình (cùng đơn vị với dữ liệu) |

---

## Quy tắc phát hiện giá trị ngoại lệ

Một giá trị được gọi là **ngoại lệ (bất thường)** nếu:

$$x < Q_1 - 1{,}5 \times \Delta_Q \quad \text{hoặc} \quad x > Q_3 + 1{,}5 \times \Delta_Q$$

**Ví dụ trực quan:**

```
                    Vùng bình thường
         ◄─────────────────────────────────►
─────────┼──────────┼──────────┼────────────┼─────────
      Q₁-1,5ΔQ     Q₁        Q₃         Q₃+1,5ΔQ

  ○                                                    ○
(ngoại lệ nhỏ)                              (ngoại lệ lớn)
```

---

# PHẦN 5
# 🚀 ĐIỂM NỔI BẬT CỦA DỰ ÁN

---

## So sánh với các công cụ khác

| Tiêu chí | Máy tính cầm tay | Excel | Trang web này |
|----------|-----------------|-------|---------------|
| Tốc độ tính toán | Chậm, nhiều bước | Trung bình | ⚡ Tức thì |
| Lời giải công thức | ❌ Không | ❌ Không | ✅ Có (KaTeX chuẩn SGK) |
| Phát hiện ngoại lệ | ❌ Phải tự tính | ⚠️ Phức tạp | ✅ Tự động, có cảnh báo |
| Biểu đồ hộp (Box Plot) | ❌ Không | ⚠️ Khó vẽ | ✅ Tự động, có đánh dấu |
| Nhập từ Excel | ❌ Không | — | ✅ Hỗ trợ cả cột dọc & hàng ngang |
| Lưu nhiều bài toán | ❌ Không | ⚠️ Thủ công | ✅ Tự động, xem lại bất cứ lúc nào |
| Truy cập từ điện thoại | ❌ Không | ❌ Không | ✅ Responsive mọi màn hình |
| Chi phí | Mua máy | Mua license | 🆓 Miễn phí hoàn toàn |

---

## Điểm đặc biệt về mặt kỹ thuật

- **1 Web Service duy nhất**: Backend FastAPI tự phục vụ cả API lẫn giao diện React — không cần 2 server riêng, không lỗi CORS.
- **SQLite không cần cài thêm**: Cơ sở dữ liệu tích hợp sẵn trong Python, file `.sqlite` nhỏ gọn, dễ backup.
- **uv thay pip**: Cài đặt thư viện Python nhanh hơn ~100 lần, lock file đảm bảo chạy ổn định trên mọi môi trường.
- **Tự động migrate**: Nếu trước dùng CSV, hệ thống tự chuyển sang SQLite khi khởi động lần đầu.
- **Thuật toán chuẩn 100%**: Đúng định nghĩa tứ phân vị theo SGK Toán 10 KNTT 2018 (không phải định nghĩa của Excel hay calculator).

---

## Hành trình phát triển

```
Prompt AI ban đầu (1 lần)
        │
        ▼
   Code khởi tạo
        │
        ▼
Phát hiện & sửa lỗi thực tế
  • Lỗi f-string Python 3.14
  • Lỗi nhận diện Python trên Windows
  • Lỗi chỉ lưu được 1 mẫu số liệu
  • Lỗi đổi tên bài toán
        │
        ▼
Thêm tính năng theo nhu cầu thực tế
  ✅ Homepage giới thiệu
  ✅ Nhập Excel đa định dạng (cột dọc + hàng ngang)
  ✅ Giao diện 3 tab riêng biệt
  ✅ Chuyển CSV → SQLite
  ✅ Dùng uv quản lý Python
        │
        ▼
   Phiên bản hoàn chỉnh ✨
```

---

# KẾT LUẬN

> Dự án chứng minh rằng **AI có thể giúp tạo ra phần mềm giáo dục chất lượng cao** chỉ từ một câu prompt mô tả yêu cầu — không cần biết lập trình từ đầu.
>
> Từ ý tưởng → Trang web chạy được trên Internet: **trong vài giờ, với chi phí bằng 0**.

---

**🔗 Mã nguồn mở:** https://github.com/hoangmynguyencao/math-statistics-dashboard

**🌐 Truy cập trực tuyến:** https://math-statistics-dashboard.onrender.com

---

*Dự án phục vụ mục đích giáo dục, phi thương mại — Tự do sử dụng, chỉnh sửa và chia sẻ.*
