import React, { useState, useEffect, useMemo, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KPICards from './components/KPICards';
import DataEntryForm from './components/DataEntryForm';
import StatisticsSummary from './components/StatisticsSummary';
import BoxPlotChart from './components/BoxPlotChart';
import FrequencyChart from './components/FrequencyChart';
import DataTable from './components/DataTable';
import DemoSelectorModal from './components/DemoSelectorModal';
import SettingsModal from './components/SettingsModal';

import { computeStatistics } from './utils/statsCalculator';
import { DEMO_DATA_PRESETS } from './utils/demoData';

// Tự động nhận diện API URL (nếu có biến môi trường VITE_API_URL, hoặc cùng origin)
const API_BASE = import.meta.env.VITE_API_URL || '';

export default function App() {
  // Theme Dark / Light mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('math_app_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | entry | reports
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Data state
  const [datasets, setDatasets] = useState([]);
  const [activeDataset, setActiveDataset] = useState(null);
  const [statsPreview, setStatsPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);

  const entryFormRef = useRef(null);

  // Áp dụng class dark cho html tag
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
      console.warn('Backend API chưa sẵn sàng hoặc đang offline. Sử dụng dữ liệu khởi tạo trên trình duyệt.', err);
    }

    // Fallback: Nếu backend chưa bật hoặc chạy độc lập, nạp presets
    if (datasets.length === 0) {
      const fallbackList = DEMO_DATA_PRESETS.map((d) => ({
        id: d.id,
        name: d.name,
        mode: d.mode,
        raw_data: d.rawData,
        notes: d.notes,
        stats: computeStatistics(d.rawData, d.mode),
        created_at: 'Mặc định'
      }));
      setDatasets(fallbackList);
      if (fallbackList.length > 0 && !activeDataset) {
        setActiveDataset(fallbackList[0]);
        setStatsPreview(fallbackList[0].stats);
      }
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  // Tính toán preview khi activeDataset thay đổi
  useEffect(() => {
    if (activeDataset) {
      const raw = activeDataset.raw_data || activeDataset.rawData;
      const calculated = computeStatistics(raw, activeDataset.mode || 'simple');
      setStatsPreview(calculated || activeDataset.stats);
    }
  }, [activeDataset]);

  // Xử lý lưu mẫu số liệu mới hoặc cập nhật
  const handleSaveDataset = async (payload) => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/datasets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedItem = await res.json();
        // Cập nhật danh sách
        setDatasets(prev => [savedItem, ...prev.filter(d => d.id !== savedItem.id)]);
        setActiveDataset(savedItem);
        setStatsPreview(savedItem.stats);
        setIsSaving(false);
        return true;
      }
    } catch (e) {
      console.warn('Không thể gửi đến backend, lưu cục bộ:', e);
    }

    // Fallback lưu cục bộ nếu server chưa bật
    const clientStats = computeStatistics(payload.raw_data, payload.mode);
    const newItem = {
      id: 'local-' + Date.now().toString(36),
      name: payload.name,
      mode: payload.mode,
      raw_data: payload.raw_data,
      notes: payload.notes || '',
      stats: clientStats,
      created_at: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN')
    };

    setDatasets(prev => [newItem, ...prev]);
    setActiveDataset(newItem);
    setStatsPreview(clientStats);
    setIsSaving(false);
    return true;
  };

  // Chọn mẫu từ preset SGK
  const handleSelectPreset = (preset) => {
    const calculated = computeStatistics(preset.rawData, preset.mode);
    const chosen = {
      id: preset.id,
      name: preset.name,
      mode: preset.mode,
      raw_data: preset.rawData,
      notes: preset.notes,
      stats: calculated
    };
    setActiveDataset(chosen);
    setStatsPreview(calculated);
    setActiveTab('entry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Thêm dữ liệu nhanh từ sidebar
  const handleQuickAdd = () => {
    setActiveDataset({
      name: 'Mẫu số liệu mới ' + (datasets.length + 1),
      mode: 'simple',
      raw_data: '',
      notes: ''
    });
    setStatsPreview(null);
    setActiveTab('entry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      setActiveDataset(updated.length > 0 ? updated[0] : null);
    }
  };

  // Chỉnh sửa mẫu số liệu
  const handleEditDataset = (dataset) => {
    setActiveDataset(dataset);
    setActiveTab('entry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Khôi phục dữ liệu mẫu mặc định
  const handleResetDemoData = async () => {
    try {
      await fetch(`${API_BASE}/api/datasets/reset`, { method: 'POST' });
    } catch (e) {
      console.warn('Reset backend lỗi:', e);
    }
    await fetchDatasets();
  };

  // Tải file CSV từ server hoặc tự tạo file CSV trên client
  const handleExportCsv = () => {
    if (apiOnline) {
      window.open(`${API_BASE}/api/export/csv`, '_blank');
      return;
    }

    // Tự sinh file CSV từ datasets hiện có
    const headers = ["id", "name", "mode", "raw_data", "sample_size", "mean", "median", "q1", "q3", "iqr", "range_val", "variance", "std_dev", "notes", "created_at"];
    const rows = datasets.map(d => [
      d.id,
      `"${d.name.replace(/"/g, '""')}"`,
      d.mode,
      `"${(d.raw_data || '').replace(/"/g, '""')}"`,
      d.stats?.sample_size || 0,
      d.stats?.mean || 0,
      d.stats?.median || 0,
      d.stats?.q1 || 0,
      d.stats?.q3 || 0,
      d.stats?.iqr || 0,
      d.stats?.range_val || 0,
      d.stats?.variance || 0,
      d.stats?.std_dev || 0,
      `"${(d.notes || '').replace(/"/g, '""')}"`,
      `"${d.created_at || ''}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bang_thong_ke_toan10.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Sidebar bên trái */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickAdd={handleQuickAdd}
        onOpenDemo={() => setIsDemoModalOpen(true)}
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
          onExportCsv={handleExportCsv}
          onOpenDemo={() => setIsDemoModalOpen(true)}
          activeTab={activeTab}
        />

        {/* Workspace body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header thông tin bài toán đang chọn */}
          {activeDataset && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                  Bài toán đang chọn phân tích
                </span>
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {activeDataset.name}
                </h1>
                {activeDataset.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {activeDataset.notes}
                  </p>
                )}
              </div>

              <div className="text-right sm:self-center">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Chế độ: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{activeDataset.mode === 'frequency' ? 'Bảng tần số' : 'Dãy số liệu'}</strong>
                </span>
              </div>
            </div>
          )}

          {/* 4 Thẻ KPI nổi bật */}
          <KPICards stats={statsPreview} />

          {/* Form nhập liệu */}
          {(activeTab === 'dashboard' || activeTab === 'entry') && (
            <div ref={entryFormRef}>
              <DataEntryForm
                currentDataset={activeDataset}
                onSave={handleSaveDataset}
                onSelectDemo={() => setIsDemoModalOpen(true)}
                statsPreview={statsPreview}
                isSaving={isSaving}
              />
            </div>
          )}

          {/* Khu vực thống kê & Biểu đồ */}
          {(activeTab === 'dashboard' || activeTab === 'reports') && (
            <>
              {/* Thống kê chi tiết & KaTeX */}
              <StatisticsSummary stats={statsPreview} />

              {/* Khu vực 2 biểu đồ: Biểu đồ hộp Box Plot & Biểu đồ cột Tần số */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BoxPlotChart stats={statsPreview} />
                <FrequencyChart stats={statsPreview} />
              </div>
            </>
          )}

          {/* Bảng dữ liệu đã lưu (Data Table) */}
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
            onExportCsv={handleExportCsv}
          />
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 transition-colors">
          Bảng điều khiển nhập liệu và thống kê tự động • Chuẩn GDPT 2018 (SGK Toán 10 Kết Nối Tri Thức Với Cuộc Sống)
        </footer>
      </div>

      {/* Modals */}
      <DemoSelectorModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onResetDemoData={handleResetDemoData}
      />
    </div>
  );
}
