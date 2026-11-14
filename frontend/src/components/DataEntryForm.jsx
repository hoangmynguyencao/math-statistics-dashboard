import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  Sparkles, 
  Save, 
  RotateCcw, 
  ListOrdered, 
  TableProperties, 
  CheckCircle, 
  AlertCircle,
  FileText,
  HelpCircle,
  Upload,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import MathFormula from './MathFormula';
import { parseRawData } from '../utils/statsCalculator';

export default function DataEntryForm({ 
  currentDataset, 
  onSave, 
  onDataChange,
  onNewDataset,
  onViewReports,
  statsPreview, 
  isSaving 
}) {
  const [name, setName] = useState('');
  const [mode, setMode] = useState('simple');
  const [rawData, setRawData] = useState('');
  const [notes, setNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [excelError, setExcelError] = useState('');
  const [showExcelGuide, setShowExcelGuide] = useState(false);
  const excelInputRef = useRef(null);

  // Chỉ sync form khi dataset ID thay đổi (không reset khi người dùng đang gõ)
  const prevDatasetIdRef = useRef(null);
  useEffect(() => {
    const currentId = currentDataset?.id ?? null;
    if (currentId !== prevDatasetIdRef.current) {
      prevDatasetIdRef.current = currentId;
      setName(currentDataset?.name || '');
      setMode(currentDataset?.mode || 'simple');
      setRawData(currentDataset?.raw_data || currentDataset?.rawData || '');
      setNotes(currentDataset?.notes || '');
    }
  }, [currentDataset]);

  // Thông báo dữ liệu thay đổi lên component cha để tính toán thời gian thực
  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        name,
        mode,
        raw_data: rawData,
        notes
      });
    }
  }, [name, mode, rawData, notes]);

  const handleClear = () => {
    setName('');
    setRawData('');
    setNotes('');
    setExcelError('');
    // Báo lên App.jsx để tạo activeDataset mới (không có id) → lần lưu tiếp sẽ POST tạo mới
    if (onNewDataset) onNewDataset();
  };

  // Nhập dữ liệu từ file Excel
  const handleExcelImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setExcelError('');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

        if (rows.length <= 1) {
          throw new Error('File Excel không có dữ liệu (chỉ có tiêu đề hoặc rỗng)');
        }

        if (mode === 'simple') {
          // Cột A = số liệu, hàng 1 = tiêu đề (bỏ qua), hàng 2+ = dữ liệu
          const numbers = rows.slice(1)
            .map(r => r[0])
            .filter(v => v !== '' && v !== null && v !== undefined)
            .map(v => String(v).replace(',', '.'));
          if (numbers.length === 0) {
            throw new Error('Không tìm thấy dữ liệu số trong cột A (từ hàng 2 trở đi)');
          }
          setRawData(numbers.join('; '));
        } else {
          // Cột A = giá trị, Cột B = tần số; hàng 1 = tiêu đề (bỏ qua)
          const lines = rows.slice(1)
            .filter(r => r[0] !== '' && r[0] !== null && r[0] !== undefined
                      && r[1] !== '' && r[1] !== null && r[1] !== undefined)
            .map(r => `${String(r[0]).replace(',', '.')}: ${r[1]}`);
          if (lines.length === 0) {
            throw new Error('Không tìm thấy dữ liệu hợp lệ trong cột A và B (từ hàng 2 trở đi)');
          }
          setRawData(lines.join('\n'));
        }
      } catch (err) {
        setExcelError('Lỗi đọc file Excel: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
    // Reset input để có thể chọn lại cùng file
    e.target.value = '';
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
          {/* Nút Thêm mẫu số liệu mới — reset form + tạo dataset mới (không ghi đè mẫu cũ) */}
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:text-white hover:bg-emerald-600 dark:hover:bg-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg transition-all border border-emerald-300 dark:border-emerald-800"
            title="Xóa form và bắt đầu nhập mẫu số liệu mới (mẫu đã lưu không bị mất)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Thêm mẫu số liệu mới
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

        {/* Excel Import Block */}
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20 p-3.5 space-y-2.5">
          {/* Hidden file input */}
          <input
            type="file"
            ref={excelInputRef}
            accept=".xlsx,.xls"
            onChange={handleExcelImport}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => excelInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-95"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Nhập từ Excel (.xlsx / .xls)
            </button>

            <button
              type="button"
              onClick={() => setShowExcelGuide(v => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors border border-emerald-200 dark:border-emerald-800"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Yêu cầu định dạng file Excel
              {showExcelGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Error message */}
          {excelError && (
            <div className="flex items-start gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{excelError}</span>
            </div>
          )}

          {/* Guide panel */}
          {showExcelGuide && (
            <div className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 rounded-lg p-3.5 space-y-3 leading-relaxed">
              {mode === 'simple' ? (
                <>
                  <p className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Yêu cầu định dạng (Chế độ: Dãy số liệu)
                  </p>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                    <li><strong>Cột A</strong>: Chứa các giá trị số liệu (một số trên mỗi hàng)</li>
                    <li><strong>Hàng 1</strong>: Tiêu đề cột (ví dụ: <em>"Giá trị"</em>) — sẽ được bỏ qua tự động</li>
                    <li><strong>Hàng 2 trở đi</strong>: Các giá trị số liệu thực tế</li>
                    <li>Chỉ đọc <strong>Sheet đầu tiên</strong> của file; dấu phẩy trong số thập phân sẽ tự đổi thành dấu chấm</li>
                  </ul>
                  <div className="font-mono text-[11px] bg-slate-50 dark:bg-slate-800 rounded p-2 border border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-2 gap-1 max-w-[200px]">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 col-span-1 border-b border-slate-300 dark:border-slate-600 pb-1">A (Giá trị)</span>
                      <span className="text-slate-400 col-span-1 border-b border-slate-300 dark:border-slate-600 pb-1 text-[10px]">(cột khác: bỏ qua)</span>
                      {['7.5','8.0','6.5','9.0','8.5'].map(v => (
                        <React.Fragment key={v}>
                          <span className="text-slate-800 dark:text-slate-200">{v}</span>
                          <span></span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Yêu cầu định dạng (Chế độ: Bảng tần số)
                  </p>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                    <li><strong>Cột A</strong>: Giá trị (x&#7522;) — số nguyên hoặc số thập phân</li>
                    <li><strong>Cột B</strong>: Tần số (n&#7522;) — phải là số nguyên dương</li>
                    <li><strong>Hàng 1</strong>: Tiêu đề cột (ví dụ: <em>"Giá trị", "Tần số"</em>) — bỏ qua tự động</li>
                    <li><strong>Hàng 2 trở đi</strong>: Từng cặp (giá trị, tần số) tương ứng</li>
                    <li>Chỉ đọc <strong>Sheet đầu tiên</strong>; các cột khác (C, D, …) bỏ qua</li>
                  </ul>
                  <div className="font-mono text-[11px] bg-slate-50 dark:bg-slate-800 rounded p-2 border border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-2 gap-x-4 max-w-[220px]">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 border-b border-slate-300 dark:border-slate-600 pb-1">A (Giá trị)</span>
                      <span className="font-bold text-violet-600 dark:text-violet-400 border-b border-slate-300 dark:border-slate-600 pb-1">B (Tần số)</span>
                      {[['0','4'],['1','12'],['2','18'],['3','5'],['4','1']].map(([v,f]) => (
                        <React.Fragment key={v}>
                          <span className="text-slate-800 dark:text-slate-200">{v}</span>
                          <span className="text-slate-800 dark:text-slate-200">{f}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
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

          <div className="flex flex-wrap items-center gap-3">
            {saveSuccess && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Đã lưu vào CSV!
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
                >
                  <RotateCcw className="w-3 h-3" />
                  Nhập mẫu tiếp theo
                </button>
                {onViewReports && (
                  <button
                    type="button"
                    onClick={onViewReports}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800"
                  >
                    Xem báo cáo →
                  </button>
                )}
              </div>
            )}
            <button
              type="submit"
              disabled={isSaving || !rawData.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm hover:shadow transition-all"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Đang lưu...' : currentDataset?.id && !String(currentDataset.id).startsWith('local-') ? 'Cập nhật CSV' : 'Lưu vào CSV'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
