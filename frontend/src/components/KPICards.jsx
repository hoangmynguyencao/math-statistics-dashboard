import React from 'react';
import { Users, Calculator, Divide, Layers } from 'lucide-react';
import MathFormula from './MathFormula';

export default function KPICards({ stats }) {
  const cards = [
    {
      title: 'Cỡ mẫu',
      symbol: 'n',
      mathSymbol: 'n',
      value: stats ? stats.sample_size : '—',
      subText: stats ? 'Tổng số phần tử đã thu thập' : 'Chờ bạn nhập số liệu',
      icon: Users,
      badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      iconBg: 'bg-blue-500 text-white',
    },
    {
      title: 'Số trung bình',
      symbol: '\\bar{x}',
      mathSymbol: '\\bar{x}',
      value: stats ? stats.mean : '—',
      subText: stats && stats.sorted_values ? `Tổng = ${stats.sorted_values.reduce((a, b) => a + b, 0).toFixed(2)}` : 'Chờ bạn nhập số liệu',
      icon: Calculator,
      badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      iconBg: 'bg-emerald-500 text-white',
    },
    {
      title: 'Trung vị',
      symbol: 'M_e',
      mathSymbol: 'M_e (Q_2)',
      value: stats ? stats.median : '—',
      subText: stats ? 'Chia đôi mẫu số liệu 50%' : 'Chờ bạn nhập số liệu',
      icon: Divide,
      badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      iconBg: 'bg-purple-500 text-white',
    },
    {
      title: 'Khoảng tứ phân vị',
      symbol: '\\Delta_Q',
      mathSymbol: '\\Delta_Q',
      value: stats ? stats.iqr : '—',
      subText: stats ? `Q_3 - Q_1 = ${stats.q3} - ${stats.q1}` : 'Chờ bạn nhập số liệu',
      icon: Layers,
      badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      iconBg: 'bg-amber-500 text-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm ${card.iconBg}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-1.5">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {card.value}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${card.badgeColor}`}>
                <MathFormula formula={card.mathSymbol} />
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {card.subText}
            </p>
          </div>
        );
      })}
    </div>
  );
}
