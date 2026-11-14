import React from 'react';
import { Menu, Sun, Moon, Download, Sparkles, BookOpen } from 'lucide-react';

export default function Header({
  onOpenMobileSidebar,
  isDarkMode,
  toggleDarkMode,
  onExportCsv,
  onOpenDemo,
  activeTab
}) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Bảng điều khiển tổng quan';
      case 'entry':
        return 'Nhập liệu mẫu số liệu mới';
      case 'reports':
        return 'Báo cáo & Phân tích thống kê';
      default:
        return 'Thống kê Toán 10 KNTT';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-none">
              {getTabTitle()}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Toán 10 GDPT 2018 (Kết Nối Tri Thức Với Cuộc Sống)
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenDemo}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Ví dụ SGK 10</span>
          </button>

          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800/80"
            title="Xuất cơ sở dữ liệu CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Chuyển chế độ Dark / Light"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
