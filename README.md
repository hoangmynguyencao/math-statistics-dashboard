# 📊 Bảng Điều Khiển Nhập Liệu & Thống Kê Tự Động (Toán 10 GDPT 2018)

> **Website ứng dụng web hiện đại (Clean Dashboard) phục vụ học tập, giảng dạy và nghiên cứu thống kê mẫu số liệu không ghép nhóm theo chương trình GDPT 2018 (SGK Toán 10 - Bộ Kết nối tri thức với cuộc sống).**

---

## 📑 Mục Lục
1. [Giới thiệu tổng quan & Tính năng](#1-giới-thiệu-tổng-quan--tính-năng)
2. [Nội dung câu Prompt yêu cầu AI viết code](#2-nội-dung-câu-prompt-yêu-cầu-ai-viết-code)
3. [Kiến trúc hệ thống & Cấu trúc thư mục](#3-kiến-trúc-hệ-thống--cấu-trúc-thư-mục)
4. [Chuẩn kiến thức Toán 10 áp dụng](#4-chuẩn-kiến-thức-toán-10-áp-dụng)
5. [Hướng dẫn cài đặt & Chạy thử trên máy tính (Local)](#5-hướng-dẫn-cài-đặt--chạy-thử-trên-máy-tính-local)
6. [Hướng dẫn đưa mã nguồn lên GitHub](#6-hướng-dẫn-đưa-mã-nguồn-lên-github)
7. [Hướng dẫn Deploy miễn phí lên Render (onrender.com)](#7-hướng-dẫn-deploy-miễn-phí-lên-render-onrendercom)
8. [Hướng dẫn sử dụng chi tiết](#8-hướng-dẫn-sử-dụng-chi-tiết)

---

## 1. Giới thiệu tổng quan & Tính năng

Trang web được thiết kế theo phong cách **Clean Dashboard** hiện đại, trực quan, tối ưu cho giáo viên, học sinh THPT và người làm việc với dữ liệu số:

- **Giao diện chuẩn Dashboard**: Sidebar điều hướng thanh lịch, 4 thẻ KPI nổi bật đầu trang, hỗ trợ **Light Mode & Dark Mode** tức thời.
- **Biểu diễn công thức Toán học đẹp mắt**: Sử dụng **KaTeX** chuẩn LaTeX để hiển thị chi tiết từng bước giải, phép thế số và kết quả theo đúng SGK Toán 10.
- **Bộ tính toán tự động thông minh**:
  - Hỗ trợ 2 chế độ: **Dãy số không tần số** (phân cách bởi dấu cách, phẩy, chấm phẩy, hỗ trợ số thập phân) và **Bảng có tần số** (cặp $x_i : n_i$).
  - Tự động đếm cỡ mẫu $n$, tự động sắp xếp dãy số liệu tăng dần $x_1 \le x_2 \le \dots \le x_n$.
  - Tính toán ngay khi đang gõ (Real-time Preview) không cần chờ đợi.
- **Trực quan hóa đồ họa sắc nét**:
  - **Biểu đồ hộp (Box Plot)**: Hiển thị 5 số đặc trưng ($Min, Q_1, Q_2, Q_3, Max$) và **đánh dấu nổi bật các giá trị ngoại lệ (Outliers)** bằng chấm tròn đỏ phát sáng kèm nhãn giá trị.
  - **Biểu đồ cột tần số (Frequency Bar Chart)**: Trực quan hóa tần số xuất hiện của từng giá trị trong mẫu.
- **Lưu trữ dữ liệu CSV vĩnh viễn**:
  - Dữ liệu được lưu trữ trực tiếp vào file `datasets.csv` trên máy chủ.
  - Hỗ trợ bảng dữ liệu (Data Table) đa năng: tìm kiếm theo từ khóa, lọc theo chế độ/ngoại lệ, sắp xếp và nút xóa/sửa từng dòng.
  - Nút **Xuất file CSV** tải trực tiếp về máy tính để mở trên Excel hoặc Google Sheets.
- **Nút "Tự động sinh dữ liệu mẫu"**: Tích hợp sẵn các tình huống thực tế trong SGK Toán 10 (điểm thi, chiều cao, thời gian chạy, số con trong hộ gia đình).

---

## 2. Nội dung câu Prompt yêu cầu AI viết code

Dưới đây là toàn bộ nội dung câu prompt gốc đã được sử dụng để xây dựng trọn vẹn hệ thống này:

```text
Hãy thiết kế và viết code hoàn chỉnh (React và Tailwind CSS cho frontend, Python cho backend, lưu dữ liệu xuống file csv) cho một website dạng "Bảng điều khiển nhập liệu và thống kê tự động" dành cho học sinh, giáo viên hoặc người có nhu cầu sử dụng, có giao diện hiện đại, tối giản, đẹp mắt (phong cách Clean Dashboard). (Ưu tiên sử dụng Lucide React cho icon và KaTeX/MathJax để hiển thị công thức toán học đẹp mắt).

Yêu cầu cụ thể như sau:

1. Giao diện trang chủ (Dashboard Layout):
- Bố cục gồm 2 phần chính: Sidebar (thanh điều khiển bên trái) và Main Content (vùng làm việc chính bên phải).
- Gam màu chủ đạo: Tông sáng (Light mode) chuyên nghiệp hoặc có nút chuyển Dark mode (Chế độ tối).
- Sử dụng các icon trực quan, bo góc mềm mại (rounded-xl), hiệu ứng đổ bóng nhẹ (shadow-sm).

2. Thanh điều khiển (Sidebar / Control Panel):
- Các mục điều hướng: Tổng quan (Dashboard), Nhập liệu mới (Data Entry), Báo cáo & Thống kê (Reports), Cài đặt (Settings).
- Có thanh tìm kiếm nhanh và nút bấm "Thêm dữ liệu nhanh" nổi bật.

3. Khu vực nhập liệu tự động (Data Entry Form):
- Một form nhập liệu mẫu số liệu không ghép nhóm đơn giản, hỗ trợ 2 chế độ nhập: Không đếm tần số (nhập trực tiếp từng giá trị hoặc danh sách dãy số cách nhau bởi dấu chấm phẩy/khoảng trắng, có hỗ trợ tính toán cả số thập phân) và Có đếm tần số (nhập cặp Giá trị x_i và Tần số n_i), kèm trường Tên bài toán/Mẫu số liệu và Ghi chú.
- Tính năng tự động: Khi người dùng nhập hoặc chọn, hệ thống tự động xác định cỡ mẫu n, tự động sắp xếp và hiển thị dãy số liệu theo thứ tự không giảm (x_1, x_2, x_3, ..., x_n), và có nút "Tự động sinh dữ liệu mẫu" (Auto-fill Demo Data) để thử nghiệm nhanh.
- Nút "Lưu dữ liệu" lưu ngay vào bảng bên dưới và tự động cập nhật các chỉ số thống kê lập tức (không cần load lại trang).

4. Khu vực thống kê & Biểu đồ (Statistics & Charts):
- Áp dụng chuẩn kiến thức Toán 10 chương trình mới (sách Kết nối tri thức với cuộc sống) để tính toán và hiển thị công thức tính chi tiết kèm kết quả cho từng số đặc trưng:
  + Các số đặc trưng đo xu thế trung tâm: Số trung bình cộng (\bar{x}), Trung vị (M_e), Tứ phân vị (Q_1, Q_2, Q_3), Mốt (M_o).
  + Các số đặc trưng đo độ phân tán: Khoảng biến thiên (R), Khoảng tứ phân vị (\Delta_Q), Phương sai (s^2), Độ lệch chuẩn (s).
  + Giá trị ngoại lệ: Hiển thị rõ điều kiện xác định giá trị ngoại lệ (x < Q_1 - 1,5\Delta_Q hoặc x > Q_3 + 1,5\Delta_Q), kèm danh sách các giá trị ngoại lệ tìm được nếu có.
- Hiển thị 4 thẻ KPI nổi bật đầu trang: Cỡ mẫu (n), Số trung bình (\bar{x}), Trung vị (M_e), Khoảng tứ phân vị (\Delta_Q) (với các con số lớn, rõ ràng và icon minh họa).
- Tích hợp biểu đồ trực quan (sử dụng thư viện nhẹ như Chart.js/Recharts hoặc SVG thuần): 
  + Biểu đồ cột thể hiện phân bố tần số của mẫu số liệu.
  + Biểu đồ hộp (Box Plot) để trực quan hóa giá trị nhỏ nhất, lớn nhất, các tứ phân vị (Q_1, Q_2, Q_3) và tự động đánh dấu / làm nổi bật các giá trị ngoại lệ (bất thường) ngay trên biểu đồ để học sinh dễ dàng nhận diện số liệu bất thường hoặc không chính xác trong mẫu.
- Một bảng dữ liệu (Data Table) ở dưới cùng lưu trữ các bộ mẫu số liệu đã nhập, có chức năng tìm kiếm, lọc, sắp xếp và nút xóa/sửa từng dòng.

5. Trải nghiệm người dùng (UX) & Triển khai (Deployment):
- Thiết kế Responsive (hiển thị tốt trên cả máy tính lẫn điện thoại).
- Code gọn gàng, chạy được ngay, chú thích rõ ràng để dễ chỉnh sửa, cấu trúc thư mục chuẩn để dễ dàng đưa lên GitHub và deploy miễn phí lên Render (onrender.com) cho mọi người, mọi thiết bị đều có thể truy cập và sử dụng trực tuyến.
- Hướng dẫn cách khởi tạo dự án và chạy thử trên máy cá nhân (local) cũng như các bước cấu hình (build command, start command, biến môi trường API URL) để deploy thành công lên Render.

Cuối cùng, hãy tạo thêm một file README.md hoàn chỉnh, trình bày rõ ràng theo từng bước (step-by-step) cách tạo ra trang web này từ đầu, bao gồm: toàn bộ nội dung câu prompt dùng để yêu cầu AI viết code, cách cài đặt và chạy thử trên máy tính, và hướng dẫn chi tiết cách đưa mã nguồn lên GitHub rồi public lên mạng thông qua nền tảng Render (onrender.com), cũng như hướng dẫn sử dụng website.
```

---

## 3. Kiến trúc hệ thống & Cấu trúc thư mục

Hệ thống được thiết kế theo mô hình **Monorepo kết hợp**:
- **Frontend**: Single Page Application với React 18, Vite, Tailwind CSS, Lucide React và KaTeX.
- **Backend**: FastAPI (Python), kiến trúc RESTful API, tự động nạp và ghi file CSV.
- **Khả năng triển khai kép**: 
  - Trong chế độ phát triển (Dev): Chạy song song React dev server (`:5173`) và FastAPI (`:8000`).
  - Trong chế độ xuất bản (Production / Render): FastAPI tự động phục vụ các file tĩnh đã build của React từ `frontend/dist`. Toàn bộ ứng dụng chạy trên **1 Web Service duy nhất**, không gặp lỗi CORS và hoàn toàn miễn phí!

```
math-app/
├── backend/
│   ├── app/
│   │   ├── __init__.py         # Package module
│   │   ├── config.py           # Thiết lập đường dẫn CSV, PORT, CORS
│   │   ├── models.py           # Pydantic schemas kiểm tra kiểu dữ liệu
│   │   ├── stats.py            # Thuật toán toán học chuẩn SGK Toán 10 KNTT
│   │   ├── storage.py          # Thao tác đọc/ghi/xóa dữ liệu CSV
│   │   └── main.py             # FastAPI App & phục vụ file tĩnh
│   ├── data/
│   │   └── datasets.csv        # Cơ sở dữ liệu CSV lưu trữ các mẫu số liệu
│   └── requirements.txt        # Các gói thư viện Python backend
├── frontend/
│   ├── public/
│   │   ├── favicon.svg         # Icon ứng dụng
│   │   └── _redirects          # Cấu hình SPA routing
│   ├── src/
│   │   ├── components/
│   │   │   ├── BoxPlotChart.jsx       # Biểu đồ hộp & điểm ngoại lệ
│   │   │   ├── DataEntryForm.jsx      # Form nhập liệu tự động
│   │   │   ├── DataTable.jsx          # Bảng dữ liệu tìm kiếm/lọc CSV
│   │   │   ├── DemoSelectorModal.jsx  # Modal chọn ví dụ SGK
│   │   │   ├── FrequencyChart.jsx     # Biểu đồ cột tần số
│   │   │   ├── Header.jsx             # Thanh tiêu đề trên
│   │   │   ├── KPICards.jsx           # 4 Thẻ chỉ số nổi bật
│   │   │   ├── MathFormula.jsx        # Component render KaTeX
│   │   │   ├── SettingsModal.jsx      # Modal cài đặt & sổ tay công thức
│   │   │   ├── Sidebar.jsx            # Thanh điều khiển bên trái
│   │   │   └── StatisticsSummary.jsx  # Chi tiết công thức & giải thích
│   │   ├── utils/
│   │   │   ├── demoData.js            # Dữ liệu các ví dụ thực tế SGK
│   │   │   └── statsCalculator.js     # Thuật toán tính toán phía client
│   │   ├── App.jsx             # Root Component điều phối trạng thái
│   │   ├── index.css           # Cấu hình Tailwind CSS & Custom scrollbar
│   │   └── main.jsx            # Điểm bắt đầu của React
│   ├── index.html              # HTML shell & liên kết CDN KaTeX
│   ├── package.json            # Cấu hình thư viện frontend
│   ├── postcss.config.js       # PostCSS plugins
│   ├── tailwind.config.js      # Thiết lập theme, màu sắc, Dark mode
│   └── vite.config.js          # Cấu hình Vite & proxy API
├── .gitignore                  # Bỏ qua node_modules, cache khi đưa lên git
├── build.sh                    # Script tự động build trên Render
├── Procfile                    # Web server process definition
├── render.yaml                 # Render Blueprint triển khai tự động
├── requirements.txt            # Thư viện Python gốc
├── run_local.bat               # File chạy nhanh 1-click trên Windows
├── run_local.sh                # File chạy nhanh 1-click trên macOS/Linux
└── README.md                   # Tài liệu hướng dẫn hoàn chỉnh
```

---

## 4. Chuẩn kiến thức Toán 10 áp dụng

Hệ thống tuân thủ 100% định nghĩa và quy ước toán học của **SGK Toán 10 (Bộ Kết nối tri thức với cuộc sống)**:

### 4.1. Sắp xếp dãy số liệu
Mẫu số liệu gồm $n$ giá trị được sắp xếp theo thứ tự không giảm:
$$x_1 \le x_2 \le \dots \le x_n$$

### 4.2. Các số đặc trưng đo xu thế trung tâm
- **Số trung bình cộng ($\bar{x}$)**:
  $$\bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n} = \frac{1}{n} \sum_{i=1}^n x_i$$
  Nếu mẫu số liệu cho dưới dạng bảng tần số:
  $$\bar{x} = \frac{m_1 x_1 + m_2 x_2 + \dots + m_k x_k}{n} \quad \left(\text{với } n = \sum_{j=1}^k m_j\right)$$

- **Trung vị ($M_e$)**:
  - Nếu $n$ lẻ ($n = 2k + 1$): $M_e = x_{k+1}$ (phần tử chính giữa).
  - Nếu $n$ chẵn ($n = 2k$): $M_e = \frac{x_k + x_{k+1}}{2}$ (trung bình cộng 2 phần tử chính giữa).

- **Tứ phân vị ($Q_1, Q_2, Q_3$)**:
  - $Q_2 = M_e$ (trung vị của toàn bộ dãy số liệu).
  - Xác định $Q_1$ (tứ phân vị thứ nhất) và $Q_3$ (tứ phân vị thứ ba):
    - *Khi $n$ là số lẻ*: Dãy được chia làm 2 nửa: nửa dưới từ $x_1$ đến $x_{\frac{n-1}{2}}$ (không gồm $Q_2$), nửa trên từ $x_{\frac{n+3}{2}}$ đến $x_n$ (không gồm $Q_2$). $Q_1$ là trung vị của nửa dưới; $Q_3$ là trung vị của nửa trên.
    - *Khi $n$ là số chẵn*: Dãy chia thành 2 nửa bằng nhau: nửa dưới từ $x_1$ đến $x_{n/2}$, nửa trên từ $x_{n/2 + 1}$ đến $x_n$. $Q_1$ là trung vị của nửa dưới; $Q_3$ là trung vị của nửa trên.

- **Mốt ($M_o$)**: Là giá trị có tần số xuất hiện lớn nhất trong mẫu số liệu. Nếu tất cả các giá trị đều có tần số xuất hiện bằng nhau ($n > 1$), ta coi mẫu số liệu không có mốt.

### 4.3. Các số đặc trưng đo độ phân tán
- **Khoảng biến thiên ($R$)**:
  $$R = x_{max} - x_{min} = x_n - x_1$$
- **Khoảng tứ phân vị ($\Delta_Q$)**:
  $$\Delta_Q = Q_3 - Q_1$$
- **Phương sai mẫu ($s^2$)**:
  $$s^2 = \frac{1}{n}\sum_{i=1}^n (x_i - \bar{x})^2$$
  *(Hệ thống đồng thời hiển thị giá trị phương sai hiệu chỉnh $s_{n-1}^2 = \frac{1}{n-1}\sum (x_i - \bar{x})^2$ để đối chiếu khi cần).*
- **Độ lệch chuẩn ($s$)**:
  $$s = \sqrt{s^2}$$

### 4.4. Quy tắc xác định giá trị ngoại lệ (Outliers)
Một giá trị $x$ trong mẫu số liệu được gọi là **giá trị ngoại lệ** nếu nó thỏa mãn một trong hai điều kiện:
$$x < Q_1 - 1{,}5\Delta_Q \quad \text{hoặc} \quad x > Q_3 + 1{,}5\Delta_Q$$

---

## 5. Hướng dẫn cài đặt & Chạy thử trên máy tính (Local)

### 5.1. Yêu cầu môi trường
- **Python**: Phiên bản 3.9 trở lên ([Tải Python](https://www.python.org/downloads/))
- **Node.js**: Phiên bản 18 trở lên ([Tải Node.js](https://nodejs.org/))
- **Git**: ([Tải Git](https://git-scm.com/))

---

### 5.2. Cách 1: Chạy nhanh bằng script (Khuyên dùng)
Trong thư mục gốc dự án:
- **Trên Windows**: Nhấp đúp chuột vào file `run_local.bat`
- **Trên macOS / Linux**:
  ```bash
  chmod +x run_local.sh
  ./run_local.sh
  ```
Script sẽ tự động cài đặt các thư viện cần thiết và mở đồng thời cả Backend và Frontend!

---

### 5.3. Cách 2: Khởi chạy thủ công từng phần

#### Bước 1: Khởi động Backend (Python FastAPI)
Mở cửa sổ Terminal thứ nhất:
```bash
# Di chuyển vào thư mục dự án
cd "d:\math app"

# (Tùy chọn) Tạo môi trường ảo python
python -m venv .venv
# Trên Windows:
.venv\Scripts\activate
# Trên macOS/Linux:
# source .venv/bin/activate

# Cài đặt thư viện backend
pip install -r requirements.txt

# Khởi chạy server FastAPI (hỗ trợ hot-reload khi sửa code)
uvicorn backend.app.main:app --reload --port 8000
```
- API Backend hoạt động tại: `http://localhost:8000`
- Trang tài liệu Swagger UI xem thử nghiệm API: `http://localhost:8000/docs`

#### Bước 2: Khởi động Frontend (React Tailwind CSS)
Mở cửa sổ Terminal thứ hai:
```bash
# Di chuyển vào thư mục frontend
cd "d:\math app/frontend"

# Cài đặt các gói npm
npm install

# Khởi động máy chủ phát triển Vite
npm run dev
```
- Mở trình duyệt web và truy cập vào: **`http://localhost:5173`**
- Bây giờ bạn có thể trải nghiệm toàn bộ giao diện và tính năng!

---

## 6. Hướng dẫn đưa mã nguồn lên GitHub

Để đưa mã nguồn lên GitHub trước khi triển khai trực tuyến lên Render, bạn thực hiện các bước sau:

### Bước 1: Đăng nhập GitHub và tạo Repository mới
1. Truy cập [github.com](https://github.com) và đăng nhập tài khoản.
2. Nhấn nút **New** (hoặc dấu `+` ở góc trên bên phải -> chọn **New repository**).
3. Đặt tên kho lưu trữ: `math-statistics-dashboard`.
4. Chọn chế độ **Public** (công khai).
5. **Không** tích chọn "Add a README file" (vì chúng ta đã có sẵn file README.md này).
6. Nhấn **Create repository**.

### Bước 2: Đẩy mã nguồn từ máy tính lên GitHub
Mở terminal tại thư mục dự án (`d:\math app`) và chạy các lệnh sau:

```bash
# 1. Khởi tạo kho lưu trữ Git cục bộ
git init

# 2. Thêm toàn bộ các file vào staging
git add .

# 3. Tạo commit đầu tiên
git commit -m "feat: Khoi tao du an Bang dieu khien Thong ke Toan 10 Clean Dashboard"

# 4. Đổi tên nhánh chính thành main
git branch -M main

# 5. Liên kết kho lưu trữ cục bộ với GitHub (thay URL bằng URL repo của bạn)
git remote add origin https://github.com/<tai-khoan-github-cua-ban>/math-statistics-dashboard.git

# 6. Đẩy toàn bộ mã nguồn lên GitHub
git push -u origin main
```

---

## 7. Hướng dẫn Deploy miễn phí lên Render (onrender.com)

[Render](https://render.com) là nền tảng điện toán đám mây tuyệt vời, cho phép triển khai ứng dụng web hoàn toàn miễn phí và tự động cập nhật khi bạn push code mới lên GitHub.

Dự án này đã được cấu hình sẵn để triển khai dưới dạng **Unified Web Service** (FastAPI vừa cung cấp API vừa phục vụ file build React), giúp bạn chỉ cần dùng **1 dịch vụ miễn phí duy nhất** mà không tốn chi phí và không gặp lỗi CORS!

### Bước 1: Đăng nhập Render
1. Truy cập [render.com](https://render.com).
2. Nhấn **Sign In** và chọn đăng nhập bằng tài khoản **GitHub**.

### Bước 2: Tạo Web Service mới
1. Tại bảng điều khiển Render Dashboard, nhấn nút **New +** ở góc trên cùng bên phải.
2. Chọn **Web Service**.
3. Chọn tùy chọn **Build and deploy from a Git repository**, sau đó nhấn **Next**.
4. Tìm và nhấn nút **Connect** bên cạnh kho lưu trữ `math-statistics-dashboard` bạn vừa đưa lên GitHub.

### Bước 3: Cấu hình thông số triển khai
Điền các trường cấu hình như sau:

| Trường cấu hình | Giá trị thiết lập | Ghi chú |
| :--- | :--- | :--- |
| **Name** | `math-statistics-dashboard` | Tên ứng dụng của bạn (sẽ tạo URL dạng `.onrender.com`) |
| **Region** | `Singapore (Southeast Asia)` | Vùng gần Việt Nam nhất để truy cập nhanh |
| **Branch** | `main` | Nhánh chứa code chính |
| **Root Directory** | *(Để trống)* | Render sẽ chạy từ thư mục gốc của repo |
| **Runtime** | `Python 3` | Môi trường máy chủ |
| **Build Command** | `./build.sh` | Script đã tạo sẵn để cài python và build frontend |
| **Start Command** | `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT` | Khởi chạy máy chủ FastAPI |
| **Instance Type** | `Free` (Miễn phí) | 512 MB RAM, 0.1 CPU, không tốn chi phí |

*(Lưu ý nếu Render không tự cấp quyền thực thi cho file `build.sh`, bạn có thể thay thế ô **Build Command** bằng lệnh trực tiếp sau):*
```bash
pip install -r requirements.txt && cd frontend && npm install && npm run build && cd ..
```

### Bước 4: Thiết lập biến môi trường (Environment Variables)
Cuộn xuống phần **Environment Variables**, nhấn **Add Environment Variable** để thêm các biến sau:
- Key: `PYTHON_VERSION` | Value: `3.10.12`
- Key: `NODE_VERSION` | Value: `20.10.0`

### Bước 5: Tiến hành Deploy
1. Nhấn nút **Create Web Service** ở cuối trang.
2. Render sẽ tự động kéo mã nguồn từ GitHub về, cài đặt Python dependencies, cài đặt npm packages, chạy `npm run build` để xuất mã React và kích hoạt máy chủ FastAPI.
3. Khi màn hình hiển thị `Your service is live 🎉`, bạn có thể nhấp vào đường link URL ở góc trên bên trái (ví dụ: `https://math-statistics-dashboard.onrender.com`).
4. **Chia sẻ link này cho bạn bè, học sinh, thầy cô giáo** — trang web có thể mở và sử dụng mượt mà trên cả điện thoại (Android, iPhone), máy tính bảng (iPad) lẫn máy tính bàn!

---

## 8. Hướng dẫn sử dụng chi tiết

### 8.1. Nhập dãy số liệu không đếm tần số
1. Nhấp chọn chế độ **"Dãy số liệu"** trên form nhập.
2. Đặt tên cho bài toán (Ví dụ: *Điểm kiểm tra 15 phút môn Toán*).
3. Nhập dãy số liệu vào ô nội dung:
   - Các số có thể ngăn cách bằng dấu phẩy `,`, dấu chấm phẩy `;` hoặc khoảng trắng.
   - Hỗ trợ số thập phân dấu chấm (ví dụ: `7.5, 8.2`) hoặc dấu phẩy kiểu Việt Nam khi dùng chấm phẩy phân tách (ví dụ: `7,5; 8,2; 9,0`).
4. Quan sát ngay bên dưới: hệ thống sẽ **tự động xác định cỡ mẫu $n$** và **sắp xếp dãy số tăng dần** theo thời gian thực!

### 8.2. Nhập mẫu số liệu có bảng tần số
1. Nhấp chọn chế độ **"Có tần số"**.
2. Nhập mỗi dòng là một cặp `Giá trị : Tần số` (hoặc `Giá trị ; Tần số`):
   ```text
   0: 4
   1: 12
   2: 18
   3: 5
   4: 1
   ```
3. Hệ thống sẽ tự động nhân bản giá trị theo đúng số lần xuất hiện và tính toán các số đặc trưng ngay lập tức.

### 8.3. Sử dụng tính năng "Tự động sinh dữ liệu mẫu"
- Nhấn nút **"Tự động sinh dữ liệu mẫu"** (biểu tượng ngôi sao lấp lánh trên thanh điều khiển hoặc header).
- Chọn 1 trong các bài toán thực tế chuẩn SGK Toán 10 (Điểm thi có học sinh bị ốm, Khảo sát chiều cao, Thời gian chạy 100m, Bảng tần số hộ gia đình).
- Dữ liệu và các số đặc trưng sẽ lập tức được điền và phân tích trực quan.

### 8.4. Đọc hiểu Biểu đồ hộp (Box Plot) & Nhận diện ngoại lệ
- **Thân hộp màu tím (Q1 đến Q3)**: Đại diện cho 50% số liệu tập trung ở trung tâm.
- **Vạch kẻ đậm ở giữa hộp (Me / Q2)**: Giá trị trung vị chia mẫu thành 2 nửa bằng nhau.
- **Hai râu hộp (Whiskers)**: Kéo dài từ hộp tới giá trị nhỏ nhất và lớn nhất không bị coi là ngoại lệ.
- **Chấm tròn đỏ phát sáng kèm nhãn giá trị**: Các điểm ngoại lệ (bất thường) vi phạm quy tắc $x < Q_1 - 1{,}5\Delta_Q$ hoặc $x > Q_3 + 1{,}5\Delta_Q$. Giáo viên và học sinh có thể lập tức phát hiện học sinh có kết quả thi bất thường hoặc số đo nhập sai sót.

### 8.5. Quản lý và Xuất dữ liệu CSV
- Nhấn nút **"Lưu dữ liệu vào CSV"**: Mẫu số liệu sẽ được lưu vĩnh viễn vào file CSV trên server.
- Tại bảng dữ liệu bên dưới:
  - Sử dụng ô **Tìm kiếm** để lọc nhanh theo tên bài toán.
  - Sử dụng bộ lọc để xem các bài toán có điểm ngoại lệ.
  - Nhấn biểu tượng con mắt để tải bài toán lên lại màn hình phân tích.
  - Nhấn nút **"Tải file CSV"** để xuất toàn bộ cơ sở dữ liệu về máy phục vụ in ấn hoặc báo cáo.

---

## 9. Giấy phép & Tác quyền
Dự án được xây dựng phục vụ mục đích giáo dục, phi thương mại, tuân thủ khung chương trình Giáo dục Phổ thông 2018 của Bộ Giáo dục và Đào tạo Việt Nam. Bạn được tự do sử dụng, chỉnh sửa và chia sẻ mã nguồn này!
