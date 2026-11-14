import React from 'react';
import { 
  Home,
  LayoutDashboard, 
  FileSpreadsheet, 
  FileBarChart2, 
  Settings, 
  PlusCircle, 
  Search, 
  Moon, 
  Sun, 
  BookOpen, 
  BarChart, 
  X,
  Sigma
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  onQuickAdd,
  isDarkMode,
  toggleDarkMode,
  isOpenMobile,
  setIsOpenMobile,
  searchQuery,
  setSearchQuery,
  onOpenSettings
}) {
  const menuItems = [
    {
      id: 'home',
      label: 'Trang chủ',
      sub: 'Giới thiệu & Hướng dẫn',
      icon: Home,
    },
    {
      id: 'dashboard',
      label: 'Tổng quan',
      sub: 'Bảng điều khiển chính',
      icon: LayoutDashboard,
    },
    {
      id: 'entry',
      label: 'Nhập liệu mới',
      sub: 'Mẫu số liệu Toán 10',
      icon: FileSpreadsheet,
    },
    {
      id: 'reports',
      label: 'Báo cáo & Thống kê',
      sub: 'Biểu đồ & Công thức',
      icon: FileBarChart2,
    },
    {
      id: 'settings',
      label: 'Cài đặt & Trợ giúp',
      sub: 'Công thức & Thông tin',
      icon: Settings,
    },
  ];

  const handleNavClick = (id) => {
    if (id === 'settings') {
      onOpenSettings();
    } else {
      setActiveTab(id);
    }
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Brand / Logo */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <button 
              type="button"
              onClick={() => {
                setActiveTab('home');
                setIsOpenMobile(false);
              }}
              className="flex items-center gap-3 text-left hover:opacity-90 transition-opacity cursor-pointer"
              title="Về Trang chủ"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                <Sigma className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-tight">
                  Toán 10 Thống Kê
                </h1>
                <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                  SGK Kết Nối Tri Thức
                </span>
              </div>
            </button>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setIsOpenMobile(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Button: Nhập số liệu mới */}
          <button
            type="button"
            onClick={() => {
              onQuickAdd();
              setIsOpenMobile(false);
            }}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tự nhập mẫu số liệu mới</span>
          </button>

          {/* Quick Search */}
          <div className="relative mt-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm mẫu số liệu..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Center: Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                    }`}
                  />
                  <div className="text-left flex-1">
                    <div>{item.label}</div>
                    <div className="text-[10px] font-normal text-slate-400 dark:text-slate-500">
                      {item.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveTab('home');
                setIsOpenMobile(false);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4 text-indigo-500" />
              <span>Về Trang chủ giới thiệu</span>
            </button>
          </div>
        </div>

        {/* Footer info & Dark mode toggle */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Giao diện {isDarkMode ? 'Tối' : 'Sáng'}
            </span>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Chuyển chế độ Dark / Light mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 text-[11px] text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800">
            <div className="font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Cơ sở dữ liệu CSV
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Lưu tự động vào datasets.csv
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
