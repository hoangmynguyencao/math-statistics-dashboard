import React from 'react';
import { X, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { DEMO_DATA_PRESETS } from '../utils/demoData';

export default function DemoSelectorModal({ isOpen, onClose, onSelectPreset }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Dữ liệu mẫu SGK Toán 10
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chọn một kịch bản thực tế để tự động điền và phân tích ngay
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

        {/* List of presets */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2.5">
          {DEMO_DATA_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
              className="group p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-850 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-all cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {preset.name}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    preset.mode === 'frequency'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {preset.mode === 'frequency' ? 'Bảng tần số' : 'Dãy số'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {preset.notes}
                </p>
                <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate">
                  {preset.rawData.replace(/\n/g, ' | ')}
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shadow-xs shrink-0">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Dữ liệu được trích xuất từ Chương V - Các số đặc trưng đo xu thế trung tâm và độ phân tán (SGK Toán 10 KNTT)
          </span>
        </div>
      </div>
    </div>
  );
}
