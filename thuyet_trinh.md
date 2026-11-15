# 📊 Bảng Điều Khiển Thống Kê Toán 10
## Bài Thuyết Trình Giới Thiệu Dự Án

> *Ứng dụng web thống kê tự động theo chuẩn chương trình GDPT 2018 — SGK Toán 10 Kết nối tri thức với cuộc sống*

---

# PHẦN 1
# 🌟 GIỚI THIỆU TỔNG QUAN

---

## Đây là gì?

> **Một web application (ứng dụng web) full-stack chạy trực tuyến, cho phép học sinh và giáo viên nhập mẫu số liệu thống kê và nhận kết quả phân tích tự động — bao gồm các số đặc trưng, lời giải công thức, biểu đồ trực quan — theo đúng chuẩn kiến thức Toán 10 (GDPT 2018).**

Thay vì tính tay từng bước dễ nhầm lẫn, người dùng chỉ cần **nhập dữ liệu** — hệ thống tự động xử lý và render toàn bộ kết quả.

---

## Vấn đề cần giải quyết

| ❌ Cách cũ (tính tay) | ✅ Với ứng dụng này |
|---|---|
| Sắp xếp dãy số thủ công, dễ nhầm | Tự động sort ngay khi nhập |
| Tính trung vị, tứ phân vị mất nhiều bước | Cho kết quả tức thì, có lời giải từng bước |
| Khó phát hiện số liệu bất thường | Tự động detect & alert giá trị ngoại lệ |
| Không có biểu đồ | Biểu đồ hộp & biểu đồ cột render tự động |
| Phải tính lại từ đầu mỗi lần | Persistent storage — lưu nhiều mẫu, truy vấn bất cứ lúc nào |

---

## Đối tượng sử dụng

- 🎓 **Học sinh THPT** — Làm bài tập, kiểm tra kết quả, học công thức
- 👩‍🏫 **Giáo viên** — Soạn ví dụ, kiểm tra đáp án, minh họa trên lớp
- 📱 **Mọi thiết bị** — Responsive design: máy tính, điện thoại, máy tính bảng

---

# PHẦN 2
# 🛠️ CÔNG NGHỆ & KIẾN TRÚC HỆ THỐNG

---

## Mô hình kiến trúc tổng thể

Ứng dụng được xây dựng theo mô hình **Client–Server Architecture** kết hợp **Monorepo**, trong đó toàn bộ mã nguồn frontend và backend được quản lý trong cùng một repository Git.

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT (Trình duyệt)                        │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              PRESENTATION LAYER — FRONTEND              │   │
│   │         Single Page Application (SPA)                   │   │
│   │                                                         │   │
│   │   React 18  ·  Tailwind CSS  ·  KaTeX  ·  Lucide        │   │
│   │   Component-based UI  ·  State Management (useState)    │   │
│   └────────────────────┬────────────────────────────────────┘   │
└───────────────────────┼─────────────────────────────────────────┘
                        │ HTTP/REST API  (JSON payload)
                        │ XMLHttpRequest / Fetch API
┌───────────────────────┼─────────────────────────────────────────┐
│                       │      SERVER                             │
│   ┌───────────────────▼────────────────────────────────────┐   │
│   │              APPLICATION LAYER — BACKEND               │   │
│   │                 FastAPI (Python)                        │   │
│   │   RESTful API  ·  Pydantic Validation  ·  CORS         │   │
│   │   Business Logic  ·  Statistical Algorithms            │   │
│   └───────────────────┬────────────────────────────────────┘   │
│                       │ SQL Queries (sqlite3)                   │
│   ┌───────────────────▼────────────────────────────────────┐   │
│   │               DATA LAYER — PERSISTENCE                 │   │
│   │                   SQLite Database                       │   │
│   │          database.sqlite  ·  CRUD Operations           │   │
│   └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

> **Giải thích đơn giản**: Hệ thống có 3 tầng — tầng **giao diện** (người dùng thấy), tầng **xử lý nghiệp vụ** (tính toán), và tầng **lưu trữ dữ liệu**. Ba tầng giao tiếp với nhau qua các giao thức chuẩn.

---

## Tầng Giao diện — Frontend (Presentation Layer)

> **Frontend = Những gì người dùng nhìn thấy và tương tác. Toàn bộ chạy trong trình duyệt của người dùng.**

### ⚛️ React 18 — UI Library

**Thuật ngữ học thuật:** React là một **declarative, component-based JavaScript library** do Meta phát triển, triển khai kiến trúc **Virtual DOM** (DOM ảo) để tối ưu hóa quá trình re-render giao diện.

**Các khái niệm kỹ thuật được áp dụng:**
- **Component Architecture**: Giao diện được chia thành các component độc lập, tái sử dụng được (`Sidebar`, `DataEntryForm`, `BoxPlotChart`, `StatisticsSummary`...).
- **State Management**: Dùng `useState` và `useRef` hook để quản lý trạng thái ứng dụng (mẫu số liệu đang chọn, chế độ dark/light, dữ liệu form...).
- **Side Effects**: `useEffect` hook xử lý side effects (gọi API khi component mount, sync dữ liệu khi state thay đổi).
- **Unidirectional Data Flow**: Dữ liệu chảy một chiều từ parent component xuống child qua props, sự kiện đi ngược lại qua callback functions.
- **SPA (Single Page Application)**: Toàn bộ ứng dụng chỉ load một lần, điều hướng giữa các tab không gây reload trang.

> **Giải thích đơn giản**: React giúp giao diện **cập nhật tức thì** mà không cần tải lại trang — khi bạn nhập số, kết quả hiện ngay lập tức nhờ cơ chế Virtual DOM thông minh.

---

### 🎨 Tailwind CSS — Utility-First CSS Framework

**Thuật ngữ học thuật:** Tailwind CSS là một **utility-first CSS framework** sử dụng phương pháp thiết kế **atomic CSS** — mỗi class CSS chỉ thực hiện đúng một nhiệm vụ cụ thể (ví dụ: `text-sm`, `rounded-xl`, `shadow-lg`), khác với framework truyền thống BEM hay Bootstrap.

**Các tính năng được áp dụng:**
- **Responsive Design** với breakpoints (`sm:`, `md:`, `lg:`): Giao diện tự thích ứng với mọi kích thước màn hình.
- **Dark Mode** (`dark:` prefix): Chuyển đổi theme không cần viết thêm CSS riêng.
- **JIT (Just-In-Time) Compiler**: Chỉ generate các class CSS thực sự được dùng → bundle size nhỏ.
- **Custom Design System**: `tailwind.config.js` mở rộng palette màu, spacing, font-size theo chuẩn thiết kế riêng.

> **Giải thích đơn giản**: Tailwind giúp web **đẹp và responsive** trên mọi màn hình, hỗ trợ cả Light Mode và Dark Mode mà không cần viết thêm code CSS phức tạp.

---

### 📐 KaTeX — Mathematical Typesetting Library

**Thuật ngữ học thuật:** KaTeX là thư viện **client-side mathematical typesetting** hiệu năng cao, render công thức toán học từ cú pháp **LaTeX** (tiêu chuẩn de-facto trong xuất bản học thuật) thành SVG/HTML.

**Ưu điểm kỹ thuật so với MathJax:**
- Render nhanh hơn ~100 lần nhờ **synchronous rendering** (không cần chờ tải font).
- Không phụ thuộc DOM — render hoàn toàn **deterministic**.
- Font Computer Modern chuẩn TeX, đúng chuẩn hiển thị SGK.

> **Giải thích đơn giản**: Thay vì hiện chữ xấu `x_bar = sum/n`, KaTeX hiển thị: $\bar{x} = \dfrac{\sum x_i}{n}$ — đẹp và đúng chuẩn sách giáo khoa.

---

### 📊 XLSX (SheetJS) — Spreadsheet Parser

**Thuật ngữ học thuật:** SheetJS là thư viện **pure JavaScript** để parse và serialize các định dạng spreadsheet (`.xlsx`, `.xls`, `.csv`, `.ods`). Toàn bộ quá trình xử lý diễn ra **client-side** (trong trình duyệt), không upload file lên server → đảm bảo **data privacy**.

**Thuật toán nhận diện định dạng tự động:**
- Phân tích **aspect ratio** của sheet (số hàng vs số cột).
- Detect header row bằng cách kiểm tra kiểu dữ liệu (string vs number).
- Heuristic để phân biệt **cột dọc** (tall matrix) và **hàng ngang** (wide matrix).

> **Giải thích đơn giản**: Thư viện này đọc file Excel ngay trong trình duyệt và nhận diện tự động cả bảng dọc lẫn bảng ngang — không cần upload file lên máy chủ.

---

## Tầng Xử lý nghiệp vụ — Backend (Application Layer)

> **Backend = "Bếp núc" — toàn bộ tính toán & lưu trữ diễn ra ở đây, người dùng không thấy trực tiếp.**

### 🐍 Python 3.10+ — Programming Language

**Thuật ngữ học thuật:** Python là ngôn ngữ lập trình **interpreted, dynamically typed, garbage-collected** với cú pháp đơn giản và hệ sinh thái thư viện phong phú, đặc biệt mạnh trong **scientific computing** và **data processing**.

**Vai trò trong dự án:**
- **Statistical Algorithms**: Triển khai các thuật toán tính toán thống kê (mean, median, quartile, variance, standard deviation, outlier detection) đúng theo định nghĩa SGK Toán 10.
- **f-string formatting**: Sinh chuỗi LaTeX động cho lời giải công thức KaTeX.
- **Type Hints (PEP 484)**: Khai báo kiểu dữ liệu tường minh để tăng độ tin cậy.

**Lưu ý kỹ thuật — Python 3.14 compatibility:**
> Cú pháp f-string chặt hơn từ Python 3.14: ký tự `{,}` trong LaTeX bị parser hiểu nhầm là biểu thức Python rỗng → phải escape thành `{{,}}`.

---

### ⚡ FastAPI — Web Framework

**Thuật ngữ học thuật:** FastAPI là **modern, high-performance Python web framework** xây dựng trên **ASGI** (Asynchronous Server Gateway Interface) — chuẩn giao thức server Python thế hệ mới (kế thừa WSGI). FastAPI sử dụng **type annotations** của Python kết hợp **Pydantic** để tự động validate request/response và sinh tài liệu **OpenAPI (Swagger UI)**.

**Các tính năng được áp dụng trong dự án:**

| Tính năng | Mô tả kỹ thuật |
|-----------|---------------|
| **RESTful API Design** | 5 endpoints CRUD: `GET/POST/PUT/DELETE /api/datasets`, `POST /api/stats/calculate` |
| **Pydantic Models** | Schema validation tự động cho request body & response (`DatasetCreate`, `DatasetUpdate`, `StatsResult`) |
| **CORS Middleware** | Cross-Origin Resource Sharing — cho phép frontend (`:5173`) gọi backend (`:8000`) trong môi trường development |
| **Static File Serving** | Mount `frontend/dist` để phục vụ React SPA build trong production — không cần web server riêng (Nginx/Apache) |
| **Async/Await** | Các endpoint được định nghĩa là `async def` để tận dụng non-blocking I/O |
| **Lifespan Events** | `@app.on_event("startup")` khởi tạo database schema khi server start |

**RESTful API Endpoints:**
```
GET    /api/health              → Kiểm tra trạng thái server
GET    /api/datasets            → Lấy danh sách tất cả mẫu số liệu
POST   /api/datasets            → Tạo mới mẫu số liệu (HTTP 201 Created)
GET    /api/datasets/{id}       → Lấy chi tiết 1 mẫu theo ID
PUT    /api/datasets/{id}       → Cập nhật mẫu số liệu
DELETE /api/datasets/{id}       → Xóa mẫu số liệu
POST   /api/stats/calculate     → Tính thống kê tức thì (không lưu DB)
POST   /api/datasets/reset      → Xóa toàn bộ dữ liệu
```

> **Giải thích đơn giản**: FastAPI là "nhà ga" nhận yêu cầu từ giao diện, kiểm tra dữ liệu hợp lệ, rồi điều phối tính toán và lưu trữ.

---

### 🗄️ SQLite — Relational Database

**Thuật ngữ học thuật:** SQLite là **embedded, serverless, self-contained RDBMS** (Relational Database Management System) — không cần tiến trình server riêng, toàn bộ database lưu trong 1 file nhị phân duy nhất (`database.sqlite`). Module `sqlite3` tích hợp sẵn trong Python standard library (không cần `pip install`).

**Database Schema:**
```sql
CREATE TABLE IF NOT EXISTS datasets (
    id          TEXT PRIMARY KEY,     -- UUID tự sinh
    name        TEXT NOT NULL,        -- Tên bài toán
    mode        TEXT NOT NULL,        -- 'raw' | 'frequency'
    raw_data    TEXT NOT NULL,        -- Dữ liệu gốc (JSON string)
    notes       TEXT DEFAULT '',      -- Ghi chú
    n           INTEGER,              -- Cỡ mẫu
    mean        REAL,                 -- Số trung bình x̄
    median      REAL,                 -- Trung vị Mₑ
    q1          REAL,                 -- Tứ phân vị Q₁
    q3          REAL,                 -- Tứ phân vị Q₃
    variance    REAL,                 -- Phương sai s²
    std_dev     REAL,                 -- Độ lệch chuẩn s
    created_at  TEXT                  -- Timestamp ISO 8601
);
```

**Các thao tác CRUD được triển khai:**
- **Create**: `INSERT INTO datasets VALUES (...)` — lưu mẫu mới, tính toán thống kê trước khi insert.
- **Read**: `SELECT * FROM datasets ORDER BY created_at DESC` — lấy danh sách, hỗ trợ filter theo ID.
- **Update**: `UPDATE datasets SET ... WHERE id = ?` — cập nhật mẫu, tái tính toán thống kê.
- **Delete**: `DELETE FROM datasets WHERE id = ?` — xóa theo ID.

**Auto-migration từ CSV:** Khi khởi động lần đầu, hệ thống kiểm tra file `datasets.csv` cũ — nếu tồn tại, tự động migrate toàn bộ dữ liệu sang SQLite rồi archive file CSV.

> **Giải thích đơn giản**: SQLite là "cuốn sổ tay điện tử" lưu trữ vĩnh viễn các bài toán của bạn, tích hợp sẵn trong Python nên không cần cài thêm bất kỳ phần mềm nào.

---

### 📦 uv — Python Package & Environment Manager

**Thuật ngữ học thuật:** `uv` là **modern Python package installer and resolver** được viết bằng **Rust**, phát triển bởi Astral. `uv` triển khai thuật toán **dependency resolution** nhanh hơn `pip` ~10–100 lần nhờ:
- **Parallel downloading**: Tải đồng thời nhiều package.
- **Global cache**: Reuse package đã tải — không download lại.
- **Lock file** (`uv.lock`): Ghi chính xác hash & version của từng dependency → **reproducible builds** (cài trên máy khác cho ra kết quả y hệt).

**Cấu hình dự án (`pyproject.toml` — chuẩn PEP 517/518/621):**
```toml
[project]
name = "math-statistics-dashboard"
requires-python = ">=3.10"
dependencies = [
    "fastapi>=0.104.0",
    "uvicorn[standard]>=0.24.0",
    "pydantic>=2.4.0",
    "python-multipart>=0.0.6",
]
```

> **Giải thích đơn giản**: `uv` là công cụ cài thư viện Python thế hệ mới — nhanh hơn pip ~100 lần và đảm bảo chương trình chạy ổn định trên mọi máy tính.

---

## Luồng dữ liệu — Request/Response Lifecycle

```
[Người dùng nhập số]
         │
         ▼
[React: onChange handler]
  → Cập nhật state (useState)
  → Re-render: hiển thị preview (sort, cỡ mẫu n)
         │
         │ [Nhấn "Lưu mẫu số liệu"]
         ▼
[React: onSubmit → fetch() / XMLHttpRequest]
  → HTTP POST /api/datasets
  → Request body: { name, mode, raw_data, notes }
         │
         ▼
[FastAPI: POST /api/datasets endpoint]
  → Pydantic validation (DatasetCreate schema)
  → Gọi calculate_statistics() → Python algorithm
  → Gọi save_dataset_item() → SQL INSERT
  → Return: DatasetResponse (JSON)
         │
         ▼
[SQLite: database.sqlite]
  → Persist dữ liệu + kết quả thống kê
         │
         ▼
[FastAPI: HTTP 201 Created + JSON response]
         │
         ▼
[React: .then() callback]
  → Update state: datasets list, activeDataset
  → Re-render: KPI Cards, Charts, Formula table
  → Hiển thị: "Đã lưu thành công!"
```

---

## Kiến trúc Production — "Làm sao web chạy trên Internet?"

Điểm đặc biệt về mặt kỹ thuật: hệ thống sử dụng **single-service deployment** — FastAPI tự phục vụ cả API lẫn static files của React SPA.

```python
# main.py — FastAPI mount React build
if FRONTEND_DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST_DIR / "assets"))

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = FRONTEND_DIST_DIR / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST_DIR / "index.html")  # SPA fallback
```

**Lợi ích:**
- **Không cần reverse proxy** (Nginx/Apache): 1 process duy nhất phục vụ cả frontend + backend.
- **Không có CORS issue** trong production: Frontend và API cùng origin.
- **Tiết kiệm tài nguyên**: Phù hợp với gói **Free Tier** của Render.

```
┌─────────────┐    git push     ┌─────────────┐    webhook     ┌──────────────┐
│   Dev       │ ──────────────▶ │   GitHub    │ ─────────────▶ │    Render    │
│  Machine    │                 │ (Remote     │    trigger     │  CI/CD Build │
│             │                 │  Repository)│                │              │
└─────────────┘                 └─────────────┘                └──────┬───────┘
                                                                       │
                                                            build.sh:  │
                                                            1. uv pip install
                                                            2. npm install
                                                            3. npm run build
                                                                       │
                                                                       ▼
                                                               ┌───────────────┐
                                                               │  Web Service  │
                                                               │  (Python 3.13)│
                                                               │  Port: $PORT  │
                                                               │               │
                                                               │  FastAPI      │
                                                               │  + React dist │
                                                               └───────────────┘
                                                                       │
                                                               URL công khai:
                                                       https://math-statistics-
                                                        dashboard.onrender.com
```

---

## Tổng quan Stack công nghệ

```
📦 TECHNOLOGY STACK
│
├── 🖥️  FRONTEND — Presentation Layer
│   ├── React 18          → Declarative UI, Virtual DOM, Component Architecture
│   ├── Vite 5            → Modern build tool, HMR (Hot Module Replacement)
│   ├── Tailwind CSS      → Utility-first CSS, Responsive, Dark Mode
│   ├── KaTeX             → Client-side LaTeX typesetting
│   ├── Lucide React      → SVG icon library
│   └── XLSX (SheetJS)    → Client-side spreadsheet parser
│
├── ⚙️  BACKEND — Application & Data Layer
│   ├── Python 3.10+      → Business logic, Statistical algorithms
│   ├── FastAPI           → ASGI web framework, RESTful API, OpenAPI docs
│   ├── Pydantic v2       → Data validation & serialization
│   ├── SQLite (sqlite3)  → Embedded RDBMS, persistent storage
│   ├── Uvicorn           → ASGI server (production & development)
│   └── uv                → Package manager (Rust-based, lock file)
│
└── 🚀 INFRASTRUCTURE — DevOps & Deployment
    ├── Git               → Version control (distributed VCS)
    ├── GitHub            → Remote repository, source of truth
    ├── Render            → PaaS (Platform-as-a-Service), free tier
    ├── build.sh          → CI build script (Bash)
    └── render.yaml       → Infrastructure-as-Code (IaC) config
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
│   (Navigation)   │      (Main Content / Workspace)             │
│                  │                                              │
│  🏠 Trang chủ    │   ← Nội dung thay đổi tùy tab (SPA routing) │
│  📊 Tổng quan    │                                              │
│  ✏️  Nhập liệu   │                                              │
│  📈 Báo cáo      │                                              │
│                  │                                              │
│  [+ Thêm mới]    │                                              │
│                  │                                              │
│  🗄️ SQLite DB    │                                              │
│     (Connected)  │                                              │
└──────────────────┴──────────────────────────────────────────────┘
```

---

## Bước 1 — Truy cập & Khởi động

1. Truy cập URL công khai (ví dụ: `https://math-statistics-dashboard.onrender.com`)
2. SPA được hydrate — bạn thấy **Trang chủ** với banner giới thiệu.
3. Nhấn **"NHẤN ĐỂ BẮT ĐẦU THỐNG KÊ"** → Router chuyển vào workspace.

---

## Bước 2 — Nhập mẫu số liệu (Tab "Nhập liệu mới")

### Chế độ A: Dãy số liệu thô (Raw Data Mode)

Chọn **"Dãy số liệu"** → gõ trực tiếp:

```
Ví dụ: Điểm kiểm tra Toán 12 học sinh

  7.5; 8.0; 6.5; 9.0; 8.5; 7.0; 8.0; 9.5; 4.0; 8.5; 1.5; 10.0

Delimiter được hỗ trợ:  dấu phẩy ","  |  dấu chấm phẩy ";"  |  khoảng trắng
```

**Real-time processing** (xử lý tức thì khi nhập):
- Parser tách chuỗi → mảng số thực → sort ascending
- Tính cỡ mẫu `n = 12` và hiển thị dãy đã sắp xếp

---

### Chế độ B: Bảng tần số (Frequency Table Mode)

Chọn **"Có tần số"** → nhập theo dạng `value: frequency`:

```
Ví dụ: Số con trong mỗi gia đình (40 hộ)

  0: 4
  1: 12
  2: 18
  3: 5
  4: 1

→ n = Σnᵢ = 4 + 12 + 18 + 5 + 1 = 40
  Parser tự động expand thành dãy số đầy đủ trước khi tính
```

---

### Chế độ C: Import từ Excel (File Upload + Client-side Parse)

```
Nhấn "Nhập từ Excel (.xlsx / .xls)"
→ File API (browser) → ArrayBuffer
→ XLSX.read() → WorkBook object → Sheet data
→ Heuristic detection algorithm:
```

**Thuật toán nhận diện định dạng tự động:**

```
Dạng CỘT DỌC (Portrait / Vertical):     Dạng HÀNG NGANG (Landscape / Horizontal):
┌────┬────┐                             ┌────┬────┬────┬────┬────┐
│ xi │ ni │  ← Header row (auto-skip)  │ xi │ 0  │ 1  │ 2  │ 3  │
├────┼────┤                             ├────┼────┼────┼────┼────┤
│  0 │  4 │                             │ ni │ 4  │ 12 │ 18 │ 5  │
│  1 │ 12 │                             └────┴────┴────┴────┴────┘
│  2 │ 18 │
│  3 │  5 │     Cả 2 dạng → auto-detect & parse ✅
└────┴────┘

Logic: IF cols > rows → Hàng ngang ELSE → Cột dọc
```

---

## Bước 3 — Lưu vào Database

1. Nhập **Tên bài toán** (metadata) + **Ghi chú** (optional)
2. Nhấn **"Lưu mẫu số liệu"** → gửi `HTTP POST /api/datasets`

**Vòng đời request (Request Lifecycle):**
```
Client → POST /api/datasets { name, mode, raw_data }
       ← 201 Created { id, name, stats..., created_at }
```

**Sau khi nhận response thành công:**
```
✅ Đã lưu thành công!

[Nhập mẫu tiếp theo]    [Xem báo cáo →]
```

> **Nút thay đổi nhãn theo context:**
> - **"Lưu mẫu số liệu"** → khi `activeDataset.id` không tồn tại (POST)
> - **"Cập nhật"** → khi đang chỉnh sửa mẫu cũ (PUT)

---

## Bước 4 — Xem kết quả (Tab "Báo cáo & Thống kê")

### 4.1. Data Summary Panel

```
📋 DÃY SỐ GỐC (raw input):
1.5  4.0  7.0  7.5  8.0  8.0  8.5  8.5  9.0  9.5  10.0 ...

📋 DÃY SỐ SẮP XẾP KHÔNG GIẢM (sorted array):
1.5  4.0  6.5  7.0  7.5  8.0  8.0  8.5  8.5  9.0  9.5  10.0
 🔴  🔴                                               ← Outliers được highlight

📋 BẢNG PHÂN BỐ TẦN SỐ & TẦN SUẤT (Frequency Distribution Table)

📋 5 SỐ TÓM TẮT (Five-Number Summary):
     Min  |   Q₁   |   Q₂   |   Q₃   |   Max
     1.5  |  6.875  |  8.0   |  8.75  |  10.0
```

---

### 4.2. KPI Dashboard Cards

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Sample Size │  │     Mean     │  │    Median    │  │     IQR      │
│              │  │              │  │              │  │              │
│    n = 12    │  │  x̄ = 7.75   │  │  Mₑ = 8.0   │  │  ΔQ = 1.875  │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

---

### 4.3. Outlier Detection Alert

```
⚠️  PHÁT HIỆN 2 GIÁ TRỊ NGOẠI LỆ

Điều kiện IQR Rule:
  Lower fence = Q₁ - 1.5 × IQR = 6.875 - 1.5 × 1.875 = 4.0625
  Upper fence = Q₃ + 1.5 × IQR = 8.75  + 1.5 × 1.875 = 11.5625

→ x < 4.0625 hoặc x > 11.5625
→ Giá trị ngoại lệ: { 1.5 }
```

---

### 4.4. KaTeX Formula Rendering — Lời giải từng bước

Mỗi số đặc trưng được render với **3 lớp thông tin**:

```
1. Công thức tổng quát (general formula):
   x̄ = (1/n) × Σᵢxᵢ

2. Phép thế số (substitution step):
   x̄ = (1.5 + 4.0 + 6.5 + ... + 10.0) / 12
     = 93.0 / 12

3. Kết quả (result):
   x̄ ≈ 7.75
```

*(Render bằng KaTeX thành LaTeX chuẩn trong trang web thực)*

**Danh sách đầy đủ các số đặc trưng được tính:**

| Nhóm | Ký hiệu | Tên |
|------|---------|-----|
| Xu thế trung tâm | $\bar{x}$ | Số trung bình cộng |
| | $M_e$ | Trung vị |
| | $Q_1, Q_2, Q_3$ | Tứ phân vị |
| | $M_o$ | Mốt |
| Độ phân tán | $R$ | Khoảng biến thiên |
| | $\Delta_Q$ | Khoảng tứ phân vị (IQR) |
| | $s^2$ | Phương sai mẫu |
| | $s$ | Độ lệch chuẩn |
| | $s_{n-1}^2$ | Phương sai hiệu chỉnh Bessel |

---

### 4.5. Box Plot — SVG Visualization

```
        Q₁       Mₑ      Q₃
     6.875      8.0    8.75
         │       │       │
 ○───────┼███████┼███████┼──────────── ─ ─ ─ ─ ○
1.5   4.063     8.0    8.75  11.563          (ngoại lệ nếu có)
 🔴                                               🔴

Legend:
  ●  = Outlier (IQR rule: x < Q₁-1.5ΔQ hoặc x > Q₃+1.5ΔQ)
  ───= Whisker (vùng dữ liệu hợp lệ, non-outlier)
  ███= Box (interquartile range — IQR, chứa 50% dữ liệu)
  |  = Median line (Q₂)
```

**Implementation**: Box plot được vẽ bằng **SVG thuần** (không dùng thư viện chart) — tính toán tọa độ dựa trên `viewBox` normalize về `[0, 1]`.

**Interactive**: Hover chuột vào outlier point → hiện **tooltip** với giá trị chính xác.

---

### 4.6. Frequency Bar Chart

```
Freq │
  8  │      ████
  6  │      ████  ████
  4  │ ████  ████  ████
  2  │ ████  ████  ████  ████  ████
  0  └──────────────────────────────
       1.5   4.0   6.5  ...  10.0
              xᵢ (Giá trị)
```

---

## Bước 5 — Quản lý Dataset (Tab "Tổng quan")

### DataTable Component — CRUD Interface

```
┌────┬──────────────────────────┬────────┬───────────┬──────────┐
│ #  │ Tên bài toán             │ n      │   x̄       │ Actions  │
├────┼──────────────────────────┼────────┼───────────┼──────────┤
│ 1  │ Điểm Toán lớp 10A1      │  12    │  7.75     │ ✏️ 🗑️   │
│ 2  │ Chiều cao học sinh       │  30    │  165.3    │ ✏️ 🗑️   │
│ 3  │ Số con trong gia đình    │  40    │  1.675    │ ✏️ 🗑️   │
└────┴──────────────────────────┴────────┴───────────┴──────────┘

Filter: [🔍 Tìm kiếm...] [Lọc theo chế độ ▾] [Sắp xếp theo ▾]
```

**Thao tác:**
- Nhấp vào dòng → `GET /api/datasets/{id}` → load vào `activeDataset` state
- **✏️ Sửa** → Pre-fill form → `PUT /api/datasets/{id}` khi lưu
- **🗑️ Xóa** → Confirm dialog → `DELETE /api/datasets/{id}`

### Dataset Selector trong trang Báo cáo

```
Đang xem: [Điểm Toán lớp 10A1 ▾]   ← Dropdown để switch dataset nhanh
```

---

## Tổng hợp các nút & chức năng chính

| Nút / Element | HTTP Method | Chức năng |
|---|---|---|
| **"Lưu mẫu số liệu"** | `POST /api/datasets` | Tạo mới dataset, lưu DB |
| **"Cập nhật"** | `PUT /api/datasets/{id}` | Cập nhật dataset hiện tại |
| **"Xem báo cáo →"** | — | Client-side route change |
| **"Nhập mẫu tiếp theo"** | — | Reset form state |
| **✏️** (Sửa) | — | Load dataset vào form |
| **🗑️** (Xóa) | `DELETE /api/datasets/{id}` | Xóa khỏi SQLite |
| **⚙️** (Cài đặt) | `POST /api/datasets/reset` | Xóa toàn bộ DB |
| **🌙 / ☀️** | — | Toggle dark mode (localStorage) |

---

# PHẦN 4
# 📐 NỘI DUNG TOÁN HỌC

---

## Các số đặc trưng được tính toán

### Nhóm 1 — Đo xu thế trung tâm (Measures of Central Tendency)

| Ký hiệu | Tên | Ý nghĩa |
|---------|-----|---------|
| $\bar{x}$ | Số trung bình cộng (Mean) | Giá trị "bình quân" của toàn bộ mẫu |
| $M_e$ | Trung vị (Median) | Giá trị chính giữa khi sort tăng dần |
| $Q_1, Q_2, Q_3$ | Tứ phân vị (Quartiles) | Chia sorted array thành 4 phần bằng nhau |
| $M_o$ | Mốt (Mode) | Giá trị có tần số xuất hiện cao nhất |

### Nhóm 2 — Đo độ phân tán (Measures of Dispersion)

| Ký hiệu | Tên | Ý nghĩa |
|---------|-----|---------|
| $R$ | Khoảng biến thiên (Range) | `max - min` — độ trải rộng toàn bộ |
| $\Delta_Q$ | Khoảng tứ phân vị (IQR) | `Q₃ - Q₁` — độ trải rộng 50% trung tâm |
| $s^2$ | Phương sai mẫu (Sample Variance) | Trung bình bình phương độ lệch |
| $s$ | Độ lệch chuẩn (Standard Deviation) | Căn bậc hai của phương sai |
| $s_{n-1}^2$ | Phương sai hiệu chỉnh (Bessel's Correction) | Ước lượng không thiên lệch của tổng thể |

---

## Quy tắc phát hiện giá trị ngoại lệ — IQR Method

$$x < Q_1 - 1{,}5 \times \Delta_Q \quad \text{hoặc} \quad x > Q_3 + 1{,}5 \times \Delta_Q$$

```
     Lower Fence              Upper Fence
  Q₁ - 1.5×IQR            Q₃ + 1.5×IQR
         │                        │
─────────┼────────────────────────┼─────────
         │←── Vùng bình thường ──→│
○                                           ○
(outlier min)                   (outlier max)
```

> **Lưu ý**: Đây là phương pháp **Tukey's Fences** (1977) — tiêu chuẩn trong thống kê mô tả, được SGK Toán 10 KNTT 2018 áp dụng.

---

## Thuật toán tính Tứ phân vị — Chuẩn SGK Toán 10 KNTT

> **Quan trọng**: Có nhiều convention khác nhau để tính $Q_1, Q_3$. Chương trình này triển khai **đúng theo định nghĩa SGK Toán 10 Kết nối tri thức** (không phải cách tính của Excel hay một số máy tính khoa học).

```
Cho dãy số đã sắp xếp x₁ ≤ x₂ ≤ ... ≤ xₙ

Q₂ = Mₑ (trung vị toàn dãy)

Khi n lẻ (n = 2k+1):
  Q₂ = x_{k+1}
  Nửa dưới: { x₁, ..., x_k }  (không gồm Q₂)
  Nửa trên: { x_{k+2}, ..., x_{2k+1} }  (không gồm Q₂)
  Q₁ = trung vị nửa dưới
  Q₃ = trung vị nửa trên

Khi n chẵn (n = 2k):
  Q₂ = (x_k + x_{k+1}) / 2
  Nửa dưới: { x₁, ..., x_k }
  Nửa trên: { x_{k+1}, ..., x_{2k} }
  Q₁ = trung vị nửa dưới
  Q₃ = trung vị nửa trên
```

---

# PHẦN 5
# 🚀 ĐIỂM NỔI BẬT

---

## So sánh với các công cụ khác

| Tiêu chí | Máy tính cầm tay | Excel | Trang web này |
|----------|-----------------|-------|---------------|
| Tốc độ tính toán | Chậm, nhiều bước | Trung bình | ⚡ Real-time |
| Lời giải công thức | ❌ | ❌ | ✅ KaTeX từng bước |
| Phát hiện outlier | ❌ Phải tự tính | ⚠️ Phức tạp | ✅ Tự động, visual alert |
| Box Plot | ❌ | ⚠️ Khó vẽ chuẩn | ✅ SVG render, hover tooltip |
| Import Excel | ❌ | — | ✅ Cột dọc + Hàng ngang |
| Persistent storage | ❌ | ⚠️ Thủ công | ✅ SQLite, CRUD đầy đủ |
| Responsive design | ❌ | ❌ | ✅ Mobile-first |
| Chuẩn SGK Toán 10 | ❓ | ❌ Khác convention | ✅ 100% đúng định nghĩa |
| Chi phí | Mua thiết bị | License | 🆓 Miễn phí |

---

## Điểm đặc biệt về mặt kỹ thuật

| Quyết định thiết kế | Lý do / Lợi ích |
|---|---|
| **Single-service deployment** (FastAPI serve React) | Không cần 2 server, không CORS issue, free tier Render |
| **SQLite thay CSV** | ACID compliance, concurrent-safe, query linh hoạt |
| **uv thay pip** | 100x faster install, reproducible builds qua lock file |
| **SVG thuần cho Box Plot** | Không phụ thuộc chart library, full control, nhẹ hơn |
| **Client-side Excel parse** | Data privacy — file không upload lên server |
| **SPA với React Router** | UX mượt mà, không reload trang khi chuyển tab |
| **Pydantic v2** | Validation nhanh, type-safe, tự động sinh OpenAPI docs |

---

## Hành trình phát triển — AI-Assisted Development

```
[Prompt mô tả yêu cầu chi tiết]
         │
         ▼ AI generate code
[Codebase khởi tạo] ──── Iteration 1
         │
         ▼ Test thực tế → phát hiện bugs
  • SyntaxError: f-string Python 3.14
  • Windows PATH: python stub vs real executable
  • State bug: chỉ lưu được 1 mẫu (POST vs PUT nhầm)
  • useEffect: sync form đè lên input đang gõ
         │
         ▼ Bug fixes + Feature requests
  ✅ Homepage + demo data removed
  ✅ Excel import (multi-format detection)
  ✅ 3-tab layout (dashboard / entry / reports)
  ✅ CSV → SQLite migration
  ✅ pip → uv migration
         │
         ▼
[Production-ready version] ──── GitHub ──── Render
```

> **Takeaway**: AI-assisted development rút ngắn thời gian từ concept → deployment từ **tuần/tháng xuống vài giờ**. Tuy nhiên, **human review và iterative testing** vẫn không thể thiếu để đảm bảo correctness.

---

# KẾT LUẬN

> Dự án là ví dụ thực tế về **AI-augmented software development** — kết hợp sức mạnh của Large Language Models trong việc sinh code với khả năng review và điều hướng của người dùng cuối.
>
> **Kết quả**: Từ một prompt mô tả yêu cầu → ứng dụng web full-stack production-ready, chạy miễn phí trên Internet — trong vài giờ, không cần background lập trình sâu.

---

**🔗 Source code (MIT License):** https://github.com/hoangmynguyencao/math-statistics-dashboard

**🌐 Live demo:** https://math-statistics-dashboard.onrender.com

**📚 API Docs (Swagger UI):** https://math-statistics-dashboard.onrender.com/docs

---

*Dự án phục vụ mục đích giáo dục, phi thương mại — Tự do sử dụng, chỉnh sửa và chia sẻ theo chuẩn chương trình GDPT 2018.*
