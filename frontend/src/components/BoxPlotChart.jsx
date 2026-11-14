import React, { useState } from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import MathFormula from './MathFormula';

export default function BoxPlotChart({ stats }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  if (!stats || !stats.sorted_values || stats.sorted_values.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-center text-slate-400 text-xs h-64">
        Chưa có đủ số liệu để dựng biểu đồ hộp.
      </div>
    );
  }

  const {
    min_value: minVal,
    max_value: maxVal,
    q1,
    q2,
    q3,
    iqr,
    outliers = [],
    sorted_values: sortedValues,
    outlier_lower_bound: lowerBound,
    outlier_upper_bound: upperBound
  } = stats;

  // Tính các giá trị không ngoại lệ để vẽ râu hộp (whisker)
  const nonOutliers = sortedValues.filter(x => x >= lowerBound && x <= upperBound);
  const whiskerMin = nonOutliers.length > 0 ? nonOutliers[0] : minVal;
  const whiskerMax = nonOutliers.length > 0 ? nonOutliers[nonOutliers.length - 1] : maxVal;

  // Phạm vi của trục biểu đồ: mở rộng ra 5% mỗi bên
  const plotMin = Math.min(minVal, lowerBound);
  const plotMax = Math.max(maxVal, upperBound);
  const span = plotMax - plotMin === 0 ? 1 : plotMax - plotMin;
  const paddingSpan = span * 0.1;
  const axisMin = plotMin - paddingSpan;
  const axisMax = plotMax + paddingSpan;
  const totalAxisSpan = axisMax - axisMin;

  // Hàm chuyển đổi giá trị thực tế sang phần trăm tọa độ X (0 -> 100%)
  const getXPercent = (val) => {
    return ((val - axisMin) / totalAxisSpan) * 100;
  };

  // Tạo các mốc chia (ticks) trên trục hoành
  const tickCount = 6;
  const ticks = [];
  for (let i = 0; i <= tickCount; i++) {
    const val = axisMin + (totalAxisSpan * i) / tickCount;
    ticks.push(Number(val.toFixed(2)));
  }

  const boxLeft = getXPercent(q1);
  const boxWidth = Math.max(getXPercent(q3) - boxLeft, 0.5);
  const medianPos = getXPercent(q2);
  const whiskerMinPos = getXPercent(whiskerMin);
  const whiskerMaxPos = getXPercent(whiskerMax);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
            Biểu đồ hộp (Box Plot) & Điểm ngoại lệ
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Trực quan hóa 5 số đặc trưng (Min, Q₁, Me, Q₃, Max) và điểm bất thường
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-3 h-3 rounded-xs bg-indigo-500/20 border border-indigo-500 inline-block"></span>
            <span>Hộp tứ phân vị (Q₁ - Q₃)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-300 dark:ring-rose-900 inline-block"></span>
            <span className="font-semibold text-rose-600 dark:text-rose-400">Điểm ngoại lệ</span>
          </div>
        </div>
      </div>

      {/* Box Plot Display Area */}
      <div className="relative pt-8 pb-12 px-6">
        {/* Tooltip Hover display */}
        {hoveredItem && (
          <div 
            className="absolute top-1 z-20 transform -translate-x-1/2 bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap border border-slate-700"
            style={{ left: `${hoveredItem.x}%` }}
          >
            {hoveredItem.text}
          </div>
        )}

        {/* SVG Container */}
        <div className="h-32 w-full relative flex items-center">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Vùng an toàn không ngoại lệ (Giữa lowerBound và upperBound) */}
            <rect
              x={`${getXPercent(lowerBound)}`}
              y="10"
              width={`${getXPercent(upperBound) - getXPercent(lowerBound)}`}
              height="80"
              fill="currentColor"
              className="text-slate-100/60 dark:text-slate-800/40"
              rx="4"
            />

            {/* Đường râu nối trái (từ whiskerMin đến Q1) */}
            <line
              x1={`${whiskerMinPos}`}
              y1="50"
              x2={`${boxLeft}`}
              y2="50"
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="2,2"
            />

            {/* Chốt râu trái (Whisker Min) */}
            <line
              x1={`${whiskerMinPos}`}
              y1="35"
              x2={`${whiskerMinPos}`}
              y2="65"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Đường râu nối phải (từ Q3 đến whiskerMax) */}
            <line
              x1={`${getXPercent(q3)}`}
              y1="50"
              x2={`${whiskerMaxPos}`}
              y2="50"
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="2,2"
            />

            {/* Chốt râu phải (Whisker Max) */}
            <line
              x1={`${whiskerMaxPos}`}
              y1="35"
              x2={`${whiskerMaxPos}`}
              y2="65"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Thân hộp (Box Q1 -> Q3) */}
            <rect
              x={`${boxLeft}`}
              y="25"
              width={`${boxWidth}`}
              height="50"
              rx="4"
              className="fill-indigo-100 dark:fill-indigo-950/70 stroke-indigo-600 dark:stroke-indigo-400 transition-all cursor-pointer hover:fill-indigo-200 dark:hover:fill-indigo-900"
              strokeWidth="2"
              onMouseEnter={() => setHoveredItem({ x: (boxLeft + boxWidth / 2), text: `Hộp tứ phân vị: Q₁=${q1}, Q₃=${q3}, ΔQ=${iqr}` })}
              onMouseLeave={() => setHoveredItem(null)}
            />

            {/* Đường trung vị Me (Q2) */}
            <line
              x1={`${medianPos}`}
              y1="23"
              x2={`${medianPos}`}
              y2="77"
              stroke="#8b5cf6"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredItem({ x: medianPos, text: `Trung vị Me = Q₂ = ${q2}` })}
              onMouseLeave={() => setHoveredItem(null)}
            />

            {/* Đường ranh giới ngưỡng ngoại lệ (Lower Bound & Upper Bound) */}
            <line
              x1={`${getXPercent(lowerBound)}`}
              y1="10"
              x2={`${getXPercent(lowerBound)}`}
              y2="90"
              stroke="#f43f5e"
              strokeWidth="1.2"
              strokeDasharray="3,3"
            />
            <line
              x1={`${getXPercent(upperBound)}`}
              y1="10"
              x2={`${getXPercent(upperBound)}`}
              y2="90"
              stroke="#f43f5e"
              strokeWidth="1.2"
              strokeDasharray="3,3"
            />
          </svg>

          {/* Các điểm ngoại lệ (Outliers) vẽ bằng HTML để hiển thị tooltip và hiệu ứng rõ nét */}
          {outliers.map((val, idx) => {
            const posX = getXPercent(val);
            return (
              <div
                key={idx}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group z-10 cursor-pointer"
                style={{ left: `${posX}%` }}
                onMouseEnter={() => setHoveredItem({ x: posX, text: `Giá trị ngoại lệ: x = ${val}` })}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="w-4 h-4 rounded-full bg-rose-600 border-2 border-white dark:border-slate-900 shadow-md ring-4 ring-rose-400/40 animate-pulse flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                  {val}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trục số phía dưới với các giá trị đánh dấu */}
        <div className="relative w-full h-8 border-t border-slate-300 dark:border-slate-700 mt-2">
          {ticks.map((t, idx) => {
            const posX = getXPercent(t);
            return (
              <div
                key={idx}
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${posX}%` }}
              >
                <div className="w-px h-2 bg-slate-300 dark:bg-slate-700"></div>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {t}
                </span>
              </div>
            );
          })}

          {/* Nhãn điểm Q1, Me, Q3 ngay trên trục */}
          <div
            className="absolute -top-6 -translate-x-1/2 text-[10px] font-bold text-indigo-700 dark:text-indigo-300"
            style={{ left: `${boxLeft}%` }}
          >
            Q₁={q1}
          </div>
          <div
            className="absolute -top-6 -translate-x-1/2 text-[10px] font-bold text-purple-700 dark:text-purple-300"
            style={{ left: `${medianPos}%` }}
          >
            Me={q2}
          </div>
          <div
            className="absolute -top-6 -translate-x-1/2 text-[10px] font-bold text-indigo-700 dark:text-indigo-300"
            style={{ left: `${getXPercent(q3)}%` }}
          >
            Q₃={q3}
          </div>
        </div>
      </div>

      {/* Chú thích thông số chi tiết */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
        <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-850">
          <span className="text-slate-400 block text-[10px]">Min (whisker)</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{whiskerMin}</span>
        </div>
        <div className="p-1.5 rounded bg-indigo-50 dark:bg-indigo-950/40">
          <span className="text-indigo-600 dark:text-indigo-400 block text-[10px]">Tứ phân vị Q₁</span>
          <span className="font-bold text-indigo-700 dark:text-indigo-300">{q1}</span>
        </div>
        <div className="p-1.5 rounded bg-purple-50 dark:bg-purple-950/40">
          <span className="text-purple-600 dark:text-purple-400 block text-[10px]">Trung vị Me (Q₂)</span>
          <span className="font-bold text-purple-700 dark:text-purple-300">{q2}</span>
        </div>
        <div className="p-1.5 rounded bg-indigo-50 dark:bg-indigo-950/40">
          <span className="text-indigo-600 dark:text-indigo-400 block text-[10px]">Tứ phân vị Q₃</span>
          <span className="font-bold text-indigo-700 dark:text-indigo-300">{q3}</span>
        </div>
        <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-850">
          <span className="text-slate-400 block text-[10px]">Max (whisker)</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{whiskerMax}</span>
        </div>
      </div>
    </div>
  );
}
