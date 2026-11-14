import React, { useState } from 'react';
import { 
  X, 
  RotateCcw, 
  BookOpen, 
  Check, 
  HelpCircle, 
  Info, 
  Database,
  ExternalLink
} from 'lucide-react';
import MathFormula from './MathFormula';

export default function SettingsModal({ isOpen, onClose, onResetDemoData }) {
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isOpen) return null;

  const handleReset = async () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục lại các bộ dữ liệu mẫu ban đầu của SGK Toán 10? Mọi chỉnh sửa tạm thời sẽ được làm mới.')) {
      setResetting(true);
      await onResetDemoData();
      setResetting(false);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cài đặt & Sổ tay kiến thức Toán 10 KNTT
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chương trình GDPT 2018 - Mẫu số liệu không ghép nhóm
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Section 1: Quản lý dữ liệu CSV */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              1. Quản lý cơ sở dữ liệu CSV
            </h4>
            <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Khôi phục dữ liệu mẫu chuẩn SGK 10
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Làm mới lại toàn bộ bảng tính về 4 bài toán mẫu chuẩn ban đầu trong SGK.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {resetSuccess && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Đã khôi phục!
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={resetting}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg border border-rose-200 dark:border-rose-900/60 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {resetting ? 'Đang khôi phục...' : 'Khôi phục mặc định'}
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Tóm tắt công thức chuẩn Toán 10 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              2. Sổ tay công thức Toán 10 (SGK Kết nối tri thức)
            </h4>
            
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200">Số trung bình cộng:</span>
                <div className="mt-1 font-mono text-indigo-600 dark:text-indigo-400">
                  <MathFormula formula="\bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n} = \frac{1}{n}\sum_{i=1}^{n} x_i" />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200">Tứ phân vị (Q₁, Q₂, Q₃):</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  Sắp xếp dãy không giảm: <MathFormula formula="x_1 \le x_2 \le \dots \le x_n" />.
                </p>
                <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 mt-1 space-y-0.5">
                  <li><MathFormula formula="Q_2 = M_e" /> (Trung vị của toàn bộ mẫu số liệu).</li>
                  <li>Nếu <MathFormula formula="n" /> lẻ: Nửa dưới là từ <MathFormula formula="x_1" /> đến <MathFormula formula="x_{(n-1)/2}" /> (không tính <MathFormula formula="Q_2" />). <MathFormula formula="Q_1" /> là trung vị nửa dưới, <MathFormula formula="Q_3" /> là trung vị nửa trên.</li>
                  <li>Nếu <MathFormula formula="n" /> chẵn: Nửa dưới là từ <MathFormula formula="x_1" /> đến <MathFormula formula="x_{n/2}" />. <MathFormula formula="Q_1" /> là trung vị nửa dưới, <MathFormula formula="Q_3" /> là trung vị nửa trên.</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200">Phương sai & Độ lệch chuẩn (SGK Toán 10 KNTT):</span>
                <div className="mt-1 space-y-1 font-mono text-emerald-600 dark:text-emerald-400">
                  <div><MathFormula formula="s^2 = \frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^2" /></div>
                  <div><MathFormula formula="s = \sqrt{s^2}" /></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
                <span className="font-bold text-rose-900 dark:text-rose-200">Quy tắc tìm giá trị ngoại lệ (Outliers):</span>
                <div className="mt-1 font-mono text-rose-700 dark:text-rose-300">
                  <MathFormula formula="x < Q_1 - 1{,}5\Delta_Q \quad \text{hoặc} \quad x > Q_3 + 1{,}5\Delta_Q" />
                </div>
                <p className="text-[11px] text-rose-800/80 dark:text-rose-300/80 mt-1">
                  với <MathFormula formula="\Delta_Q = Q_3 - Q_1" /> (Khoảng tứ phân vị).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Ứng dụng xây dựng với React, Tailwind CSS, KaTeX & Python FastAPI.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
