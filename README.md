# 📊 Bảng Điều Khiển Nhập Liệu & Thống Kê Tự Động (Toán 10 GDPT 2018)

> **Website ứng dụng web hiện đại (Clean Dashboard) phục vụ học tập, giảng dạy và nghiên cứu thống kê mẫu số liệu không ghép nhóm theo chương trình GDPT 2018 (SGK Toán 10 - Bộ Kết nối tri thức với cuộc sống).**

---

## 📑 Mục Lục
1. [Giới thiệu tổng quan & Tính năng](#1-giới-thiệu-tổng-quan--tính-năng)
2. [Hướng dẫn từng bước tạo ra trang web từ đầu](#2-hướng-dẫn-từng-bước-tạo-ra-trang-web-từ-đầu)
   - [Bước 1: Xác định yêu cầu & Chuẩn kiến thức Toán 10](#bước-1-xác-định-yêu-cầu--chuẩn-kiến-thức-toán-10)
   - [Bước 2: Câu Prompt ban đầu để yêu cầu AI viết code](#bước-2-câu-prompt-ban-đầu-để-yêu-cầu-ai-viết-code)
   - [Bước 3: Thiết kế kiến trúc & Cấu trúc thư mục dự án](#bước-3-thiết-kế-kiến-trúc--cấu-trúc-thư-mục-dự-án)
   - [Bước 4: Cài đặt và chạy thử trên máy tính (Local)](#bước-4-cài-đặt-và-chạy-thử-trên-máy-tính-local)
   - [Bước 5: Hướng dẫn đưa mã nguồn lên GitHub](#bước-5-hướng-dẫn-đưa-mã-nguồn-lên-github)
   - [Bước 6: Hướng dẫn Deploy miễn phí lên Render (onrender.com)](#bước-6-hướng-dẫn-deploy-miễn-phí-lên-render-onrendercom)
3. [Hướng dẫn sử dụng trang web chi tiết](#3-hướng-dẫn-sử-dụng-trang-web-chi-tiết)
4. [Chuẩn kiến thức Toán 10 áp dụng](#4-chuẩn-kiến-thức-toán-10-áp-dụng)
5. [Giấy phép & Tác quyền](#5-giấy-phép--tác-quyền)

---

## 1. Giới thiệu tổng quan & Tính năng

Trang web được thiết kế theo phong cách **Clean Dashboard** hiện đại, trực quan, tối ưu cho giáo viên, học sinh THPT và người nghiên cứu thống kê dữ liệu:

- **Giao diện chuẩn Dashboard**: Sidebar điều hướng thanh lịch, hỗ trợ **Light Mode & Dark Mode** tức thời.
- **Phân chia không gian làm việc chuyên biệt**:
  - **Trang chủ**: Giới thiệu tổng quan, hình ảnh minh họa, nút bắt đầu thống kê.
  - **Tổng quan**: Hiển thị nội dung cơ bản của mẫu số liệu và danh sách quản lý các bài toán đã lưu.
  - **Nhập liệu mới**: Chỉ hiển thị form nhập số liệu (thủ công hoặc Excel) và nút **"Lưu mẫu số liệu"**.
  - **Báo cáo & Thống kê**: Hiển thị chi tiết mẫu số liệu cùng toàn bộ báo cáo phân tích, công thức và biểu đồ.
- **Biểu diễn công thức Toán học KaTeX**: Chuẩn LaTeX sắc nét, trình bày từng bước thế số và giải thích chi tiết theo đúng SGK Toán 10.
- **Hỗ trợ nhập linh hoạt**:
  - Nhập dãy số tự do (ngăn cách bằng dấu phẩy, chấm phẩy, khoảng trắng).
  - Nhập bảng phân bố tần số (cặp giá trị $x_i$ : tần số $n_i$).
  - Nhập trực tiếp từ file **Excel** (`.xlsx`, `.xls`) — hỗ trợ cả dạng **cột dọc** lẫn **hàng ngang** (chuẩn SGK Toán 10).
- **Trực quan hóa đồ thị**:
  - **Biểu đồ hộp (Box Plot)**: Tóm tắt 5 số đặc trưng ($Min, Q_1, Q_2, Q_3, Max$) và **làm nổi bật giá trị ngoại lệ** bằng chấm đỏ.
  - **Biểu đồ cột tần số (Frequency Bar Chart)**: Trực quan hóa phân bố tần số các phần tử.
- **Lưu trữ SQLite vĩnh viễn**: Dữ liệu lưu xuống cơ sở dữ liệu SQLite (tích hợp sẵn trong Python), hỗ trợ lưu nhiều mẫu số liệu — không cần cài thêm phần mềm cơ sở dữ liệu ngoài.
- **Quản lý danh sách mẫu số liệu linh hoạt**:
  - Hiển thị bảng danh sách tất cả các bài toán đã lưu kèm công cụ tìm kiếm, lọc theo phân loại và sắp xếp.
  - **Chỉnh sửa từng mẫu số liệu**: Nhấn nút Sửa để tải dữ liệu vào form và cập nhật lại.
  - **Xóa từng mẫu số liệu**: Nhấn nút Xóa ở từng dòng để xóa riêng mẫu đó.
  - **Xóa đồng thời nhiều mẫu số liệu (Batch Delete)**: Tích chọn checkbox ở từng dòng hoặc checkbox "Chọn tất cả" trên thanh tiêu đề, sau đó nhấn nút "Xóa các mẫu đã chọn" trên thanh thao tác hàng loạt.
- **Quản lý Python với uv**: Backend sử dụng `uv` — trình quản lý môi trường & gói Python thế hệ mới, nhanh hơn pip ~10–100 lần, có lock file chính xác.

---

## 2. Hướng dẫn từng bước tạo ra trang web từ đầu

### Bước 1: Xác định yêu cầu & Chuẩn kiến thức Toán 10
Dự án được xây dựng với mục tiêu giúp học sinh cấp 3 và giáo viên giải quyết các bài toán Thống kê không ghép nhóm của **SGK Toán 10 (Bộ Kết nối tri thức với cuộc sống - GDPT 2018)**. Hệ thống cần tính toán chính xác:
- **Số đặc trưng đo xu thế trung tâm**: Số trung bình ($\bar{x}$), Trung vị ($M_e$), Tứ phân vị ($Q_1, Q_2, Q_3$), Mốt ($M_o$).
- **Số đặc trưng đo độ phân tán**: Khoảng biến thiên ($R$), Khoảng tứ phân vị ($\Delta_Q$), Phương sai ($s^2$), Độ lệch chuẩn ($s$), Phương sai hiệu chỉnh ($s_{n-1}^2$).
- **Phát hiện giá trị ngoại lệ**: Quy tắc $x < Q_1 - 1{,}5\Delta_Q$ hoặc $x > Q_3 + 1{,}5\Delta_Q$.

---

### Bước 2: Câu Prompt ban đầu để yêu cầu AI viết code

Dưới đây là toàn bộ nội dung câu prompt hoàn chỉnh đã được sử dụng để yêu cầu AI sinh mã nguồn cho toàn bộ dự án:

```text
Hãy thiết kế và viết code hoàn chỉnh (React và Tailwind CSS cho frontend, Python cho backend,
lưu dữ liệu xuống cơ sở dữ liệu SQLite, dùng uv để quản lý Python) cho một website dạng
"Bảng điều khiển nhập liệu và thống kê tự động" dành cho học sinh cấp 3 sử dụng, có giao
diện hiện đại, tối giản, đẹp mắt (phong cách Clean Dashboard). Ưu tiên sử dụng Lucide React
cho icon và KaTeX để hiển thị công thức toán học đẹp mắt.

Yêu cầu cụ thể như sau:

1. Giao diện & Bố cục (Dashboard Layout):
- Bố cục gồm 2 phần chính: Sidebar (thanh điều khiển bên trái) và Main Content (vùng làm
  việc chính bên phải).
- Gam màu chủ đạo: Tông sáng (Light mode) chuyên nghiệp có nút chuyển Dark mode (Chế độ tối).
- Sử dụng các icon trực quan (Lucide React), bo góc mềm mại (rounded-xl), hiệu ứng đổ bóng
  nhẹ (shadow-sm).
- Có một Trang chủ (Homepage) giới thiệu tổng quan với banner đồ họa toán học, lưới tính
  năng nổi bật và nút "NHẤN ĐỂ BẮT ĐẦU THỐNG KÊ" to rõ. Không nạp sẵn bất kỳ mẫu số
  liệu nào — cơ sở dữ liệu bắt đầu hoàn toàn trống.

2. Thanh điều khiển (Sidebar / Control Panel):
- Các mục điều hướng riêng biệt gồm 4 tab chuyên biệt:
  + Trang chủ: Màn hình giới thiệu.
  + Tổng quan: Hiển thị nội dung cơ bản của mẫu số liệu (Header tóm tắt, 4 thẻ KPI,
    dãy số tăng dần) và Bảng danh sách quản lý tất cả bài toán đã lưu.
  + Nhập liệu mới: Chỉ hiển thị duy nhất form nhập liệu, không có gì khác.
  + Báo cáo & Thống kê: Hiển thị toàn bộ báo cáo phân tích chi tiết.
- Có nút "Thêm mẫu số liệu mới" nổi bật ở Sidebar.
- Phần dưới Sidebar hiển thị trạng thái cơ sở dữ liệu SQLite.

3. Khu vực nhập liệu (Data Entry Form — Tab "Nhập liệu mới"):
- Hỗ trợ 2 chế độ nhập:
  + Dãy số liệu: Nhập trực tiếp từng giá trị hoặc danh sách dãy số cách nhau bởi dấu
    phẩy / chấm phẩy / khoảng trắng.
  + Có tần số: Nhập cặp Giá trị x_i và Tần số n_i (mỗi dòng một cặp, cách nhau bởi dấu
    hai chấm hoặc tab).
- Kèm trường Tên bài toán/Mẫu số liệu và Ghi chú.
- Tính năng tự động: Hệ thống tự động xác định cỡ mẫu n, sắp xếp và hiển thị dãy số
  liệu theo thứ tự không giảm (x_1 ≤ x_2 ≤ ... ≤ x_n) ngay khi nhập.
- Nút "Lưu mẫu số liệu": Lưu ngay vào cơ sở dữ liệu SQLite và tự động cập nhật thống
  kê lập tức. Sau khi lưu hiển thị thông báo "Đã lưu thành công!" kèm nút "Nhập mẫu
  tiếp theo" và nút "Xem báo cáo →".
- Nút nhãn tự động thay đổi: "Lưu mẫu số liệu" khi tạo mới, "Cập nhật" khi đang
  chỉnh sửa mẫu cũ.
- Hỗ trợ nhập từ file Excel (.xlsx / .xls) qua nút "Nhập từ Excel" với thuật toán
  tự động nhận diện cả 2 định dạng:
  + Dãy số liệu: Cột dọc (cột A) hoặc hàng ngang hoặc bảng lưới nhiều hàng nhiều cột.
  + Bảng tần số dạng cột dọc: Cột A là x_i, Cột B là n_i.
  + Bảng tần số dạng hàng ngang (chuẩn SGK Toán 10): Hàng trên là x_i, hàng dưới là n_i.

4. Khu vực Báo cáo & Thống kê (Tab "Báo cáo & Thống kê"):
Áp dụng chuẩn kiến thức Toán 10 (SGK Kết nối tri thức với cuộc sống) để tính toán và
hiển thị:

4a. Mẫu số liệu sau khi nhập:
- Dãy số gốc được nhập.
- Dãy số sắp xếp không giảm, đánh dấu nổi bật các giá trị ngoại lệ bằng màu đỏ.
- Bảng phân bố tần số & tần suất.
- 5 số tóm tắt (Min, Q_1, Q_2, Q_3, Max).

4b. Báo cáo phân tích:
- 4 Thẻ KPI nổi bật: Cỡ mẫu (n), Số trung bình (\bar{x}), Trung vị (M_e), Khoảng tứ
  phân vị (\Delta_Q).
- Cảnh báo giá trị ngoại lệ nổi bật (nếu có), hiển thị rõ điều kiện xác định.
- Thống kê chi tiết với công thức KaTeX từng bước (công thức tổng quát + phép thế số
  thực tế) cho tất cả các số đặc trưng:
  + Đo xu thế trung tâm: \bar{x}, M_e, Q_1/Q_2/Q_3, M_o.
  + Đo độ phân tán: R, \Delta_Q, s^2, s, s_{n-1}^2.
- Biểu đồ hộp (Box Plot) SVG thuần: Trực quan hóa Min, Q_1, Q_2, Q_3, Max và tự động
  đánh dấu giá trị ngoại lệ bằng chấm đỏ có thể rê chuột xem giá trị.
- Biểu đồ cột tần số (Frequency Bar Chart): Phân bố tần số các phần tử.
- Bộ chọn nhanh chuyển đổi giữa các mẫu số liệu đã lưu ngay trong trang báo cáo.

4c. Quản lý danh sách mẫu số liệu (Tab "Tổng quan" — DataTable):
- Hiển thị toàn bộ các mẫu số liệu đã lưu dưới dạng bảng danh sách có tìm kiếm, lọc, sắp xếp.
- Hỗ trợ chỉnh sửa từng mẫu số liệu (nút Sửa) để nạp lại vào form chỉnh sửa.
- Hỗ trợ xóa từng mẫu số liệu (nút Xóa ở mỗi dòng).
- Hỗ trợ chọn đồng thời nhiều mẫu số liệu bằng checkbox (ở từng dòng hoặc chọn tất cả)
  và hiển thị thanh công cụ hàng loạt để xóa đồng thời tất cả các mẫu đã chọn (Batch Delete).

5. Lưu trữ dữ liệu — Backend FastAPI + SQLite:
- Backend: Python + FastAPI, RESTful API (GET/POST/PUT/DELETE /api/datasets, POST /api/datasets/batch-delete).
- Lưu trữ: SQLite qua module sqlite3 tích hợp sẵn trong Python (không cần cài thêm).
- File cơ sở dữ liệu: backend/data/database.sqlite, tự động tạo khi khởi động lần đầu.
- Quản lý môi trường Python bằng uv: pyproject.toml khai báo dependencies, uv.lock
  ghi chính xác phiên bản từng gói.
- Chế độ Production: FastAPI tự phục vụ file tĩnh React build từ frontend/dist
  (không cần web server riêng, không lỗi CORS).

6. Trải nghiệm người dùng (UX) & Triển khai:
- Thiết kế Responsive (hiển thị tốt trên máy tính lẫn điện thoại).
- Code gọn gàng, chú thích rõ ràng, cấu trúc thư mục chuẩn.
- File run_local.bat (Windows) chạy 1-click: tự động cài uv nếu chưa có, chạy
  uv sync để tạo .venv, khởi động cả backend lẫn frontend cùng lúc.
- File build.sh và render.yaml để deploy miễn phí lên Render (onrender.com) chỉ
  với 1 Web Service duy nhất.
- Hướng dẫn đầy đủ trong README.md: prompt AI, cài đặt local, đưa lên GitHub,
  deploy lên Render.

Yêu cầu bổ sung:
- Python phải tương thích 3.10 trở lên (đặc biệt chú ý cú pháp f-string với ký tự
  đặc biệt như {,} trong chuỗi KaTeX — phải escape thành {{,}}).
- Không có nút xuất CSV hay bất kỳ chức năng xuất file nào.
- Không nạp sẵn dữ liệu mẫu khi khởi động (cơ sở dữ liệu rỗng hoàn toàn).
- Mọi văn bản giao diện đều bằng tiếng Việt.
```

---

### Bước 3: Thiết kế kiến trúc & Cấu trúc thư mục dự án

Hệ thống được tổ chức theo mô hình **Monorepo kết hợp**:
- **Frontend**: Single Page Application với React 18, Vite, Tailwind CSS, Lucide React, XLSX và KaTeX.
- **Backend**: FastAPI (Python), RESTful API, lưu trữ dữ liệu bằng SQLite (tích hợp sẵn trong Python).
- **Quản lý Python**: `uv` — trình quản lý môi trường & gói Python hiện đại (thay thế pip/venv).
- **Chế độ triển khai kép**:
  - *Cục bộ (Local)*: Chạy song song React dev server (`:5173`) và FastAPI (`:8000`).
  - *Xuất bản (Production / Render)*: FastAPI tự động phục vụ các file tĩnh đã build của React từ `frontend/dist`. Toàn bộ ứng dụng chạy trên **1 Web Service duy nhất**, không gặp lỗi CORS và hoàn toàn miễn phí.

```
mathapp/
├── backend/
│   ├── app/
│   │   ├── __init__.py         # Package module
│   │   ├── config.py           # Thiết lập đường dẫn SQLite, PORT, CORS
│   │   ├── models.py           # Pydantic schemas kiểm tra kiểu dữ liệu
│   │   ├── stats.py            # Thuật toán toán học chuẩn SGK Toán 10 KNTT
│   │   ├── storage.py          # Thao tác đọc/ghi/cập nhật/xóa cơ sở dữ liệu SQLite
│   │   └── main.py             # FastAPI App & phục vụ file tĩnh React build
│   └── data/
│       └── database.sqlite     # Cơ sở dữ liệu SQLite (tự động tạo khi chạy lần đầu)
├── frontend/
│   ├── public/
│   │   ├── homepage-banner.svg # Banner đồ họa toán học cho trang chủ
│   │   └── favicon.svg         # Icon ứng dụng
│   ├── src/
│   │   ├── components/
│   │   │   ├── Homepage.jsx           # Trang chủ giới thiệu & nút bắt đầu
│   │   │   ├── Sidebar.jsx            # Thanh điều khiển bên trái
│   │   │   ├── Header.jsx             # Thanh tiêu đề trên
│   │   │   ├── KPICards.jsx           # 4 Thẻ chỉ số nổi bật
│   │   │   ├── DataEntryForm.jsx      # Form nhập liệu (Thủ công & Excel)
│   │   │   ├── DataTable.jsx          # Bảng quản lý dữ liệu (Checkbox, sửa, xóa, xóa đồng thời)
│   │   │   ├── StatisticsSummary.jsx  # Công thức & lời giải KaTeX
│   │   │   ├── BoxPlotChart.jsx       # Biểu đồ hộp & điểm ngoại lệ
│   │   │   ├── FrequencyChart.jsx     # Biểu đồ cột tần số
│   │   │   ├── MathFormula.jsx        # Component render KaTeX
│   │   │   └── SettingsModal.jsx      # Modal cài đặt & hướng dẫn
│   │   ├── utils/
│   │   │   └── statsCalculator.js     # Thuật toán tính toán phía client
│   │   ├── App.jsx             # Root Component điều phối routing & trạng thái
│   │   ├── index.css           # Cấu hình Tailwind CSS & Custom scrollbar
│   │   └── main.jsx            # Điểm bắt đầu của React
│   ├── package.json            # Cấu hình thư viện frontend (xlsx, lucide, katex)
│   ├── tailwind.config.js      # Thiết lập theme, màu sắc, Dark mode
│   └── vite.config.js          # Cấu hình Vite build & dev server
├── pyproject.toml              # Cấu hình dự án Python (uv / PEP 517)
├── uv.lock                     # Lock file phiên bản chính xác các gói Python
├── requirements.txt            # Danh sách gói Python (dùng khi deploy Render)
├── build.sh                    # Script tự động build trên Render (cài uv + npm build)
├── render.yaml                 # Cấu hình triển khai Render
├── run_local.bat               # File chạy nhanh 1-click trên Windows (dùng uv)
└── README.md                   # Tài liệu hướng dẫn hoàn chỉnh
```

---

### Bước 4: Cài đặt và chạy thử trên máy tính (Local)

#### 4.1. Yêu cầu môi trường
- **Python**: Phiên bản 3.10 trở lên ([Tải Python](https://www.python.org/downloads/))
- **uv**: Trình quản lý môi trường Python hiện đại ([Tài liệu uv](https://docs.astral.sh/uv/))
- **Node.js**: Phiên bản 18 trở lên ([Tải Node.js](https://nodejs.org/))
- **Git**: ([Tải Git](https://git-scm.com/))

#### 4.2. Cài đặt uv (lần đầu)

**Trên Windows (PowerShell):**
```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**Trên macOS / Linux:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Khởi động lại terminal sau khi cài để `uv` được nhận diện trong PATH.

#### 4.3. Cách 1: Chạy nhanh 1-click (Khuyên dùng — Windows)
Nhấp đúp chuột vào file **`run_local.bat`**. Script tự động:
1. Kiểm tra và cài `uv` nếu chưa có.
2. Chạy `uv sync` — tạo virtual environment `.venv` và cài đặt tất cả dependencies backend.
3. Kiểm tra Node.js, cài npm packages cho frontend.
4. Mở Backend (`:8000`) và Frontend (`:5173`) trong hai cửa sổ terminal riêng.

#### 4.4. Cách 2: Khởi chạy thủ công từng phần

**Cửa sổ Terminal 1 — Backend (FastAPI + uv):**
```bash
# Tại thư mục gốc dự án (mathapp/)
uv sync                                                            # Tạo .venv & cài gói
uv run uvicorn backend.app.main:app --reload --port 8000
```
- API Backend: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`

**Cửa sổ Terminal 2 — Frontend (React Vite):**
```bash
cd frontend
npm install
npm run dev
```
- Mở trình duyệt: **`http://localhost:5173`**

> **Lưu ý**: File `backend/data/database.sqlite` tự động tạo khi khởi động backend lần đầu — không cần cài thêm phần mềm cơ sở dữ liệu nào.

---

### Bước 5: Hướng dẫn đưa mã nguồn lên GitHub

1. Truy cập [github.com](https://github.com) → Tạo Repository mới (ví dụ: `math-statistics-dashboard`), chọn **Public**, không tick "Add a README file".
2. Mở terminal tại thư mục dự án:
```bash
# 1. Khởi tạo kho Git
git init

# 2. Thêm tất cả file vào staging
git add .

# 3. Tạo commit đầu tiên
git commit -m "feat: Khoi tao du an Bang dieu khien Thong ke Toan 10"

# 4. Đặt tên nhánh chính là main
git branch -M main

# 5. Liên kết tới GitHub (thay URL bằng repo của bạn)
git remote add origin https://github.com/<tai-khoan-cua-ban>/math-statistics-dashboard.git

# 6. Đẩy mã nguồn lên GitHub
git push -u origin main
```

---

### Bước 6: Hướng dẫn Deploy miễn phí lên Render (onrender.com)

1. Đăng nhập [render.com](https://render.com) bằng tài khoản GitHub.
2. Nhấn **New +** → Chọn **Web Service**.
3. Chọn repo `math-statistics-dashboard` → nhấn **Connect**.
4. Điền các thông số sau:

   | Trường | Giá trị |
   |--------|---------|
   | **Name** | `math-statistics-dashboard` |
   | **Region** | `Singapore` |
   | **Branch** | `main` |
   | **Runtime** | `Python 3` |
   | **Build Command** | `./build.sh` |
   | **Start Command** | `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT` |
   | **Instance Type** | `Free` |

5. Cuộn xuống **Environment Variables** → thêm:

   | Key | Value |
   |-----|-------|
   | `PYTHON_VERSION` | `3.13.0` |
   | `NODE_VERSION` | `20.10.0` |

6. Nhấn **Create Web Service**. Sau 3–5 phút build, ứng dụng có URL công khai dạng `https://math-statistics-dashboard.onrender.com`.

> **"No existing services" tại Region Singapore** — Bình thường, không phải lỗi. Render chỉ hiển thị vậy khi bạn chưa có service nào tại vùng đó; cứ tiếp tục tạo mới.

> **PYTHON_VERSION** — Phiên bản Python trên máy cá nhân không cần trùng khớp với giá trị này. Render dùng phiên bản riêng của nó để build; dự án tương thích với Python 3.10 trở lên.

---

## 3. Hướng dẫn sử dụng trang web chi tiết

### 3.1. Bắt đầu từ Trang chủ
- Khi mở ứng dụng lần đầu, bạn sẽ ở **Trang chủ**.
- Nhấn nút **"NHẤN ĐỂ BẮT ĐẦU THỐNG KÊ"** để vào không gian làm việc.

---

### 3.2. Nhập dãy số liệu thủ công
1. Vào mục **"Nhập liệu mới"** trên Sidebar bên trái.
2. Nhập **Tên bài toán / Tên mẫu số liệu** (ví dụ: *Điểm kiểm tra giữa kì môn Toán 10*).
3. Chọn chế độ **"Dãy số liệu"**.
4. Nhập các số vào ô nội dung — dùng dấu phẩy `,`, dấu chấm phẩy `;` hoặc khoảng trắng:
   ```
   7.5; 8.0; 6.5; 9.0; 8.5; 7.0; 8.0; 9.5; 4.0; 8.5; 1.5; 10.0
   ```
5. Hệ thống tự động cập nhật cỡ mẫu $n$ và sắp xếp dãy số tăng dần bên dưới.
6. Nhấn **"Lưu mẫu số liệu"**.

---

### 3.3. Nhập bảng phân bố tần số
1. Tại form nhập liệu, chọn chế độ **"Có tần số"**.
2. Nhập mỗi dòng là một cặp `Giá trị : Tần số`:
   ```
   0: 4
   1: 12
   2: 18
   3: 5
   4: 1
   ```
3. Hệ thống tự động tính tổng $n = 4 + 12 + 18 + 5 + 1 = 40$ và giải phóng các giá trị tương ứng.

---

### 3.4. Nhập số liệu từ file Excel (Hỗ trợ cả Cột dọc & Hàng ngang)
1. Nhấn nút **"Nhập từ Excel (.xlsx / .xls)"** trên form nhập liệu.
2. Chọn file Excel từ máy tính:
   - **Chế độ Dãy số liệu**:
     + *Dạng cột dọc*: Cột A chứa danh sách số từ trên xuống (hàng 1 tiêu đề tự động bỏ qua).
     + *Dạng hàng ngang*: Một hàng chứa các số qua các cột, hoặc bảng lưới nhiều hàng nhiều cột.
   - **Chế độ Bảng tần số**:
     + *Dạng cột dọc*: Cột A là Giá trị ($x_i$), Cột B là Tần số ($n_i$).
     + *Dạng hàng ngang (Chuẩn SGK Toán 10)*: Hàng trên là Giá trị ($x_i$), hàng dưới là Tần số ($n_i$).
3. Hệ thống tự động nhận diện cấu trúc và điền dữ liệu vào form lập tức.

---

### 3.5. Lưu trữ và quản lý mẫu số liệu theo danh sách (Sửa / Xóa đơn / Xóa đồng thời)
- Sau khi nhấn **"Lưu mẫu số liệu"** thành công, thông báo **"Đã lưu thành công!"** xuất hiện kèm nút **"Nhập mẫu tiếp theo"** và **"Xem báo cáo →"**.
- Nhấn **"Nhập mẫu tiếp theo"** (hoặc **"Thêm mẫu số liệu mới"** ở góc trên form) để làm mới form và nhập bài toán tiếp theo.
- Toàn bộ bài toán đã lưu được hiển thị tại bảng danh sách ở tab **Tổng quan**:
  - **Xem chi tiết**: Nhấp vào biểu tượng con mắt (hoặc dòng mẫu) để chọn xem bài toán trên dashboard.
  - **Chỉnh sửa từng mẫu số liệu**: Nhấn nút **Sửa** (icon cây bút ✏️) ở dòng tương ứng. Số liệu sẽ được nạp lại vào form nhập liệu và nút bấm chuyển thành **"Cập nhật"** để bạn lưu lại thay đổi mà không tạo mẫu trùng lặp.
  - **Xóa từng mẫu số liệu**: Nhấn nút **Xóa** (icon thùng rác 🗑️) ở cột Thao tác của dòng đó để xóa riêng bài toán khỏi SQLite sau khi xác nhận.
  - **Xóa đồng thời nhiều mẫu số liệu (hoặc tất cả)**:
    + Tích chọn ô vuông checkbox ở đầu mỗi dòng mẫu số liệu muốn xóa.
    + Hoặc tích ô checkbox trên thanh tiêu đề bảng để **chọn tất cả** các mẫu trong danh sách hiện tại.
    + Khi có ít nhất 1 mẫu được chọn, **Thanh thao tác hàng loạt** màu xanh tím sẽ hiện lên ở trên bảng, hiển thị rõ số lượng mẫu đã chọn (ví dụ: *"3 mẫu đã chọn"*), kèm nút **"Bỏ chọn tất cả"** và nút **"Xóa {n} mẫu đã chọn"** (màu đỏ).
    + Nhấn **"Xóa {n} mẫu đã chọn"** và xác nhận trên hộp thoại để xóa đồng thời toàn bộ các mẫu đã chọn khỏi cơ sở dữ liệu SQLite trong một thao tác duy nhất.
- Để làm sạch toàn bộ cơ sở dữ liệu: Vào **Cài đặt** (icon bánh răng trên Sidebar) → **"Làm sạch cơ sở dữ liệu"**.

---

### 3.6. Xem báo cáo thống kê & Lời giải công thức KaTeX
1. Nhấp vào **"Báo cáo & Thống kê"** trên Sidebar (hoặc nút **"Xem báo cáo →"** sau khi lưu).
2. Tại đây bạn thấy:
   - **Mẫu số liệu sau nhập**: Dãy số gốc, dãy số sắp xếp không giảm (giá trị ngoại lệ tô đỏ), bảng tần số và 5 số tóm tắt ($Min, Q_1, Q_2, Q_3, Max$).
   - **4 Thẻ KPI**: Cỡ mẫu $n$, Trung bình $\bar{x}$, Trung vị $M_e$, Khoảng tứ phân vị $\Delta_Q$.
   - **Cảnh báo giá trị ngoại lệ** (nếu có), hiển thị rõ điều kiện xác định.
   - **Bảng công thức KaTeX chi tiết**: Công thức tổng quát + phép thế số thực tế, đúng chuẩn Toán 10.
3. Dùng **bộ chọn mẫu số liệu** ở đầu trang để chuyển đổi nhanh giữa các bài toán đã lưu.

---

### 3.7. Đọc hiểu Biểu đồ hộp (Box Plot) & Phát hiện giá trị ngoại lệ
- **Thân hộp (Box)**: Kéo dài từ $Q_1$ đến $Q_3$, chứa 50% dữ liệu trung tâm.
- **Vạch kẻ giữa hộp**: Trung vị $M_e = Q_2$.
- **Hai râu (Whiskers)**: Nối từ thân hộp tới giá trị nhỏ nhất và lớn nhất trong ngưỡng an toàn.
- **Điểm tròn màu đỏ**: Các **giá trị ngoại lệ** thỏa $x < Q_1 - 1{,}5\Delta_Q$ hoặc $x > Q_3 + 1{,}5\Delta_Q$. Rê chuột vào điểm để xem giá trị chính xác.

---

## 4. Chuẩn kiến thức Toán 10 áp dụng

Hệ thống tuân thủ 100% định nghĩa và quy ước của **SGK Toán 10 (Bộ Kết nối tri thức với cuộc sống)**:

### 4.1. Sắp xếp dãy số liệu
$$x_1 \le x_2 \le \dots \le x_n$$

### 4.2. Các số đặc trưng đo xu thế trung tâm
- **Số trung bình cộng ($\bar{x}$)**:
  $$\bar{x} = \frac{1}{n} \sum_{i=1}^n x_i = \frac{m_1 x_1 + m_2 x_2 + \dots + m_k x_k}{n}$$

- **Trung vị ($M_e$)**:
  - $n$ lẻ ($n = 2k+1$): $M_e = x_{k+1}$
  - $n$ chẵn ($n = 2k$): $M_e = \dfrac{x_k + x_{k+1}}{2}$

- **Tứ phân vị ($Q_1, Q_2, Q_3$)**:
  - $Q_2 = M_e$
  - $Q_1$ = trung vị của nửa dưới; $Q_3$ = trung vị của nửa trên (không gồm $Q_2$ khi $n$ lẻ).

- **Mốt ($M_o$)**: Giá trị có tần số xuất hiện lớn nhất.

### 4.3. Các số đặc trưng đo độ phân tán
$$R = x_{max} - x_{min} \qquad \Delta_Q = Q_3 - Q_1$$
$$s^2 = \frac{1}{n}\sum_{i=1}^n (x_i - \bar{x})^2 \qquad s = \sqrt{s^2}$$

### 4.4. Quy tắc xác định giá trị ngoại lệ
$$x < Q_1 - 1{,}5\Delta_Q \quad \text{hoặc} \quad x > Q_3 + 1{,}5\Delta_Q$$

---

## 5. Giấy phép & Tác quyền
Dự án được xây dựng phục vụ mục đích giáo dục, phi thương mại, tuân thủ khung chương trình Giáo dục Phổ thông 2018 của Bộ Giáo dục và Đào tạo Việt Nam. Bạn được tự do sử dụng, chỉnh sửa và chia sẻ mã nguồn này cho giáo viên và học sinh!
