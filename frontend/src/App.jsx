import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  PlusCircle, 
  FileSpreadsheet, 
  BarChart2, 
  CheckCircle2, 
  TableProperties 
} from 'lucide-react';
import Homepage from './components/Homepage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KPICards from './components/KPICards';
import DataEntryForm from './components/DataEntryForm';
import StatisticsSummary from './components/StatisticsSummary';
import BoxPlotChart from './components/BoxPlotChart';
import FrequencyChart from './components/FrequencyChart';
import DataTable from './components/DataTable';
import SettingsModal from './components/SettingsModal';

import { computeStatistics } from './utils/statsCalculator';

// Tự động nhận diện API URL (nếu có biến môi trường VITE_API_URL, hoặc cùng origin)
const API_BASE = import.meta.env.VITE_API_URL || '';

export default function App() {
  // Theme Dark / Light mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('math_app_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Navigation tab: 'home' (Mặc định mở Homepage) | 'dashboard' | 'entry' | 'reports'
  const [activeTab, setActiveTab] = useState('home');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Data state: Hoàn toàn không nạp mẫu số liệu có sẵn, để người dùng tự nhập
  const [datasets, setDatasets] = useState([]);
  const [activeDataset, setActiveDataset] = useState(null);
  const [editingDataset, setEditingDataset] = useState(null); // null = Thêm mẫu mới; object = Chỉnh sửa mẫu cụ thể
  const [statsPreview, setStatsPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);

  const entryFormRef = useRef(null);

  // Áp dụng class dark cho thẻ html
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('math_app_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('math_app_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Tải danh sách datasets từ Backend FastAPI
  const fetchDatasets = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/datasets`);
      if (res.ok) {
        const data = await res.json();
        setDatasets(data);
        setApiOnline(true);
        if (data.length > 0 && !activeDataset) {
          setActiveDataset(data[0]);
          setStatsPreview(data[0].stats);
        }
        return;
      }
    } catch (err) {
      console.warn('Backend API chưa bật hoặc đang offline. Ứng dụng chạy ở chế độ cục bộ.');
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  // Tính toán preview khi activeDataset thay đổi
  useEffect(() => {
    if (activeDataset && (activeDataset.raw_data || activeDataset.rawData)) {
      const raw = activeDataset.raw_data || activeDataset.rawData;
      const calculated = computeStatistics(raw, activeDataset.mode || 'simple');
      setStatsPreview(calculated || activeDataset.stats);
    }
  }, [activeDataset]);

  // Cập nhật thống kê thời gian thực khi người dùng gõ phím trong form nhập liệu
  const handleDataChange = (formData) => {
    if (formData.raw_data && formData.raw_data.trim()) {
      const calculated = computeStatistics(formData.raw_data, formData.mode || 'simple');
      setStatsPreview(calculated);
    } else {
      setStatsPreview(null);
    }
  };

  // Bắt đầu thống kê từ Trang chủ (Nút 'NHẤN ĐỂ BẮT ĐẦU THỐNG KÊ')
  const handleStartStatistics = () => {
    if (datasets.length === 0) {
      handleNewDataset();
      setActiveTab('entry');
    } else {
      setActiveTab('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Thêm mẫu số liệu mới (người dùng tự nhập từ đầu)
  const handleQuickAdd = () => {
    handleNewDataset();
  };

  // Bắt đầu nhập mẫu số liệu mới (không gán id để luôn gọi POST tạo mẫu mới)
  const handleNewDataset = () => {
    setEditingDataset(null);
    setStatsPreview(null);
    setActiveTab('entry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý lưu mẫu số liệu mới (POST) hoặc cập nhật mẫu đang sửa (PUT)
  const handleSaveDataset = async (payload) => {
    setIsSaving(true);
    const isEditMode = Boolean(editingDataset?.id && !String(editingDataset.id).startsWith('local-'));
    const editId = editingDataset?.id;

    try {
      const url = isEditMode
        ? `${API_BASE}/api/datasets/${editId}`
        : `${API_BASE}/api/datasets`;
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedItem = await res.json();
        setDatasets(prev =>
          isEditMode
            ? prev.map(d => d.id === savedItem.id ? savedItem : d)
            : [savedItem, ...prev.filter(d => d.id !== savedItem.id)]
        );
        setActiveDataset(savedItem);
        setStatsPreview(savedItem.stats);
        setEditingDataset(null); // Luôn thoát khỏi chế độ sửa sau khi lưu thành công!
        setIsSaving(false);
        return true;
      }
    } catch (e) {
      console.warn('Không thể gửi đến backend, lưu cục bộ:', e);
    }

    // Fallback lưu cục bộ nếu backend chưa bật
    const clientStats = computeStatistics(payload.raw_data, payload.mode);
    const localId = isEditMode ? editId : 'local-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
    const updatedItem = {
      id: localId,
      name: payload.name,
      mode: payload.mode,
      raw_data: payload.raw_data,
      notes: payload.notes || '',
      stats: clientStats,
      created_at: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN')
    };

    setDatasets(prev =>
      isEditMode
        ? prev.map(d => d.id === localId ? updatedItem : d)
        : [updatedItem, ...prev]
    );
    setActiveDataset(updatedItem);
    setStatsPreview(clientStats);
    setEditingDataset(null);
    setIsSaving(false);
    return true;
  };

  // Xóa nhiều mẫu số liệu đồng thời (batch delete)
  const handleDeleteMultiple = async (ids) => {
    try {
      const res = await fetch(`${API_BASE}/api/datasets/batch-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ids)
      });
      if (!res.ok) {
        await Promise.all(ids.map(id => fetch(`${API_BASE}/api/datasets/${id}`, { method: 'DELETE' })));
      }
    } catch (e) {
      console.warn('Xóa batch từ backend lỗi, xóa cục bộ:', e);
    }

    const idSet = new Set(ids);
    const updated = datasets.filter(d => !idSet.has(d.id));
    setDatasets(updated);
    if (activeDataset?.id && idSet.has(activeDataset.id)) {
      const remaining = updated.length > 0 ? updated[0] : null;
      setActiveDataset(remaining);
      setStatsPreview(remaining ? remaining.stats : null);
    }
    if (editingDataset?.id && idSet.has(editingDataset.id)) {
      setEditingDataset(null);
    }
  };

  // Xóa mẫu số liệu
  const handleDeleteDataset = async (id) => {
    try {
      await fetch(`${API_BASE}/api/datasets/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Xóa từ backend lỗi, xóa cục bộ:', e);
    }

    const updated = datasets.filter(d => d.id !== id);
    setDatasets(updated);
    if (activeDataset?.id === id) {
      const remaining = updated.length > 0 ? updated[0] : null;
      setActiveDataset(remaining);
      setStatsPreview(remaining ? remaining.stats : null);
    }
    if (editingDataset?.id === id) {
      setEditingDataset(null);
    }
  };

  // Chỉnh sửa mẫu số liệu: đưa mẫu vào editingDataset và mở tab nhập liệu
  const handleEditDataset = (dataset) => {
    setEditingDataset(dataset);
    setActiveDataset(dataset);
    setStatsPreview(dataset.stats);
    setActiveTab('entry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xóa toàn bộ dữ liệu người dùng đã lưu
  const handleResetData = async () => {
    try {
      await fetch(`${API_BASE}/api/datasets/reset`, { method: 'POST' });
    } catch (e) {
      console.warn('Reset backend lỗi:', e);
    }
    setDatasets([]);
    setActiveDataset(null);
    setEditingDataset(null);
    setStatsPreview(null);
  };

  // NẾU ĐANG Ở TRANG CHỦ (HOMEPAGE)
  if (activeTab === 'home') {
    return (
      <Homepage
        onStart={handleStartStatistics}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
    );
  }

  // NẾU ĐANG Ở GIAO DIỆN LÀM VIỆC (WORKSPACE / DASHBOARD / ENTRY / REPORTS)
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Sidebar bên trái */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickAdd={handleQuickAdd}
        onNewDataset={handleNewDataset}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* 2. Main Content bên phải */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <Header
          onOpenMobileSidebar={() => setIsOpenMobile(true)}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onGoHome={() => setActiveTab('home')}
          activeTab={activeTab}
        />

        {/* Workspace body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* ============================================================== */}
          {/* TAB 1: TỔNG QUAN (Chỉ hiện nội dung cơ bản của mẫu số liệu) */}
          {/* ============================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {!activeDataset || (!activeDataset.raw_data && !activeDataset.rawData) ? (
                /* Chưa có mẫu số liệu nào */
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center max-w-2xl mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-inner">
                    <FileSpreadsheet className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Chưa có mẫu số liệu nào trong hệ thống
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                    Hệ thống hiện đang để trống để bạn tự do nhập dữ liệu thực tế. Nhấn nút bên dưới để bắt đầu nhập mẫu số liệu đầu tiên hoặc tải từ file Excel.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleNewDataset();
                        setActiveTab('entry');
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Nhập mẫu số liệu ngay
                    </button>
                  </div>
                </div>
              ) : (
                /* Đã có mẫu số liệu: Chỉ hiển thị nội dung cơ bản của mẫu số liệu */
                <>
                  {/* Header tóm tắt mẫu số liệu */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                          Mẫu số liệu đang chọn
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {activeDataset.mode === 'frequency' ? 'Bảng tần số' : 'Dãy số liệu'}
                        </span>
                      </div>
                      <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                        {activeDataset.name}
                      </h1>
                      {activeDataset.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {activeDataset.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditDataset(activeDataset)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('reports')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <span>Xem báo cáo chi tiết &amp; Biểu đồ</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 4 Thẻ KPI nổi bật (Nội dung thống kê cơ bản) */}
                  <KPICards stats={statsPreview} />

                  {/* Khối nội dung cơ bản của mẫu số liệu */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Nội dung cơ bản của mẫu số liệu
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        Cỡ mẫu: n = {statsPreview?.sample_size || 0}
                      </span>
                    </div>

                    {/* Dãy số liệu sắp xếp không giảm */}
                    {statsPreview?.sorted_values && statsPreview.sorted_values.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Dãy số liệu đã tự động sắp xếp không giảm (x₁ ≤ x₂ ≤ ... ≤ xₙ):
                        </label>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed max-h-28 overflow-y-auto break-words">
                          {statsPreview.sorted_values.map((v, i) => (
                            <span
                              key={i}
                              className={`inline-block px-1.5 py-0.5 m-0.5 rounded ${
                                statsPreview.outliers?.includes(v)
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-bold border border-rose-300 dark:border-rose-800'
                                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tóm tắt các mốc số trị cơ bản */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Giá trị nhỏ nhất (Min)</div>
                        <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{statsPreview?.min_value ?? '—'}</div>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Giá trị lớn nhất (Max)</div>
                        <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{statsPreview?.max_value ?? '—'}</div>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Khoảng biến thiên (R)</div>
                        <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{statsPreview?.range_val ?? '—'}</div>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Giá trị ngoại lệ</div>
                        <div className={`text-base font-bold mt-0.5 ${statsPreview?.outliers?.length ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {statsPreview?.outliers?.length ? `${statsPreview.outliers.length} điểm` : 'Không có'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bảng danh sách các mẫu số liệu đã lưu */}
                  <DataTable
                    datasets={datasets}
                    onSelectDataset={(item) => {
                      setActiveDataset(item);
                      setStatsPreview(item.stats);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onDeleteDataset={handleDeleteDataset}
                    onEditDataset={handleEditDataset}
                    activeDatasetId={activeDataset?.id}
                    onDeleteMultiple={handleDeleteMultiple}
                  />
                </>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: NHẬP LIỆU & QUẢN LÝ DANH SÁCH MẪU SỐ LIỆU */}
          {/* ============================================================== */}
          {activeTab === 'entry' && (
            <div className="space-y-6" ref={entryFormRef}>
              <DataEntryForm
                currentDataset={editingDataset}
                isEditing={Boolean(editingDataset?.id)}
                onCancelEdit={() => setEditingDataset(null)}
                onSave={handleSaveDataset}
                onDataChange={handleDataChange}
                onNewDataset={handleNewDataset}
                onViewReports={() => setActiveTab('reports')}
                statsPreview={statsPreview}
                isSaving={isSaving}
              />

              {/* Danh sách tất cả mẫu số liệu đã lưu */}
              {datasets.length > 0 && (
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Danh sách các mẫu số liệu đã lưu ({datasets.length})
                    </h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Có thể chỉnh sửa hoặc xóa từng mẫu, hoặc chọn nhiều mẫu để xóa đồng thời
                    </span>
                  </div>
                  <DataTable
                    datasets={datasets}
                    onSelectDataset={(item) => {
                      setActiveDataset(item);
                      setStatsPreview(item.stats);
                      setActiveTab('dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onDeleteDataset={handleDeleteDataset}
                    onEditDataset={handleEditDataset}
                    activeDatasetId={editingDataset?.id || activeDataset?.id}
                    onDeleteMultiple={handleDeleteMultiple}
                  />
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: BÁO CÁO & THỐNG KÊ (Chỉ đưa những báo cáo được và mẫu số liệu sau khi được nhập) */}
          {/* ============================================================== */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {!statsPreview ? (
                /* Chưa có dữ liệu */
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center max-w-2xl mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-inner">
                    <BarChart2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Chưa có mẫu số liệu để báo cáo
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                    Vui lòng nhập mẫu số liệu trước tại mục "Nhập liệu mới" để xem toàn bộ báo cáo phân tích, các số đặc trưng, lời giải KaTeX và biểu đồ.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('entry')}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Đến trang nhập liệu
                    </button>
                  </div>
                </div>
              ) : (
                /* Đã có số liệu: Mẫu số liệu sau khi nhập + Toàn bộ báo cáo thống kê & Biểu đồ */
                <>
                  {/* Header báo cáo & Bộ chọn mẫu số liệu */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                        Báo cáo &amp; Phân tích thống kê Toán 10 KNTT
                      </span>
                      <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                        {activeDataset?.name || 'Mẫu số liệu thống kê'}
                      </h1>
                      {activeDataset?.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {activeDataset.notes}
                        </p>
                      )}
                    </div>

                    {/* Bộ chọn nhanh bài toán nếu có nhiều hơn 1 mẫu */}
                    {datasets.length > 1 && (
                      <div className="flex items-center gap-2 text-xs shrink-0">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          Xem bài toán khác:
                        </span>
                        <select
                          value={activeDataset?.id || ''}
                          onChange={(e) => {
                            const target = datasets.find(d => d.id === e.target.value);
                            if (target) {
                              setActiveDataset(target);
                              setStatsPreview(target.stats);
                            }
                          }}
                          className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          {datasets.map(d => (
                            <option key={d.id} value={d.id}>
                              {d.name} (n={d.stats?.sample_size || '?'})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* 1. MẪU SỐ LIỆU SAU KHI ĐƯỢC NHẬP */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <TableProperties className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Mẫu số liệu sau khi được nhập
                        </h3>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        Cỡ mẫu: n = {statsPreview.sample_size}
                      </span>
                    </div>

                    {/* Dãy số liệu sắp xếp không giảm */}
                    {statsPreview.sorted_values && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Dãy số liệu đã sắp xếp theo thứ tự không giảm (x₁ ≤ x₂ ≤ ... ≤ xₙ):
                          </span>
                          {statsPreview.outliers && statsPreview.outliers.length > 0 && (
                            <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                              *Ô đỏ: Giá trị ngoại lệ bất thường
                            </span>
                          )}
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs leading-relaxed max-h-28 overflow-y-auto break-words">
                          {statsPreview.sorted_values.map((v, i) => (
                            <span
                              key={i}
                              className={`inline-block px-1.5 py-0.5 m-0.5 rounded ${
                                statsPreview.outliers?.includes(v)
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-bold border border-rose-300 dark:border-rose-800'
                                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bảng phân bố tần số & tần suất */}
                    {statsPreview.frequency_table && statsPreview.frequency_table.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          Bảng phân bố tần số &amp; tần suất của mẫu:
                        </span>
                        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                              <tr>
                                <th className="px-3 py-2">Giá trị (xᵢ)</th>
                                <th className="px-3 py-2">Tần số (nᵢ)</th>
                                <th className="px-3 py-2">Tần suất fᵢ (%)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {statsPreview.frequency_table.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                                  <td className="px-3 py-1.5 font-mono font-semibold text-slate-900 dark:text-white">{row.value}</td>
                                  <td className="px-3 py-1.5 font-mono text-slate-700 dark:text-slate-300">{row.frequency}</td>
                                  <td className="px-3 py-1.5 font-mono text-slate-500 dark:text-slate-400">{row.relative_freq}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* 5 số tóm tắt (Five-number summary) */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700/60 text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">Min (x₁)</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{statsPreview.min_value}</div>
                      </div>
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700/60 text-center">
                        <div className="text-[10px] text-indigo-500 uppercase font-semibold">Tứ phân vị Q₁</div>
                        <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{statsPreview.q1}</div>
                      </div>
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700/60 text-center">
                        <div className="text-[10px] text-purple-500 uppercase font-semibold">Trung vị Q₂ (Me)</div>
                        <div className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-0.5">{statsPreview.median}</div>
                      </div>
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700/60 text-center">
                        <div className="text-[10px] text-indigo-500 uppercase font-semibold">Tứ phân vị Q₃</div>
                        <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{statsPreview.q3}</div>
                      </div>
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700/60 text-center col-span-2 sm:col-span-1">
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">Max (xₙ)</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{statsPreview.max_value}</div>
                      </div>
                    </div>
                  </div>

                  {/* 2. NHỮNG BÁO CÁO ĐƯỢC (CÁC SỐ ĐẶC TRƯNG, LỜI GIẢI KATEX & BIỂU ĐỒ) */}
                  {/* 4 Thẻ KPI */}
                  <KPICards stats={statsPreview} />

                  {/* Thống kê chi tiết & Lời giải công thức KaTeX */}
                  <StatisticsSummary stats={statsPreview} />

                  {/* Khu vực 2 biểu đồ: Biểu đồ hộp Box Plot & Biểu đồ cột Tần số */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BoxPlotChart stats={statsPreview} />
                    <FrequencyChart stats={statsPreview} />
                  </div>
                </>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 transition-colors">
          Bảng điều khiển nhập liệu và thống kê tự động • Chuẩn GDPT 2018 (SGK Toán 10 Kết Nối Tri Thức Với Cuộc Sống)
        </footer>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onResetDemoData={handleResetData}
      />
    </div>
  );
}
