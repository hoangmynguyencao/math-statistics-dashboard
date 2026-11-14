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
3. [Lịch sử sửa lỗi và các cải tiến sau này](#3-lịch-sử-sửa-lỗi-và-các-cải-tiến-sau-này)
   - [Lỗi 1: Cú pháp f-string trong Python 3.14](#lỗi-1-cú-pháp-f-string-trong-python-314)
   - [Lỗi 2: Nhận diện Python trong script run_local.bat](#lỗi-2-nhận-diện-python-trong-script-run_localbat)
   - [Cải tiến 3: Bổ sung Homepage & Bỏ các mẫu số liệu có sẵn](#cải-tiến-3-bổ-sung-homepage--bỏ-các-mẫu-số-liệu-có-sẵn)
   - [Tính năng mới 4: Nhập dữ liệu tự động từ file Excel (.xlsx / .xls)](#tính-năng-mới-4-nhập-dữ-liệu-tự-động-từ-file-excel-xlsx--xls)
   - [Lỗi 5: Sửa lỗi đổi tên bài toán / mẫu số liệu](#lỗi-5-sửa-lỗi-đổi-tên-bài-toán--mẫu-số-liệu)
   - [Lỗi 6: Sửa lỗi chỉ lưu được 1 mẫu số liệu vào file CSV](#lỗi-6-sửa-lỗi-chỉ-lưu-được-1-mẫu-số-liệu-vào-file-csv)
   - [Cải tiến 7: Tái cấu trúc chuẩn giao diện 3 phân vùng (Tổng quan, Nhập liệu, Báo cáo & Thống kê)](#cải-tiến-7-tái-cấu-trúc-chuẩn-giao-diện-3-phân-vùng-tổng-quan-nhập-liệu-báo-cáo--thống-kê)
4. [Hướng dẫn sử dụng trang web chi tiết](#4-hướng-dẫn-sử-dụng-trang-web-chi-tiết)
   - [4.1. Bắt đầu từ Trang chủ](#41-bắt-đầu-từ-trang-chủ)
   - [4.2. Nhập dãy số liệu thủ công](#42-nhập-dãy-số-liệu-thủ-công)
   - [4.3. Nhập bảng phân bố tần số](#43-nhập-bảng-phân-bố-tần-số)
   - [4.4. Nhập số liệu tự động từ file Excel](#44-nhập-số-liệu-tự-động-từ-file-excel)
   - [4.5. Lưu trữ và quản lý nhiều mẫu số liệu](#45-lưu-trữ-và-quản-lý-nhiều-mẫu-số-liệu)
   - [4.6. Xem báo cáo thống kê & Lời giải công thức KaTeX](#46-xem-báo-cáo-thống-kê--lời-giải-công-thức-katex)
   - [4.7. Đọc hiểu Biểu đồ hộp (Box Plot) & Phát hiện giá trị ngoại lệ](#47-đọc-hiểu-biểu-đồ-hộp-box-plot--phát-hiện-giá-trị-ngoại-lệ)
   - [4.8. Xuất dữ liệu ra file CSV](#48-xuất-dữ-liệu-ra-file-csv)
5. [Chuẩn kiến thức Toán 10 áp dụng](#5-chuẩn-kiến-thức-toán-10-áp-dụng)
6. [Giấy phép & Tác quyền](#6-giấy-phép--tác-quyền)

---

## 1. Giới thiệu tổng quan & Tính năng

Trang web được thiết kế theo phong cách **Clean Dashboard** hiện đại, trực quan, tối ưu cho giáo viên, học sinh THPT và người nghiên cứu thống kê dữ liệu:

- **Giao diện chuẩn Dashboard**: Sidebar điều hướng thanh lịch, hỗ trợ **Light Mode & Dark Mode** tức thời.
- **Phân chia không gian làm việc chuyên biệt**:
  - **Trang chủ**: Giới thiệu tổng quan, hình ảnh minh họa, nút bắt đầu thống kê.
  - **Tổng quan**: Chỉ hiển thị nội dung cơ bản của mẫu số liệu và danh sách quản lý các bài toán đã lưu.
  - **Nhập liệu mới**: Chỉ hiển thị form nhập số liệu (thủ công hoặc Excel) và lưu file CSV.
  - **Báo cáo & Thống kê**: Hiển thị chi tiết mẫu số liệu sau khi nhập cùng toàn bộ báo cáo phân tích, công thức và biểu đồ.
- **Biểu diễn công thức Toán học KaTeX**: Chuẩn LaTeX sắc nét, trình bày từng bước thế số và giải thích chi tiết theo đúng SGK Toán 10.
- **Hỗ trợ nhập linh hoạt**:
  - Nhập dãy số tự do (ngăn cách bằng dấu phẩy, chấm phẩy, khoảng trắng).
  - Nhập bảng phân bố tần số (cặp giá trị $x_i$ : tần số $n_i$).
  - Nhập trực tiếp từ file **Excel** (`.xlsx`, `.xls`).
- **Trực quan hóa đồ thị**:
  - **Biểu đồ hộp (Box Plot)**: Tóm tắt 5 số đặc trưng ($Min, Q_1, Q_2, Q_3, Max$) và **làm nổi bật giá trị ngoại lệ** bằng chấm đỏ.
  - **Biểu đồ cột tần số (Frequency Bar Chart)**: Trực quan hóa phân bố tần số các phần tử.
- **Lưu trữ CSV vĩnh viễn**: Dữ liệu lưu xuống file CSV, hỗ trợ lưu nhiều mẫu số liệu, chỉnh sửa, xóa và xuất tải về máy.

---

## 2. Hướng dẫn từng bước tạo ra trang web từ đầu

### Bước 1: Xác định yêu cầu & Chuẩn kiến thức Toán 10
Dự án được xây dựng với mục tiêu giúp học sinh cấp 3 và giáo viên giải quyết các bài toán Thống kê không ghép nhóm của **SGK Toán 10 (Bộ Kết nối tri thức với cuộc sống - GDPT 2018)**. Hệ thống cần tính toán chính xác:
- **Số đặc trưng đo xu thế trung tâm**: Số trung bình ($\bar{x}$), Trung vị ($M_e$), Tứ phân vị ($Q_1, Q_2, Q_3$), Mốt ($M_o$).
- **Số đặc trưng đo độ phân tán**: Khoảng biến thiên ($R$), Khoảng tứ phân vị ($\Delta_Q$), Phương sai ($s^2$), Độ lệch chuẩn ($s$), Phương sai hiệu chỉnh ($s_{n-1}^2$).
- **Phát hiện giá trị ngoại lệ**: Quy tắc $x < Q_1 - 1{,}5\Delta_Q$ hoặc $x > Q_3 + 1{,}5\Delta_Q$.

---

### Bước 2: Câu Prompt ban đầu để yêu cầu AI viết code

Dưới đây là toàn bộ nội dung câu prompt gốc đã được sử dụng để định hình và yêu cầu AI sinh mã nguồn khởi tạo cho toàn bộ dự án:

```text
Hãy thiết kế và viết code hoàn chỉnh (React và Tailwind CSS cho frontend, Python cho backend, lưu dữ liệu xuống file csv) cho một website dạng "Bảng điều khiển nhập liệu và thống kê tự động" dành cho học sinh cấp 3 sử dụng, có giao diện hiện đại, tối giản, đẹp mắt (phong cách Clean Dashboard). (Ưu tiên sử dụng Lucide React cho icon và KaTeX/MathJax để hiển thị công thức toán học đẹp mắt).

Yêu cầu cụ thể như sau:

1. Giao diện trang chủ (Dashboard Layout):
- Bố cục gồm 2 phần chính: Sidebar (thanh điều khiển bên trái) và Main Content (vùng làm việc chính bên phải).
- Gam màu chủ đạo: Tông sáng (Light mode) chuyên nghiệp hoặc có nút chuyển Dark mode (Chế độ tối).
- Sử dụng các icon trực quan, bo góc mềm mại (rounded-xl), hiệu ứng đổ bóng nhẹ (shadow-sm).

2. Thanh điều khiển (Sidebar / Control Panel):
- Các mục điều hướng: Tổng quan (Dashboard), Nhập liệu mới (Data Entry), Báo cáo & Thống kê (Reports), Cài đặt (Settings).
- Có thanh tìm kiếm nhanh và nút bấm "Thêm dữ liệu nhanh" nổi bật.

3. Khu vực nhập liệu tự động (Data Entry Form):
- Một form nhập liệu mẫu số liệu không ghép nhóm đơn giản cho học sinh cấp 3, hỗ trợ 2 chế độ nhập: Không đếm tần số (nhập trực tiếp từng giá trị hoặc danh sách dãy số cách nhau bởi dấu phẩy/khoảng trắng) và Có đếm tần số (nhập cặp Giá trị x_i và Tần số n_i), kèm trường Tên bài toán/Mẫu số liệu và Ghi chú.
- Tính năng tự động: Khi người dùng nhập hoặc chọn, hệ thống tự động xác định cỡ mẫu n, tự động sắp xếp và hiển thị dãy số liệu theo thứ tự không giảm (x_1, x_2, x_3, ..., x_n), và có nút "Tự động sinh dữ liệu mẫu" (Auto-fill Demo Data) để thử nghiệm nhanh.
- Nút "Lưu dữ liệu" lưu ngay vào bảng bên dưới và tự động cập nhật các chỉ số thống kê lập tức (không cần load lại trang).

4. Khu vực thống kê & Biểu đồ (Statistics & Charts):
- Áp dụng chuẩn kiến thức Toán 10 chương trình mới (sách Kết nối tri thức với cuộc sống) để tính toán và hiển thị công thức tính chi tiết kèm kết quả cho từng số đặc trưng:
  + Các số đặc trưng đo xu thế trung tâm: Số trung bình cộng (\bar{x}), Trung vị (M_e), Tứ phân vị (Q_1, Q_2, Q_3), Mốt (M_o).
  + Các số đặc trưng đo độ phân tán: Khoảng biến thiên (R), Khoảng tứ phân vị (\Delta_Q), Phương sai (s^2), Độ lệch chuẩn (s).
  + Giá trị ngoại lệ: Hiển thị rõ điều kiện xác định giá trị ngoại lệ (x < Q_1 - 1,5\Delta_Q hoặc x > Q_3 + 1,5\Delta_Q), kèm danh sách các giá trị ngoại lệ tìm được nếu có.
- Hiển thị 4 thẻ KPI nổi bật đầu trang: Cỡ mẫu (n), Số trung bình (\bar{x}), Trung vị (M_e), Khoảng tứ phân vị (\Delta_Q) (với các con số lớn, rõ ràng và icon minh họa).
- Tích hợp biểu đồ trực quan (sử dụng thư viện nhẹ như Chart.js/Recharts hoặc SVG thuần): 
Biểu đồ cột thể hiện phân bố tần số của mẫu số liệu.
Biểu đồ hộp (Box Plot) để trực quan hóa giá trị nhỏ nhất, lớn nhất, các tứ phân vị (Q_1, Q_2, Q_3) và tự động đánh dấu / làm nổi bật các giá trị ngoại lệ (bất thường) ngay trên biểu đồ để học sinh dễ dàng nhận diện số liệu bất thường hoặc không chính xác trong mẫu.
- Một bảng dữ liệu (Data Table) ở dưới cùng lưu trữ các bộ mẫu số liệu đã nhập, có chức năng tìm kiếm, lọc, sắp xếp và nút xóa/sửa từng dòng.

5. Trải nghiệm người dùng (UX) & Triển khai (Deployment):
- Thiết kế Responsive (hiển thị tốt trên cả máy tính lẫn điện thoại).
- Code gọn gàng, chạy được ngay, chú thích rõ ràng để dễ chỉnh sửa, cấu trúc thư mục chuẩn để dễ dàng đưa lên GitHub và deploy miễn phí lên Render (onrender.com) cho mọi người, mọi thiết bị đều có thể truy cập và sử dụng trực tuyến.
- Hướng dẫn cách khởi tạo dự án và chạy thử trên máy cá nhân (local) cũng như các bước cấu hình (build command, start command, biến môi trường API URL) để deploy thành công lên Render.

Cuối cùng, hãy tạo thêm một file README.md hoàn chỉnh, trình bày rõ ràng theo từng bước (step-by-step) cách tạo ra trang web này từ đầu, bao gồm: toàn bộ nội dung câu prompt dùng để yêu cầu AI viết code, cách cài đặt và chạy thử trên máy tính, và hướng dẫn chi tiết cách đưa mã nguồn lên GitHub rồi public lên mạng thông qua nền tảng Render (onrender.com)
```

---

### Bước 3: Thiết kế kiến trúc & Cấu trúc thư mục dự án

Hệ thống được tổ chức theo mô hình **Monorepo kết hợp**:
- **Frontend**: Single Page Application với React 18, Vite, Tailwind CSS, Lucide React, XLSX và KaTeX.
- **Backend**: FastAPI (Python), RESTful API, tự động nạp và ghi file CSV.
- **Chế độ triển khai kép**: 
  - *Cục bộ (Local)*: Chạy song song React dev server (`:5173`) và FastAPI (`:8000`).
  - *Xuất bản (Production / Render)*: FastAPI tự động phục vụ các file tĩnh đã build của React từ `frontend/dist`. Toàn bộ ứng dụng chạy trên **1 Web Service duy nhất**, không gặp lỗi CORS và hoàn toàn miễn phí.

```
mathapp/
├── backend/
│   ├── app/
│   │   ├── __init__.py         # Package module
│   │   ├── config.py           # Thiết lập đường dẫn CSV, PORT, CORS
│   │   ├── models.py           # Pydantic schemas kiểm tra kiểu dữ liệu
│   │   ├── stats.py            # Thuật toán toán học chuẩn SGK Toán 10 KNTT
│   │   ├── storage.py          # Thao tác đọc/ghi/cập nhật/xóa file CSV
│   │   └── main.py             # FastAPI App & phục vụ file tĩnh
│   ├── data/
│   │   └── datasets.csv        # Cơ sở dữ liệu CSV lưu trữ các mẫu số liệu
│   └── requirements.txt        # Các gói thư viện Python backend
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
│   │   │   ├── DataTable.jsx          # Bảng quản lý dữ liệu CSV
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
├── build.sh                    # Script tự động build trên Render
├── run_local.bat               # File chạy nhanh 1-click trên Windows
└── README.md                   # Tài liệu hướng dẫn hoàn chỉnh
```

---

### Bước 4: Cài đặt và chạy thử trên máy tính (Local)

#### 4.1. Yêu cầu môi trường
- **Python**: Phiên bản 3.9 trở lên ([Tải Python](https://www.python.org/downloads/))
- **Node.js**: Phiên bản 18 trở lên ([Tải Node.js](https://nodejs.org/))
- **Git**: ([Tải Git](https://git-scm.com/))

#### 4.2. Cách 1: Chạy nhanh bằng script (Khuyên dùng)
- **Trên Windows**: Nhấp đúp chuột vào file `run_local.bat`.
- Script sẽ tự động kiểm tra Python, Node.js, cài đặt dependencies và mở cả Backend (`:8000`) lẫn Frontend (`:5173`).

#### 4.3. Cách 2: Khởi chạy thủ công từng phần

**Cửa sổ Terminal 1 — Backend (FastAPI):**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn backend.app.main:app --reload --port 8000
```
- API Backend hoạt động tại: `http://localhost:8000`
- Tài liệu API tương tác Swagger UI: `http://localhost:8000/docs`

**Cửa sổ Terminal 2 — Frontend (React Vite):**
```bash
cd frontend
npm install
npm run dev
```
- Mở trình duyệt web truy cập: **`http://localhost:5173`**

---

### Bước 5: Hướng dẫn đưa mã nguồn lên GitHub

1. Truy cập [github.com](https://github.com) và tạo một Repository mới (ví dụ: `math-statistics-dashboard`), chọn chế độ **Public**, không tick "Add a README file".
2. Mở terminal tại thư mục dự án và thực hiện:
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
2. Nhấn nút **New +** -> Chọn **Web Service**.
3. Chọn repo `math-statistics-dashboard` vừa đẩy lên GitHub và nhấn **Connect**.
4. Cấu hình các thông số:
   - **Name**: `math-statistics-dashboard` (hoặc tên tùy chọn)
   - **Region**: `Singapore` (để truy cập từ Việt Nam nhanh nhất)
   - **Branch**: `main`
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r requirements.txt && cd frontend && npm install && npm run build && cd ..
     ```
   - **Start Command**:
     ```bash
     uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: `Free` (Miễn phí)
5. Cuộn xuống phần **Environment Variables** và thêm:
   - `PYTHON_VERSION` = `3.10.12`
   - `NODE_VERSION` = `20.10.0`
6. Nhấn **Create Web Service**. Sau khi quá trình build hoàn tất, ứng dụng sẽ có URL công khai (dạng `https://math-statistics-dashboard.onrender.com`) để bất kỳ ai cũng có thể truy cập từ điện thoại hoặc máy tính.

---

## 3. Lịch sử sửa lỗi và các cải tiến sau này

Trong quá trình thử nghiệm thực tế và phát triển dự án, nhiều lỗi và yêu cầu điều chỉnh đã được phát hiện và xử lý triệt để:

### Lỗi 1: Cú pháp f-string trong Python 3.14
- **Hiện tượng**: Khi khởi động backend trên Python 3.14, file `backend/app/stats.py` báo lỗi `SyntaxError: f-string: expressions nested too deeply` hoặc lỗi dấu ngoặc nhọn `{,}` trong chuỗi định dạng KaTeX.
- **Nguyên nhân**: Python 3.14 kiểm tra chặt chẽ cú pháp f-string, ký tự `{,}` dùng để viết dấu phẩy số học trong KaTeX bị hiểu lầm là biểu thức Python rỗng.
- **Khắc phục**: Sửa ký tự `{,}` thành `{{,}}` (escape ngoặc nhọn trong f-string) tại dòng 232 của `stats.py`.

### Lỗi 2: Nhận diện Python trong script `run_local.bat`
- **Hiện tượng**: Windows 11 thường có các file thực thi stub rỗng của Python tại `WindowsApps` dẫn đến việc lệnh `where python` tìm thấy nhưng khi chạy thì mở Microsoft Store hoặc báo lỗi code 1.
- **Khắc phục**: 
  - Bổ sung bước kiểm tra thực thi lệnh thực tế `%%C -c "import sys"` để xác thực file Python thật sự hoạt động được.
  - Tự động bổ sung `%LOCALAPPDATA%\Python\bin` vào biến môi trường `PATH` trong file `.bat` để nhận diện các phiên bản `python3.14-64.exe` được cài đặt riêng.

### Cải tiến 3: Bổ sung Homepage & Bỏ các mẫu số liệu có sẵn
- **Yêu cầu**: Người dùng không muốn hệ thống nạp sẵn các mẫu số liệu ví dụ (chạy 100m, chiều cao bóng rổ, số con trong gia đình...), mà muốn giao diện mở đầu là một **Trang chủ (Homepage)** thông thường, có hình ảnh, tên web, mô tả tính năng ngắn gọn và nút **"NHẤN ĐỂ BẮT ĐẦU THỐNG KÊ"**.
- **Thực hiện**:
  - Tạo mới component `Homepage.jsx` với giao diện chuyên nghiệp, banner đồ họa toán học `homepage-banner.svg`, lưới 6 tính năng nổi bật và nút bắt đầu to rõ.
  - Xóa toàn bộ danh sách `DEMO_DATASETS` trong backend `storage.py`, làm sạch file `datasets.csv` về dạng chỉ có dòng tiêu đề.
  - Xóa danh sách `DEMO_DATA_PRESETS` và modal chọn ví dụ SGK trong frontend.

### Tính năng mới 4: Nhập dữ liệu tự động từ file Excel (`.xlsx` / `.xls`)
- **Yêu cầu**: Học sinh và giáo viên thường lưu số liệu thống kê trong bảng tính Excel, cần tính năng nạp thẳng file Excel vào phần mềm kèm chú thích yêu cầu định dạng rõ ràng.
- **Thực hiện**:
  - Cài đặt thư viện `xlsx` (SheetJS) cho frontend.
  - Bổ sung nút **"Nhập từ Excel (.xlsx / .xls)"** trong `DataEntryForm.jsx`.
  - Tự động nhận diện dữ liệu Sheet đầu tiên:
    - *Chế độ Dãy số liệu*: Đọc Cột A từ hàng 2 trở đi (hàng 1 là tiêu đề).
    - *Chế độ Bảng tần số*: Đọc Cột A (Giá trị) và Cột B (Tần số) từ hàng 2 trở đi.
  - Bổ sung panel bấm xem **"Yêu cầu định dạng file Excel"** kèm bảng minh họa mẫu trực quan.

### Lỗi 5: Sửa lỗi đổi tên bài toán / mẫu số liệu
- **Hiện tượng**: Người dùng nhập tên mới cho bài toán trong form nhưng sau khi lưu thì tên không được cập nhật lại hoặc bị ghi đè thành tên cũ.
- **Nguyên nhân**: 
  1. Trong `App.jsx`, hàm `handleSaveDataset` luôn gửi request `POST` (tạo mới) thay vì `PUT` (cập nhật) đối với các mẫu số liệu đã có trong cơ sở dữ liệu.
  2. Trong `DataEntryForm.jsx`, `useEffect([currentDataset])` tự động reset form mỗi khi state cha cập nhật, ghi đè lên nội dung người dùng đang gõ.
- **Khắc phục**:
  - Trong `App.jsx`: Kiểm tra nếu `activeDataset.id` đã tồn tại thì gọi API `PUT /api/datasets/{id}`, nếu chưa có thì gọi `POST /api/datasets`.
  - Trong `DataEntryForm.jsx`: Sử dụng `prevDatasetIdRef = useRef(null)` để **chỉ sync form khi ID mẫu số liệu thực sự thay đổi** (khi người dùng chọn bài toán khác), không sync lại khi đang gõ tên.

### Lỗi 6: Sửa lỗi chỉ lưu được 1 mẫu số liệu vào file CSV
- **Hiện tượng**: Sau khi người dùng lưu mẫu số liệu thứ nhất, nếu nhập tiếp mẫu số liệu thứ hai thì dữ liệu bị ghi đè lên mẫu thứ nhất, trong file CSV chỉ lưu được duy nhất 1 mẫu.
- **Nguyên nhân**: Sau khi lưu mẫu 1 thành công, biến `activeDataset` mang `id` của mẫu 1. Nút "Làm mới form" trước đây chỉ xóa trắng các trường nhập trong form nhưng không xóa `id` trong state cha. Do đó khi bấm "Lưu", hàm tưởng rằng người dùng đang sửa mẫu 1 và thực hiện `PUT` ghi đè.
- **Khắc phục**:
  - Nâng cấp nút "Làm mới form" thành nút **"Thêm mẫu số liệu mới"** (màu xanh lá) và bổ sung nút **"Nhập mẫu tiếp theo"** hiển thị ngay sau khi lưu.
  - Khi nhấn, hệ thống gọi `onNewDataset()` để reset `activeDataset` về trạng thái mới hoàn toàn (không mang ID cũ).
  - Nút lưu tự động đổi nhãn: hiển thị **"Lưu vào CSV"** (khi tạo mẫu mới) và **"Cập nhật CSV"** (khi đang chỉnh sửa mẫu cũ).

### Cải tiến 7: Tái cấu trúc chuẩn giao diện 3 phân vùng (Tổng quan, Nhập liệu, Báo cáo & Thống kê)
- **Yêu cầu của người dùng**:
  - *Phần tổng quan*: Chỉ hiện mỗi nội dung cơ bản của mẫu số liệu.
  - *Phần nhập liệu*: Chỉ hiện mỗi phần nhập mẫu số liệu và lưu file CSV, không hiện gì khác.
  - *Phần báo cáo và thống kê*: Chỉ đưa những báo cáo được và mẫu số liệu sau khi được nhập.
- **Thực hiện**:
  1. **Tab Tổng quan (`dashboard`)**: Loại bỏ hoàn toàn form nhập liệu và các phần công thức giải chi tiết. Chỉ giữ lại Header tóm tắt, 4 thẻ KPI cơ bản, khối hiển thị dãy số liệu tăng dần (Min, Max, R) và Bảng danh sách dữ liệu CSV để quản lý.
  2. **Tab Nhập liệu (`entry`)**: Dọn dẹp sạch sẽ toàn bộ các khối KPI, biểu đồ, bảng dữ liệu xung quanh. Trang chỉ hiển thị duy nhất `DataEntryForm` phục vụ nhập liệu và lưu CSV.
  3. **Tab Báo cáo & Thống kê (`reports`)**: Tập trung hiển thị:
     - Khối *Mẫu số liệu sau khi được nhập* (Dãy số gốc, Dãy số sắp xếp không giảm đánh dấu ngoại lệ, Bảng phân bố tần số & tần suất, 5 số tóm tắt).
     - Khối *Những báo cáo được* (4 thẻ KPI, Thống kê chi tiết & Lời giải KaTeX từng bước, Biểu đồ hộp Box Plot, Biểu đồ cột tần số).
     - Bổ sung bộ chọn nhanh chuyển đổi giữa các mẫu số liệu trực tiếp trong trang báo cáo.

---

## 4. Hướng dẫn sử dụng trang web chi tiết

### 4.1. Bắt đầu từ Trang chủ
- Khi mở ứng dụng lần đầu, bạn sẽ ở **Trang chủ**.
- Nhấn nút **"NHẤN ĐỂ BẮT ĐẦU THỐNG KÊ"** để vào ngay không gian làm việc.

---

### 4.2. Nhập dãy số liệu thủ công
1. Vào mục **"Nhập liệu mới"** trên thanh Sidebar bên trái.
2. Nhập **Tên bài toán / Tên mẫu số liệu** (Ví dụ: *Điểm kiểm tra giữa kì môn Toán 10*).
3. Chọn chế độ **"Dãy số liệu"**.
4. Nhập các số vào ô nội dung, có thể dùng dấu phẩy `,`, dấu chấm phẩy `;` hoặc khoảng trắng:
   ```text
   7.5; 8.0; 6.5; 9.0; 8.5; 7.0; 8.0; 9.5; 4.0; 8.5; 1.5; 10.0
   ```
5. Hệ thống sẽ tự động cập nhật cỡ mẫu $n$ và sắp xếp dãy số tăng dần ngay bên dưới.
6. Nhấn **"Lưu dữ liệu vào CSV"**.

---

### 4.3. Nhập bảng phân bố tần số
1. Tại form nhập liệu, chọn chế độ **"Có tần số"**.
2. Nhập mỗi dòng là một cặp `Giá trị : Tần số`:
   ```text
   0: 4
   1: 12
   2: 18
   3: 5
   4: 1
   ```
3. Hệ thống sẽ tự động tính toán tổng số phần tử $n = 4 + 12 + 18 + 5 + 1 = 40$ và giải phóng các giá trị tương ứng.

---

### 4.4. Nhập số liệu tự động từ file Excel
1. Nhấn nút **"Nhập từ Excel (.xlsx / .xls)"** trên form nhập liệu.
2. Chọn file Excel từ máy tính của bạn:
   - **Với Dãy số liệu**: Cột A chứa các số liệu (1 số trên 1 dòng), hàng 1 là tiêu đề (hệ thống tự động bỏ qua).
   - **Với Bảng tần số**: Cột A là Giá trị ($x_i$), Cột B là Tần số ($n_i$), hàng 1 là tiêu đề.
3. Dữ liệu từ Excel sẽ được đọc và điền tự động vào ô nhập liệu ngay lập tức.

---

### 4.5. Lưu trữ và quản lý nhiều mẫu số liệu
- Sau khi nhấn lưu thành công, bạn sẽ thấy thông báo kèm nút **"Nhập mẫu tiếp theo"**.
- Nhấn **"Nhập mẫu tiếp theo"** (hoặc nút **"Thêm mẫu số liệu mới"** ở góc trên form) để làm mới form và nhập bài toán tiếp theo.
- Toàn bộ các bài toán đã lưu sẽ hiển thị trong bảng dữ liệu tại tab **Tổng quan**. Bạn có thể:
  - Nhấp vào một dòng để chọn xem mẫu số liệu đó.
  - Nhấn nút **Sửa** (icon cây bút) để chỉnh sửa lại số liệu.
  - Nhấn nút **Xóa** (icon thùng rác) để xóa mẫu số liệu khỏi cơ sở dữ liệu CSV.

---

### 4.6. Xem báo cáo thống kê & Lời giải công thức KaTeX
1. Nhấp vào mục **"Báo cáo & Thống kê"** trên Sidebar (hoặc nút *"Xem báo cáo chi tiết"*).
2. Tại đây bạn sẽ thấy:
   - **Mẫu số liệu sau khi được nhập**: Dãy số gốc, Dãy số sắp xếp không giảm, Bảng tần số và 5 số tóm tắt ($Min, Q_1, Q_2, Q_3, Max$).
   - **4 Thẻ KPI**: Cỡ mẫu $n$, Trung bình $\bar{x}$, Trung vị $M_e$, Khoảng tứ phân vị $\Delta_Q$.
   - **Cảnh báo giá trị ngoại lệ**: Tự động thông báo có hoặc không có điểm dị biệt.
   - **Bảng công thức KaTeX chi tiết**: Trình bày rõ ràng công thức tổng quát và phép thế số thực tế theo đúng chương trình Toán 10. Bạn có thể nhấn icon copy để sao chép mã KaTeX vào bài tập, giáo án.

---

### 4.7. Đọc hiểu Biểu đồ hộp (Box Plot) & Phát hiện giá trị ngoại lệ
- **Thân hộp (Box)**: Kéo dài từ $Q_1$ đến $Q_3$, chứa 50% số lượng dữ liệu ở trung tâm.
- **Vạch kẻ giữa hộp**: Thể hiện giá trị Trung vị $M_e = Q_2$.
- **Hai râu (Whiskers)**: Nối từ thân hộp tới giá trị nhỏ nhất và lớn nhất trong ngưỡng an toàn.
- **Điểm tròn màu đỏ**: Là các **giá trị ngoại lệ** bất thường thỏa mãn $x < Q_1 - 1{,}5\Delta_Q$ hoặc $x > Q_3 + 1{,}5\Delta_Q$. Rê chuột vào điểm để xem giá trị chính xác.

---

### 4.8. Xuất dữ liệu ra file CSV
- Nhấn nút **"Xuất CSV"** ở góc trên bên phải thanh Header (hoặc nút *"Xuất CSV"* trên bảng dữ liệu).
- Trình duyệt sẽ tải xuống file `bang_thong_ke_toan10.csv` chứa toàn bộ các bài toán và kết quả tính toán chi tiết, có thể mở trực tiếp bằng Microsoft Excel hoặc Google Sheets.

---

## 5. Chuẩn kiến thức Toán 10 áp dụng

Hệ thống tuân thủ 100% định nghĩa và quy ước toán học của **SGK Toán 10 (Bộ Kết nối tri thức với cuộc sống)**:

### 5.1. Sắp xếp dãy số liệu
Mẫu số liệu gồm $n$ giá trị được sắp xếp theo thứ tự không giảm:
$$x_1 \le x_2 \le \dots \le x_n$$

### 5.2. Các số đặc trưng đo xu thế trung tâm
- **Số trung bình cộng ($\bar{x}$)**:
  $$\bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n} = \frac{1}{n} \sum_{i=1}^n x_i$$
  Nếu cho dưới dạng bảng tần số:
  $$\bar{x} = \frac{m_1 x_1 + m_2 x_2 + \dots + m_k x_k}{n} \quad \left(\text{với } n = \sum_{j=1}^k m_j\right)$$

- **Trung vị ($M_e$)**:
  - Khi $n$ lẻ ($n = 2k + 1$): $M_e = x_{k+1}$ (phần tử chính giữa).
  - Khi $n$ chẵn ($n = 2k$): $M_e = \frac{x_k + x_{k+1}}{2}$ (trung bình 2 phần tử chính giữa).

- **Tứ phân vị ($Q_1, Q_2, Q_3$)**:
  - $Q_2 = M_e$ (trung vị của toàn bộ mẫu số liệu).
  - *Khi $n$ lẻ*: Dãy chia làm 2 nửa: nửa dưới từ $x_1$ đến $x_{\frac{n-1}{2}}$ (không gồm $Q_2$), nửa trên từ $x_{\frac{n+3}{2}}$ đến $x_n$ (không gồm $Q_2$). $Q_1$ là trung vị nửa dưới; $Q_3$ là trung vị nửa trên.
  - *Khi $n$ chẵn*: Dãy chia làm 2 nửa bằng nhau: nửa dưới từ $x_1$ đến $x_{n/2}$, nửa trên từ $x_{n/2 + 1}$ đến $x_n$. $Q_1$ là trung vị nửa dưới; $Q_3$ là trung vị nửa trên.

- **Mốt ($M_o$)**: Là giá trị có tần số xuất hiện lớn nhất trong mẫu số liệu.

### 5.3. Các số đặc trưng đo độ phân tán
- **Khoảng biến thiên ($R$)**:
  $$R = x_{max} - x_{min} = x_n - x_1$$
- **Khoảng tứ phân vị ($\Delta_Q$)**:
  $$\Delta_Q = Q_3 - Q_1$$
- **Phương sai mẫu ($s^2$)**:
  $$s^2 = \frac{1}{n}\sum_{i=1}^n (x_i - \bar{x})^2$$
- **Độ lệch chuẩn ($s$)**:
  $$s = \sqrt{s^2}$$

### 5.4. Quy tắc xác định giá trị ngoại lệ (Outliers)
Một giá trị $x$ trong mẫu số liệu được gọi là **giá trị ngoại lệ** nếu nó thỏa mãn một trong hai điều kiện:
$$x < Q_1 - 1{,}5\Delta_Q \quad \text{hoặc} \quad x > Q_3 + 1{,}5\Delta_Q$$

---

## 6. Giấy phép & Tác quyền
Dự án được xây dựng phục vụ mục đích giáo dục, phi thương mại, tuân thủ khung chương trình Giáo dục Phổ thông 2018 của Bộ Giáo dục và Đào tạo Việt Nam. Bạn được tự do sử dụng, chỉnh sửa và chia sẻ mã nguồn này cho giáo viên và học sinh!
