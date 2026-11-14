import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';

export default function FrequencyChart({ stats }) {
  const [hoveredBar, setHoveredBar] = useState(null);

  if (!stats || !stats.frequency_table || stats.frequency_table.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-center text-slate-400 text-xs h-64">
        Chưa có dữ liệu để hiển thị biểu đồ phân bố tần số.
      </div>
    );
  }

  const table = stats.frequency_table;
  const maxFreq = Math.max(...table.map(item => item.frequency), 1);
  const outliers = stats.outliers || [];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Biểu đồ phân bố tần số của mẫu số liệu
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Trục tung: Tần số xuất hiện (nᵢ) | Trục hoành: Giá trị số liệu (xᵢ)
          </p>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Tổng số phần tử: <strong className="text-indigo-600 dark:text-indigo-400">{stats.sample_size}</strong>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative pt-6 pb-2">
        {/* Tooltip */}
        {hoveredBar && (
          <div className="absolute top-0 right-4 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-md border border-slate-700 pointer-events-none z-10 flex items-center gap-3">
            <div>
              Giá trị: <strong className="text-indigo-300 font-mono">{hoveredBar.value}</strong>
            </div>
            <div className="w-px h-3 bg-slate-700"></div>
            <div>
              Tần số: <strong className="text-emerald-300">{hoveredBar.frequency}</strong> ({hoveredBar.relative_freq}%)
            </div>
            {hoveredBar.isOutlier && (
              <span className="text-[10px] text-rose-400 font-bold bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800">
                Giá trị ngoại lệ
              </span>
            )}
          </div>
        )}

        {/* Grid lines and Bars */}
        <div className="h-52 flex items-end gap-1.5 sm:gap-2 px-2 border-b border-slate-200 dark:border-slate-700 relative">
          {/* Horizontal guidelines */}
          {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-t border-dashed border-slate-100 dark:border-slate-800 pointer-events-none flex items-center"
              style={{ bottom: `${ratio * 100}%` }}
            >
              <span className="text-[9px] text-slate-400 bg-white dark:bg-slate-900 px-1 -translate-y-1/2">
                {Math.round(maxFreq * ratio)}
              </span>
            </div>
          ))}

          {/* Render individual bars */}
          {table.map((item, idx) => {
            const isOutlier = outliers.includes(item.value);
            const heightPercent = Math.max((item.frequency / maxFreq) * 100, 4);

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                onMouseEnter={() => setHoveredBar({ ...item, isOutlier })}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Frequency badge on top of bar on hover */}
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.frequency}
                </span>

                {/* The Bar */}
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    isOutlier
                      ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20 shadow-md ring-2 ring-rose-400/50'
                      : 'bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-indigo-500/10 shadow-sm'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                ></div>
              </div>
            );
          })}
        </div>

        {/* X Axis Values */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2 mt-2">
          {table.map((item, idx) => {
            const isOutlier = outliers.includes(item.value);
            return (
              <div key={idx} className="flex-1 text-center truncate">
                <span className={`text-[10px] font-mono block truncate ${
                  isOutlier 
                    ? 'font-bold text-rose-600 dark:text-rose-400' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
