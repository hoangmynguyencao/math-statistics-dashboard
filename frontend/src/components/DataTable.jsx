import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Search, 
  Trash2, 
  Edit3, 
  ArrowUpDown, 
  Eye, 
  AlertTriangle, 
  Filter, 
  CheckCircle2 
} from 'lucide-react';
import MathFormula from './MathFormula';

export default function DataTable({ 
  datasets, 
  onSelectDataset, 
  onDeleteDataset, 
  onEditDataset, 
  activeDatasetId 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // all | simple | frequency | has_outliers
  const [sortBy, setSortBy] = useState('created_at_desc'); // created_at_desc | n_desc | mean_desc | name_asc

  // Lọc và sắp xếp
  const filteredDatasets = useMemo(() => {
    return datasets
      .filter((item) => {
        // Tìm kiếm
        const matchesSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
          item.raw_data.includes(searchTerm);

        if (!matchesSearch) return false;

        // Bộ lọc
        if (filterMode === 'simple') return item.mode === 'simple';
        if (filterMode === 'frequency') return item.mode === 'frequency';
        if (filterMode === 'has_outliers') {
          return item.stats?.outliers && item.stats.outliers.length > 0;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'created_at_desc') {
          return (b.created_at || '').localeCompare(a.created_at || '');
        }
        if (sortBy === 'n_desc') {
          return (b.stats?.sample_size || 0) - (a.stats?.sample_size || 0);
        }
        if (sortBy === 'mean_desc') {
          return (b.stats?.mean || 0) - (a.stats?.mean || 0);
        }
        if (sortBy === 'name_asc') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [datasets, searchTerm, filterMode, sortBy]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Bảng lưu trữ các mẫu số liệu (CSV Database)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Lưu vĩnh viễn trong file CSV trên server, hỗ trợ tìm kiếm, lọc và phân tích lại bất cứ lúc nào
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên hoặc ghi chú..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
          />
        </div>

        {/* Filter Type */}
        <div className="flex items-center gap-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="w-full py-1.5 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none text-xs"
          >
            <option value="all">Tất cả mẫu ({datasets.length})</option>
            <option value="simple">Chế độ dãy số</option>
            <option value="frequency">Chế độ có tần số</option>
            <option value="has_outliers">Chỉ mẫu có giá trị ngoại lệ</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-1.5 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full py-1.5 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none text-xs"
          >
            <option value="created_at_desc">Mới nhất trước</option>
            <option value="n_desc">Cỡ mẫu n lớn nhất</option>
            <option value="mean_desc">Số trung bình cao nhất</option>
            <option value="name_asc">Tên (A → Z)</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-2.5 px-3">Tên bài toán / Mẫu</th>
              <th className="py-2.5 px-3 text-center">Cỡ mẫu (n)</th>
              <th className="py-2.5 px-3 text-center">Trung bình (<MathFormula formula="\bar{x}" />)</th>
              <th className="py-2.5 px-3 text-center">Trung vị (<MathFormula formula="M_e" />)</th>
              <th className="py-2.5 px-3 text-center">Tứ phân vị (<MathFormula formula="\Delta_Q" />)</th>
              <th className="py-2.5 px-3 text-center">Ngoại lệ</th>
              <th className="py-2.5 px-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredDatasets.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  {datasets.length === 0
                    ? 'Chưa có mẫu số liệu nào được lưu trong cơ sở dữ liệu. Bạn hãy nhập mẫu số liệu đầu tiên ở form phía trên!'
                    : 'Không tìm thấy mẫu số liệu nào phù hợp với bộ lọc.'}
                </td>
              </tr>
            ) : (
              filteredDatasets.map((row) => {
                const isActive = row.id === activeDatasetId;
                const outliers = row.stats?.outliers || [];
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors ${
                      isActive ? 'bg-indigo-50/60 dark:bg-indigo-950/30' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" title="Đang xem"></span>
                        )}
                        <span>{row.name}</span>
                      </div>
                      {row.notes && (
                        <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                          {row.notes}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {row.created_at || 'Vừa xong'} • {row.mode === 'frequency' ? 'Có tần số' : 'Dãy số'}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                      {row.stats?.sample_size || 0}
                    </td>

                    <td className="py-3 px-3 text-center font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                      {row.stats?.mean || 0}
                    </td>

                    <td className="py-3 px-3 text-center font-mono text-purple-600 dark:text-purple-400 font-semibold">
                      {row.stats?.median || 0}
                    </td>

                    <td className="py-3 px-3 text-center font-mono text-amber-600 dark:text-amber-400 font-semibold">
                      {row.stats?.iqr || 0}
                    </td>

                    <td className="py-3 px-3 text-center">
                      {outliers.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                          <AlertTriangle className="w-3 h-3" />
                          {outliers.length} điểm
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Không có</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectDataset(row)}
                          className={`p-1.5 rounded-md transition-colors ${
                            isActive
                              ? 'bg-indigo-600 text-white'
                              : 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
                          }`}
                          title="Tải lên bảng điều khiển để phân tích"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditDataset(row)}
                          className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Chỉnh sửa mẫu số liệu"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc muốn xóa mẫu "${row.name}" khỏi cơ sở dữ liệu CSV?`)) {
                              onDeleteDataset(row.id);
                            }
                          }}
                          className="p-1.5 rounded-md text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Xóa mẫu số liệu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
