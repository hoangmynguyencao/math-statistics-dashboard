import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Save, 
  RotateCcw, 
  ListOrdered, 
  TableProperties, 
  CheckCircle, 
  AlertCircle,
  FileText,
  HelpCircle
} from 'lucide-react';
import MathFormula from './MathFormula';
import { parseRawData } from '../utils/statsCalculator';

export default function DataEntryForm({ 
  currentDataset, 
  onSave, 
  onSelectDemo, 
  statsPreview, 
  isSaving 
}) {
  const [name, setName] = useState('');
  const [mode, setMode] = useState('simple');
  const [rawData, setRawData] = useState('');
  const [notes, setNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync with current dataset when loaded or edited
  useEffect(() => {
    if (currentDataset) {
      setName(currentDataset.name || '');
      setMode(currentDataset.mode || 'simple');
      setRawData(currentDataset.raw_data || currentDataset.rawData || '');
      setNotes(currentDataset.notes || '');
    }
  }, [currentDataset]);

  const handleClear = () => {
    setName('');
    setRawData('');
    setNotes('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập Tên bài toán hoặc Tên mẫu số liệu!');
      return;
    }
    if (!rawData.trim()) {
      alert('Vui lòng nhập dữ liệu số liệu!');
      return;
    }

    const payload = {
      name: name.trim(),
      mode,
      raw_data: rawData.trim(),
      notes: notes.trim()
    };

    const success = await onSave(payload);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Preview elements
  const currentCount = statsPreview?.sample_size || 0;
  const sortedPreview = statsPreview?.sorted_values || [];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
            Nhập liệu mẫu số liệu thống kê
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mẫu số liệu không ghép nhóm theo chuẩn Toán 10 KNTT (tính toán tự động theo thời gian thực)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSelectDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800/60"
            title="Nạp nhanh các ví dụ thực tế trong SGK Toán 10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Tự động sinh dữ liệu mẫu
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Làm mới form nhập"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Làm mới
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Tên mẫu số liệu & Chế độ nhập */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tên bài toán / Tên mẫu số liệu <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Điểm kiểm tra giữa kì môn Toán 10 (Lớp 10A1)..."
                required
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Chế độ nhập số liệu
            </label>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setMode('simple')}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                  mode === 'simple'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                Dãy số liệu
              </button>
              <button
                type="button"
                onClick={() => setMode('frequency')}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                  mode === 'frequency'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <TableProperties className="w-3.5 h-3.5" />
                Có tần số
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Vùng nhập dữ liệu thô */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Nội dung dữ liệu</span>
              <span className="text-slate-400 font-normal">
                {mode === 'simple' 
                  ? '(Dãy số cách nhau bởi dấu phẩy, chấm phẩy hoặc khoảng trắng)' 
                  : '(Nhập từng dòng cặp "Giá trị : Tần số" ví dụ: 7.5 : 4)'}
              </span>
            </label>
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              Cỡ mẫu hiện tại: <strong className="font-bold">{currentCount}</strong>
            </span>
          </div>

          <textarea
            rows={3}
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
            placeholder={
              mode === 'simple'
                ? 'Nhập danh sách: 7.5; 8.0; 6.5; 9.0; 8.5; 7.0; 8.0; 9.5; 4.0; 8.5; 1.5; 10.0'
                : 'Mỗi dòng một cặp giá trị và tần số:\n0: 4\n1: 12\n2: 18\n3: 5\n4: 1'
            }
            required
            className="w-full px-3.5 py-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white transition-colors"
          />
        </div>

        {/* Row 3: Tự động hiển thị dãy sắp xếp không giảm */}
        {sortedPreview.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-850/70 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Dãy số liệu đã tự động sắp xếp không giảm (x₁ ≤ x₂ ≤ ... ≤ xₙ):
              </span>
              <span>n = {sortedPreview.length}</span>
            </div>
            <div className="text-xs font-mono text-slate-800 dark:text-slate-200 max-h-16 overflow-y-auto leading-relaxed break-words">
              {sortedPreview.map((val, idx) => (
                <span
                  key={idx}
                  className={`inline-block px-1.5 py-0.5 m-0.5 rounded text-xs ${
                    statsPreview?.outliers?.includes(val)
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-bold border border-rose-300 dark:border-rose-800'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                  title={statsPreview?.outliers?.includes(val) ? 'Giá trị ngoại lệ bất thường!' : ''}
                >
                  {val}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Row 4: Ghi chú bài toán */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Ghi chú / Nhận xét thêm (Tùy chọn)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ví dụ: Dữ liệu bài tập số 3 trang 88 SGK Toán 10 KNTT tập 1..."
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white transition-colors"
          />
        </div>

        {/* Row 5: Action button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Tự động cập nhật thống kê ngay khi gõ
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
                <CheckCircle className="w-4 h-4" />
                Đã lưu thành công vào file CSV!
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving || !rawData.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm hover:shadow transition-all"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Đang lưu...' : 'Lưu dữ liệu vào CSV'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
