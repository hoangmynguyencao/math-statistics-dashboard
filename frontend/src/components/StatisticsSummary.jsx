import React, { useState } from 'react';
import { 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  Info, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  BookmarkCheck
} from 'lucide-react';
import MathFormula from './MathFormula';

export default function StatisticsSummary({ stats }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [showFormulas, setShowFormulas] = useState(true);

  if (!stats) return null;

  const copyFormula = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const steps = stats.formula_steps || {};

  return (
    <div className="space-y-6 mb-6">
      {/* 1. KHU VỰC CẢNH BÁO GIÁ TRỊ NGOẠI LỆ (OUTLIERS) */}
      <div className={`rounded-xl p-5 border transition-all ${
        stats.outliers && stats.outliers.length > 0
          ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
          : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              stats.outliers && stats.outliers.length > 0
                ? 'bg-rose-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}>
              {stats.outliers && stats.outliers.length > 0 ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <BookmarkCheck className="w-5 h-5" />
              )}
            </div>

            <div>
              <h3 className={`text-sm font-bold flex items-center gap-2 ${
                stats.outliers && stats.outliers.length > 0
                  ? 'text-rose-900 dark:text-rose-200'
                  : 'text-emerald-900 dark:text-emerald-200'
              }`}>
                {stats.outliers && stats.outliers.length > 0
                  ? `Phát hiện ${stats.outliers.length} giá trị ngoại lệ (bất thường) trong mẫu số liệu!`
                  : 'Mẫu số liệu đồng đều - Không phát hiện giá trị ngoại lệ'}
              </h3>

              <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 space-y-1">
                <p>
                  <strong>Quy tắc xác định giá trị ngoại lệ (SGK Toán 10 KNTT):</strong> Phần tử <MathFormula formula="x" /> là giá trị ngoại lệ nếu:
                </p>
                <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800 font-mono inline-block my-1">
                  <MathFormula formula="x < Q_1 - 1{,}5\Delta_Q \quad \text{hoặc} \quad x > Q_3 + 1{,}5\Delta_Q" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="bg-white/60 dark:bg-slate-900/50 p-2 rounded border border-slate-200/60 dark:border-slate-800">
                    Ngưỡng dưới: <MathFormula formula={`T_{min} = Q_1 - 1{,}5\\Delta_Q = ${stats.q1} - 1{,}5 \\times ${stats.iqr} = `} />
                    <span className="font-bold text-rose-600 dark:text-rose-400"> {stats.outlier_lower_bound}</span>
                  </div>
                  <div className="bg-white/60 dark:bg-slate-900/50 p-2 rounded border border-slate-200/60 dark:border-slate-800">
                    Ngưỡng trên: <MathFormula formula={`T_{max} = Q_3 + 1{,}5\\Delta_Q = ${stats.q3} + 1{,}5 \\times ${stats.iqr} = `} />
                    <span className="font-bold text-rose-600 dark:text-rose-400"> {stats.outlier_upper_bound}</span>
                  </div>
                </div>
              </div>

              {stats.outliers && stats.outliers.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                    Các giá trị ngoại lệ tìm được:
                  </span>
                  {stats.outliers.map((val, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-100 rounded-md border border-rose-300 dark:border-rose-700 shadow-sm"
                    >
                      x = {val}
                      <span className="text-[10px] font-normal opacity-80">
                        {val < stats.outlier_lower_bound ? '(< Ngưỡng dưới)' : '(> Ngưỡng trên)'}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. BẢNG CÁC SỐ ĐẶC TRƯNG TOÁN 10 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nhóm 1: Đo xu thế trung tâm */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              1. Số đặc trưng đo xu thế trung tâm
            </h3>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              SGK Toán 10 KNTT
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Trung bình */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Số trung bình cộng</span>
                <div className="text-[11px] text-slate-400">
                  <MathFormula formula="\bar{x} = \frac{1}{n}\sum x_i" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                  {stats.mean}
                </span>
              </div>
            </div>

            {/* Trung vị */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Trung vị</span>
                <div className="text-[11px] text-slate-400">
                  <MathFormula formula="M_e = Q_2" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400 font-mono">
                  {stats.median}
                </span>
              </div>
            </div>

            {/* Tứ phân vị Q1, Q2, Q3 */}
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Tứ phân vị</span>
                <span className="text-[11px] text-slate-400">Chia mẫu thành 4 phần đều nhau</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 mb-0.5"><MathFormula formula="Q_1" /> (25%)</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">{stats.q1}</div>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 mb-0.5"><MathFormula formula="Q_2" /> (50%)</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">{stats.q2}</div>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 mb-0.5"><MathFormula formula="Q_3" /> (75%)</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">{stats.q3}</div>
                </div>
              </div>
            </div>

            {/* Mốt */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Mốt của mẫu</span>
                <div className="text-[11px] text-slate-400">
                  <MathFormula formula="M_o" /> (Giá trị có tần số lớn nhất)
                </div>
              </div>
              <div className="text-right">
                {stats.has_mode ? (
                  <div>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
                      {stats.modes.join(', ')}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      (Tần số xuất hiện: {stats.mode_frequency} lần)
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">Không có mốt</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nhóm 2: Đo độ phân tán */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              2. Số đặc trưng đo độ phân tán
            </h3>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Đo mức độ phân tán số liệu
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Khoảng biến thiên R */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Khoảng biến thiên</span>
                <div className="text-[11px] text-slate-400">
                  <MathFormula formula="R = x_{max} - x_{min}" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  {stats.range_val}
                </span>
                <span className="block text-[10px] text-slate-400">
                  ({stats.max_value} - {stats.min_value})
                </span>
              </div>
            </div>

            {/* Khoảng tứ phân vị Delta_Q */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Khoảng tứ phân vị</span>
                <div className="text-[11px] text-slate-400">
                  <MathFormula formula="\Delta_Q = Q_3 - Q_1" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
                  {stats.iqr}
                </span>
                <span className="block text-[10px] text-slate-400">
                  ({stats.q3} - {stats.q1})
                </span>
              </div>
            </div>

            {/* Phương sai s^2 */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Phương sai mẫu</span>
                <div className="text-[11px] text-slate-400">
                  <MathFormula formula="s^2 = \frac{1}{n}\sum(x_i - \bar{x})^2" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-teal-600 dark:text-teal-400 font-mono">
                  {stats.variance}
                </span>
                {stats.variance_unbiased && (
                  <span className="block text-[10px] text-slate-400" title="Phương sai hiệu chỉnh chia cho n-1">
                    (Hiệu chỉnh: {stats.variance_unbiased})
                  </span>
                )}
              </div>
            </div>

            {/* Độ lệch chuẩn s */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Độ lệch chuẩn</span>
                <div className="text-[11px] text-slate-400">
                  <MathFormula formula="s = \sqrt{s^2}" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {stats.std_dev}
                </span>
                {stats.std_dev_unbiased && (
                  <span className="block text-[10px] text-slate-400">
                    (Hiệu chỉnh: {stats.std_dev_unbiased})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CHI TIẾT CÁC BƯỚC GIẢI & CÔNG THỨC TOÁN HỌC (KaTeX) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <button
          type="button"
          onClick={() => setShowFormulas(!showFormulas)}
          className="w-full flex items-center justify-between text-left focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Chi tiết công thức và các bước tính toán (Chuẩn SGK Toán 10 KNTT)
            </h3>
          </div>
          <div className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            {showFormulas ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showFormulas && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {[
              {
                title: '1. Tính số trung bình cộng:',
                formula: steps.mean_latex,
                key: 'mean'
              },
              {
                title: '2. Xác định trung vị (Q₂):',
                formula: steps.median_latex,
                note: steps.median_note,
                key: 'median'
              },
              {
                title: '3. Xác định tứ phân vị thứ nhất (Q₁):',
                formula: steps.q1_latex,
                key: 'q1'
              },
              {
                title: '4. Xác định tứ phân vị thứ ba (Q₃):',
                formula: steps.q3_latex,
                key: 'q3'
              },
              {
                title: '5. Tính khoảng tứ phân vị (ΔQ):',
                formula: steps.iqr_latex,
                key: 'iqr'
              },
              {
                title: '6. Tính khoảng biến thiên (R):',
                formula: steps.range_latex,
                key: 'range'
              },
              {
                title: '7. Tính phương sai mẫu (s²):',
                formula: steps.variance_latex,
                key: 'variance'
              },
              {
                title: '8. Tính độ lệch chuẩn (s):',
                formula: steps.std_dev_latex,
                key: 'std_dev'
              },
              {
                title: '9. Kiểm tra giá trị ngoại lệ (Outliers):',
                formula: steps.outlier_condition_latex,
                key: 'outliers'
              }
            ].map((step, idx) => (
              <div 
                key={idx} 
                className="p-3 bg-slate-50 dark:bg-slate-850/60 rounded-lg border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {step.title}
                  </div>
                  {step.note && (
                    <div className="text-[11px] text-slate-500 italic">
                      <MathFormula formula={step.note} />
                    </div>
                  )}
                  <div className="text-xs text-indigo-700 dark:text-indigo-300 font-mono py-0.5">
                    <MathFormula formula={step.formula} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyFormula(step.formula, step.key)}
                  className="self-end sm:self-center inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md transition-colors shadow-2xs"
                  title="Sao chép mã LaTeX"
                >
                  {copiedKey === step.key ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Chép LaTeX</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
