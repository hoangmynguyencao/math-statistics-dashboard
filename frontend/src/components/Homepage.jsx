import React, { useState } from 'react';
import { 
  Sigma, 
  ArrowRight, 
  Calculator, 
  BarChart3, 
  Layers, 
  Sparkles, 
  AlertTriangle, 
  FileSpreadsheet, 
  Sun, 
  Moon, 
  Image as ImageIcon,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function Homepage({ 
  onStart, 
  isDarkMode, 
  toggleDarkMode 
}) {
  const [imageError, setImageError] = useState(false);

  // Đường dẫn ảnh trang chủ ưu tiên (hỗ trợ .png, .jpg, fallback về .svg)
  const [imageSrc, setImageSrc] = useState('/homepage-banner.svg');

  const handleImageError = () => {
    if (imageSrc !== '/homepage-banner.svg') {
      setImageSrc('/homepage-banner.svg');
    } else {
      setImageError(true);
    }
  };

  const features = [
    {
      icon: FileSpreadsheet,
      title: 'Nhập Liệu Mẫu Số Liệu Tự Do',
      desc: 'Hỗ trợ nhập trực tiếp dãy số cách nhau bởi dấu phẩy, chấm phẩy, khoảng trắng hoặc dạng Bảng phân bố tần số (Giá trị : Tần số).',
      badge: 'Linh hoạt'
    },
    {
      icon: Calculator,
      title: 'Đo Xu Thế Trung Tâm',
      desc: 'Tính toán chính xác Số trung bình cộng (x̄), Trung vị (Me = Q₂), Tứ phân vị (Q₁, Q₃) và Mốt (Mo) theo chuẩn SGK Toán 10.',
      badge: 'Chuẩn GDPT 2018'
    },
    {
      icon: Layers,
      title: 'Đo Độ Phân Tán Mẫu Số Liệu',
      desc: 'Xác định Khoảng biến thiên (R), Khoảng tứ phân vị (Δ_Q), Phương sai mẫu (s²), Độ lệch chuẩn (s) và Phương sai hiệu chỉnh.',
      badge: 'Toàn diện'
    },
    {
      icon: AlertTriangle,
      title: 'Phát Hiện Giá Trị Ngoại Lệ',
      desc: 'Áp dụng quy tắc x < Q₁ - 1,5Δ_Q hoặc x > Q₃ + 1,5Δ_Q để nhận diện các điểm dữ liệu dị biệt bất thường trong mẫu.',
      badge: 'Cảnh báo tự động'
    },
    {
      icon: BarChart3,
      title: 'Trực Quan Hóa Với Biểu Đồ',
      desc: 'Dựng Biểu đồ hộp (Box Plot) 5 số tóm tắt trực quan và Biểu đồ cột phân bố tần số với tương tác rê chuột xem chi tiết.',
      badge: 'Biểu đồ tương tác'
    },
    {
      icon: BookOpen,
      title: 'Các Bước Giải Chi Tiết & Trực Quan',
      desc: 'Trình bày từng bước thế số theo công thức chuẩn KaTeX Toán học và minh họa dữ liệu rõ ràng, dễ hiểu theo đúng SGK Toán 10.',
      badge: 'Lời giải chi tiết'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col justify-between">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Tên Web */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Sigma className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                  Toán 10 Thống Kê
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                  KNTT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Chương trình GDPT 2018 • Sách giáo khoa Kết nối tri thức với cuộc sống
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Chuyển chế độ Sáng / Tối"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Vào thống kê</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 px-4 sm:px-8">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-6xl mx-auto text-center space-y-6 sm:space-y-8">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Chương trình Giáo Dục Phổ Thông 2018</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>SGK Toán 10 Kết Nối Tri Thức</span>
            </div>

            {/* Tên web & Tiêu đề chính */}
            <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                BẢNG ĐIỀU KHIỂN &amp; XỬ LÝ{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500">
                  THỐNG KÊ TOÁN 10
                </span>
              </h1>
              <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto">
                Hệ thống chuyên sâu phục vụ học tập và giảng dạy: Nhập mẫu số liệu không ghép nhóm bất kỳ, 
                tự động phân tích các số đặc trưng đo xu thế trung tâm, số đặc trưng đo độ phân tán, 
                phát hiện giá trị ngoại lệ và minh họa bằng biểu đồ trực quan kèm lời giải chi tiết từng bước.
              </p>
            </div>

            {/* NÚT BẮT ĐẦU CHÍNH (ĐÚNG THEO YÊU CẦU: "NHẤN ĐỂ BẮT ĐẦU THỐNG KÊ") */}
            <div className="pt-2 sm:pt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={onStart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm sm:text-base tracking-wide uppercase shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all border border-indigo-400/30 cursor-pointer"
              >
                <span>NHẤN ĐỂ BẮT ĐẦU THỐNG KÊ</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5] animate-pulse" />
              </button>
            </div>

            {/* KHU VỰC HIỂN THỊ HÌNH ẢNH TRANG CHỦ (HERO IMAGE DISPLAY) */}
            <div className="pt-4 max-w-5xl mx-auto">
              <div className="relative group rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-2xl bg-slate-900 aspect-[16/8] sm:aspect-[16/7.5] flex items-center justify-center">
                {!imageError ? (
                  <img
                    src={imageSrc}
                    alt="Toán 10 Thống kê - Kết Nối Tri Thức Với Cuộc Sống"
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
                    <ImageIcon className="w-12 h-12 text-slate-500" />
                    <p className="text-sm font-medium">Chưa tìm thấy file ảnh tại /homepage-banner.svg</p>
                    <p className="text-xs text-slate-500">Hãy thêm file ảnh của bạn vào thư mục frontend/public/homepage-banner.png</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 5. PHẦN TỔNG QUAN CÁC CHỨC NĂNG CỦA WEB (FEATURES GRID) */}
        <section className="py-12 sm:py-16 px-4 sm:px-8 border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Section Heading */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
                Chức năng toàn diện
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Mọi công cụ thống kê mẫu số liệu bạn cần
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Thiết kế bám sát cấu trúc chương trình SGK Toán 10 Kết Nối Tri Thức Với Cuộc Sống, 
                đảm bảo tính chính xác và hỗ trợ trực quan tối đa.
              </p>
            </div>

            {/* 6 Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {features.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 6. CALL TO ACTION BOTTOM BANNER */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white border border-indigo-800/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-black">
                  Sẵn sàng phân tích mẫu số liệu của bạn?
                </h3>
                <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
                  Không cần dữ liệu mẫu có sẵn. Tự do nhập dãy số thực tế của bạn và nhận kết quả thống kê hoàn chỉnh chỉ trong vài giây.
                </p>
              </div>

              <button
                type="button"
                onClick={onStart}
                className="shrink-0 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-white text-indigo-950 hover:bg-indigo-50 font-extrabold text-sm uppercase tracking-wider shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <span>NHẤN ĐỂ BẮT ĐẦU THỐNG KÊ</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Bảng điều khiển nhập liệu và thống kê tự động • Chuẩn GDPT 2018 (SGK Toán 10 Kết Nối Tri Thức Với Cuộc Sống)</p>
          <button
            type="button"
            onClick={onStart}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            Vào ứng dụng thống kê →
          </button>
        </div>
      </footer>
    </div>
  );
}
