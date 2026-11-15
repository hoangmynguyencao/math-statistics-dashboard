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
  ChevronUp,
  Edit3,
  PlusCircle
} from 'lucide-react';
import MathFormula from './MathFormula';
import { parseRawData } from '../utils/statsCalculator';

export default function DataEntryForm({ 
  currentDataset, 
  isEditing = false,
  onCancelEdit,
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

  // Nhập dữ liệu từ file Excel hỗ trợ cả dạng Cột dọc lẫn Hàng ngang
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

        if (!rows || rows.length === 0) {
          throw new Error('File Excel rỗng, vui lòng kiểm tra lại');
        }

        if (mode === 'simple') {
          // ==========================================
          // CHẾ ĐỘ DÃY SỐ LIỆU: Hỗ trợ cả Cột dọc & Hàng ngang
          // ==========================================

          // 1. Quét tìm hàng có nhiều số nhất (Dạng hàng ngang)
          let bestHorizontal = [];
          for (const row of rows) {
            const nums = [];
            for (const cell of (row || [])) {
              if (cell === '' || cell === null || cell === undefined) continue;
              const clean = String(cell).trim().replace(',', '.');
              const n = parseFloat(clean);
              if (!isNaN(n)) nums.push(clean);
            }
            if (nums.length > bestHorizontal.length) {
              bestHorizontal = nums;
            }
          }

          // 2. Quét tìm cột có nhiều số nhất (Dạng cột dọc)
          let totalCols = 0;
          for (const row of rows) {
            if ((row || []).length > totalCols) totalCols = row.length;
          }
          let bestVertical = [];
          for (let c = 0; c < totalCols; c++) {
            const nums = [];
            for (const row of rows) {
              const cell = row?.[c];
              if (cell === '' || cell === null || cell === undefined) continue;
              const clean = String(cell).trim().replace(',', '.');
              const n = parseFloat(clean);
              if (!isNaN(n)) nums.push(clean);
            }
            if (nums.length > bestVertical.length) {
              bestVertical = nums;
            }
          }

          // 3. Gom tất cả số trong toàn bộ sheet (hỗ trợ bảng lưới nhiều hàng nhiều cột)
          const allNums = [];
          for (const row of rows) {
            for (const cell of (row || [])) {
              if (cell === '' || cell === null || cell === undefined) continue;
              const clean = String(cell).trim().replace(',', '.');
              const n = parseFloat(clean);
              if (!isNaN(n)) allNums.push(clean);
            }
          }

          if (allNums.length === 0) {
            throw new Error('Không tìm thấy dữ liệu số nào trong file Excel');
          }

          // Nhận diện theo dạng tối ưu nhất
          if (bestVertical.length >= 2 && bestVertical.length === allNums.length) {
            setRawData(bestVertical.join('; '));
          } else if (bestHorizontal.length >= 2 && bestHorizontal.length === allNums.length) {
            setRawData(bestHorizontal.join('; '));
          } else if (bestVertical.length >= allNums.length * 0.8 && bestVertical.length >= 2) {
            setRawData(bestVertical.join('; '));
          } else if (bestHorizontal.length >= allNums.length * 0.8 && bestHorizontal.length >= 2) {
            setRawData(bestHorizontal.join('; '));
          } else {
            setRawData(allNums.join('; '));
          }
        } else {
          // ==========================================
          // CHẾ ĐỘ BẢNG TẦN SỐ: Hỗ trợ cả Cột dọc & Hàng ngang
          // ==========================================

          // 1. Thử nhận diện theo HÀNG NGANG (Row 1: Giá trị, Row 2: Tần số)
          let bestHorizontalPairs = [];
          for (let r = 0; r < rows.length - 1; r++) {
            const rowVal = rows[r] || [];
            const rowFreq = rows[r + 1] || [];
            const maxCols = Math.max(rowVal.length, rowFreq.length);
            const pairs = [];

            for (let c = 0; c < maxCols; c++) {
              const v1 = rowVal[c];
              const v2 = rowFreq[c];
              if (v1 === '' || v1 === null || v1 === undefined || v2 === '' || v2 === null || v2 === undefined) continue;
              const cleanVal = String(v1).trim().replace(',', '.');
              const cleanFreq = String(v2).trim().replace(',', '.');
              const numVal = parseFloat(cleanVal);
              const numFreq = parseFloat(cleanFreq);

              // Tần số n_i phải là số nguyên dương >= 1
              if (!isNaN(numVal) && !isNaN(numFreq) && numFreq >= 1 && Number.isInteger(numFreq)) {
                pairs.push(`${cleanVal}: ${numFreq}`);
              }
            }

            if (pairs.length > bestHorizontalPairs.length) {
              bestHorizontalPairs = pairs;
            }
          }

          // 2. Thử nhận diện theo CỘT DỌC (Col A: Giá trị, Col B: Tần số)
          let totalCols = 0;
          for (const row of rows) {
            if ((row || []).length > totalCols) totalCols = row.length;
          }

          let bestVerticalPairs = [];
          for (let c = 0; c < totalCols - 1; c++) {
            const pairs = [];
            for (let r = 0; r < rows.length; r++) {
              const v1 = rows[r]?.[c];
              const v2 = rows[r]?.[c + 1];
              if (v1 === '' || v1 === null || v1 === undefined || v2 === '' || v2 === null || v2 === undefined) continue;
              const cleanVal = String(v1).trim().replace(',', '.');
              const cleanFreq = String(v2).trim().replace(',', '.');
              const numVal = parseFloat(cleanVal);
              const numFreq = parseFloat(cleanFreq);

              if (!isNaN(numVal) && !isNaN(numFreq) && numFreq >= 1 && Number.isInteger(numFreq)) {
                pairs.push(`${cleanVal}: ${numFreq}`);
              }
            }

            if (pairs.length > bestVerticalPairs.length) {
              bestVerticalPairs = pairs;
            }
          }

          // So sánh và chọn dạng trích xuất được nhiều cặp hợp lệ hơn
          if (bestHorizontalPairs.length >= 2 && bestHorizontalPairs.length >= bestVerticalPairs.length) {
            setRawData(bestHorizontalPairs.join('\n'));
          } else if (bestVerticalPairs.length >= 1) {
            setRawData(bestVerticalPairs.join('\n'));
          } else if (bestHorizontalPairs.length >= 1) {
            setRawData(bestHorizontalPairs.join('\n'));
          } else {
            throw new Error('Không tìm thấy dữ liệu hợp lệ trong file Excel. Vui lòng đảm bảo bảng có cặp (Giá trị và Tần số nguyên dương) theo hàng ngang hoặc cột dọc.');
          }
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
      setTimeout(() => setSaveSuccess(false), 3500);
      // Khi lưu một mẫu số liệu mới, tự động làm sạch form để người dùng có thể nhập tiếp mẫu tiếp theo mà không bị ghi đè
      if (!isEditing) {
        setName('');
        setRawData('');
        setNotes('');
        setExcelError('');
      }
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
            onClick={() => {
              if (onCancelEdit) onCancelEdit();
              handleClear();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:text-white hover:bg-emerald-600 dark:hover:bg-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg transition-all border border-emerald-300 dark:border-emerald-800"
            title="Xóa form và bắt đầu nhập mẫu số liệu mới (mẫu đã lưu không bị mất)"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Nhập mẫu số liệu mới
          </button>
        </div>
      </div>

      {/* Banner thông báo trạng thái chỉnh sửa hoặc thêm mới */}
      {isEditing ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 mb-5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-xs shadow-xs">
          <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200 font-semibold">
            <span className="p-1 rounded-md bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
              <Edit3 className="w-4 h-4" />
            </span>
            <span>
              Đang chỉnh sửa bài toán: <strong>"{currentDataset?.name}"</strong> (khi lưu sẽ cập nhật nội dung của bài toán này)
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onCancelEdit) onCancelEdit();
              handleClear();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold transition-colors shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Hủy sửa • Nhập mẫu mới</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Chế độ nhập mẫu mới (các mẫu đã lưu trước đó được giữ nguyên an toàn trong danh sách)
          </span>
        </div>
      )}

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
            <div className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 rounded-lg p-3.5 space-y-4 leading-relaxed">
              {mode === 'simple' ? (
                <>
                  <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/60 pb-2">
                    <p className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      Yêu cầu file Excel (Chế độ: Dãy số liệu) — Hỗ trợ cả Dọc và Ngang
                    </p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Tự động nhận diện
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400">
                    Bạn có thể sắp xếp các số theo <strong>Cột dọc</strong> (mỗi số một hàng) hoặc <strong>Hàng ngang</strong> (nhiều số trên cùng một hàng hoặc cả bảng lưới số):
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Cách 1: Cột dọc */}
                    <div className="space-y-1.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-[11px] text-indigo-600 dark:text-indigo-400 block">
                        Định dạng 1: Theo Cột dọc
                      </span>
                      <p className="text-[10px] text-slate-500">Cột A chứa các số liệu (hàng đầu là tiêu đề, tự động bỏ qua):</p>
                      <div className="font-mono text-[11px] bg-white dark:bg-slate-900 rounded p-2 border border-slate-200 dark:border-slate-700/80">
                        <div className="font-bold text-slate-500 border-b pb-1 mb-1">A (Điểm)</div>
                        <div>7.5</div>
                        <div>8.0</div>
                        <div>6.5</div>
                        <div>9.0</div>
                      </div>
                    </div>

                    {/* Cách 2: Hàng ngang */}
                    <div className="space-y-1.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-[11px] text-emerald-600 dark:text-emerald-400 block">
                        Định dạng 2: Theo Hàng ngang
                      </span>
                      <p className="text-[10px] text-slate-500">Các số nằm ngang trên cùng một hàng (hoặc bảng lưới ma trận):</p>
                      <div className="font-mono text-[11px] bg-white dark:bg-slate-900 rounded p-2 border border-slate-200 dark:border-slate-700/80 overflow-x-auto">
                        <div className="grid grid-cols-4 gap-1 text-center font-bold text-slate-500 border-b pb-1 mb-1">
                          <span>A</span><span>B</span><span>C</span><span>D</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 text-center">
                          <span>7.5</span><span>8.0</span><span>6.5</span><span>9.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/60 pb-2">
                    <p className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      Yêu cầu file Excel (Chế độ: Bảng tần số) — Hỗ trợ cả Dọc và Ngang
                    </p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Tự động nhận diện
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400">
                    Hệ thống tự động nhận diện cả bảng lập theo <strong>Cột dọc</strong> lẫn bảng lập theo <strong>Hàng ngang</strong> (chuẩn như bảng trong SGK Toán 10):
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Cách 1: Cột dọc */}
                    <div className="space-y-1.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-[11px] text-indigo-600 dark:text-indigo-400 block">
                        Định dạng 1: Theo Cột dọc
                      </span>
                      <p className="text-[10px] text-slate-500">Cột A là Giá trị (xᵢ), Cột B là Tần số (nᵢ):</p>
                      <div className="font-mono text-[11px] bg-white dark:bg-slate-900 rounded p-2 border border-slate-200 dark:border-slate-700/80">
                        <div className="grid grid-cols-2 gap-2 font-bold border-b pb-1 mb-1 text-slate-500">
                          <span>A (Giá trị)</span>
                          <span>B (Tần số)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2"><span>0</span><span>4</span></div>
                        <div className="grid grid-cols-2 gap-2"><span>1</span><span>12</span></div>
                        <div className="grid grid-cols-2 gap-2"><span>2</span><span>18</span></div>
                      </div>
                    </div>

                    {/* Cách 2: Hàng ngang (Chuẩn SGK Toán 10) */}
                    <div className="space-y-1.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-[11px] text-violet-600 dark:text-violet-400 block">
                        Định dạng 2: Theo Hàng ngang (Chuẩn SGK)
                      </span>
                      <p className="text-[10px] text-slate-500">Hàng 1 là Giá trị (xᵢ), Hàng 2 là Tần số (nᵢ):</p>
                      <div className="font-mono text-[11px] bg-white dark:bg-slate-900 rounded p-2 border border-slate-200 dark:border-slate-700/80 overflow-x-auto">
                        <div className="space-y-1">
                          <div className="flex gap-2 items-center border-b pb-1">
                            <span className="font-bold text-slate-500 shrink-0 w-16">Giá trị (x):</span>
                            <span className="w-6 text-center">0</span>
                            <span className="w-6 text-center">1</span>
                            <span className="w-6 text-center">2</span>
                            <span className="w-6 text-center">3</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <span className="font-bold text-slate-500 shrink-0 w-16">Tần số (n):</span>
                            <span className="w-6 text-center font-bold text-violet-600 dark:text-violet-400">4</span>
                            <span className="w-6 text-center font-bold text-violet-600 dark:text-violet-400">12</span>
                            <span className="w-6 text-center font-bold text-violet-600 dark:text-violet-400">18</span>
                            <span className="w-6 text-center font-bold text-violet-600 dark:text-violet-400">5</span>
                          </div>
                        </div>
                      </div>
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
                  {isEditing ? 'Đã cập nhật bài toán thành công!' : 'Đã lưu mẫu vào danh sách!'}
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
              {isSaving ? 'Đang lưu...' : isEditing ? 'Cập nhật bài toán' : 'Lưu mẫu số liệu'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
