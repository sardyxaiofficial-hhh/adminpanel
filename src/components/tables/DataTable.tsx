import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T | string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T | string)[];
  isLoading?: boolean;
  emptyMessage?: string;
  onExportCsv?: () => void;
  exportLabel?: string;
  id?: string;
}

export function DataTable<T>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Search data...",
  searchKeys,
  isLoading = false,
  emptyMessage = "No records found.",
  onExportCsv,
  exportLabel = "Export CSV",
  id = "data-table",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting handler
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Resolve object paths (e.g. "customer.name")
  const resolveValue = (obj: any, path: string): any => {
    if (!path) return '';
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  // Filter & Sort
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (searchTerm.trim() && searchable) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item => {
        // If specific keys are provided, search those. Otherwise search everything in columns
        const keysToSearch = searchKeys || columns.map(col => col.accessorKey as string).filter(Boolean);
        return keysToSearch.some(keyStr => {
          const val = resolveValue(item, keyStr as string);
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(lowerSearch);
        });
      });
    }

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const valA = resolveValue(a, sortKey);
        const valB = resolveValue(b, sortKey);

        const aNum = Number(valA);
        const bNum = Number(valB);

        // Check if numerical
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
        }

        // Fallback to string compare
        const strA = String(valA || '').toLowerCase();
        const strB = String(valB || '').toLowerCase();

        if (strA < strB) return sortOrder === 'asc' ? -1 : 1;
        if (strA > strB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortKey, sortOrder, columns, searchKeys, searchable]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  return (
    <div id={id} className="w-full flex flex-col gap-4">
      {/* Search and Action Header */}
      {(searchable || onExportCsv) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#8888aa]">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a26] border border-[#252535] rounded-xl text-white placeholder-[#55556a] text-sm focus:outline-none focus:border-[#d4a843] focus:ring-1 focus:ring-[#d4a843] transition-all"
              />
            </div>
          )}

          {onExportCsv && (
            <button
              onClick={onExportCsv}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#12121a] hover:bg-[#1a1a26] border border-[#252535] text-white hover:text-[#d4a843] rounded-xl text-sm font-semibold transition-all"
            >
              <Download size={15} />
              {exportLabel}
            </button>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-[#252535] bg-[#12121a]">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#252535] bg-[#0d0d15]">
              {columns.map((col, idx) => {
                const isSortable = col.sortable !== false && col.accessorKey;
                return (
                  <th
                    key={idx}
                    onClick={() => isSortable && handleSort(col.accessorKey as string)}
                    className={`px-5 py-4 text-xs font-bold text-[#8888aa] uppercase tracking-wider ${
                      isSortable ? 'cursor-pointer hover:text-white select-none' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.header}
                      {isSortable && (
                        <span className="text-[#55556a]">
                          {sortKey === col.accessorKey ? (
                            sortOrder === 'asc' ? <ChevronUp size={14} className="text-[#d4a843]" /> : <ChevronDown size={14} className="text-[#d4a843]" />
                          ) : (
                            <ChevronsUpDown size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Shimmer skeleton loading states
              Array.from({ length: pageSize }).map((_, rIdx) => (
                <tr key={rIdx} className="border-b border-[#252535] last:border-0">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="px-5 py-4">
                      <div className="h-4 bg-[#1a1a26] rounded animate-pulse w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-[#55556a]">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className="text-3xl text-[#55556a]">📋</span>
                    <p className="text-base text-[#8888aa] font-medium">{emptyMessage}</p>
                    {searchTerm && (
                      <p className="text-xs text-[#55556a]">Try clearing your search query or choosing a different branch filter.</p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row: any, rIdx) => {
                const rowKey = row?.id || row?.key || row?.invoice_number || row?.created_at || rIdx;
                return (
                  <tr
                    key={rowKey}
                    className="border-b border-[#252535] hover:bg-[#1a1a26]/50 last:border-0 transition-colors group"
                  >
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} className="px-5 py-4 text-white">
                        {col.cell ? (
                          col.cell(row)
                        ) : (
                          <span>{String(resolveValue(row, col.accessorKey as string) ?? '')}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!isLoading && processedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-1 text-sm text-[#8888aa]">
          <div className="flex items-center gap-3">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-[#1a1a26] border border-[#252535] text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#d4a843]"
            >
              {[5, 10, 25, 50].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span>records per page</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="mr-2">
              Showing <strong>{Math.min(processedData.length, (currentPage - 1) * pageSize + 1)}</strong> to{' '}
              <strong>{Math.min(processedData.length, currentPage * pageSize)}</strong> of{' '}
              <strong>{processedData.length}</strong> entries
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 bg-[#12121a] border border-[#252535] rounded-lg text-white hover:text-[#d4a843] hover:border-[#d4a843] disabled:opacity-40 disabled:hover:text-white disabled:hover:border-[#252535] transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                // Only show current page, first, last, and surrounding pages
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - currentPage) <= 1
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-[#d4a843] to-[#f0c060] text-black border-[#d4a843]'
                          : 'bg-[#12121a] border-[#252535] text-white hover:text-[#d4a843] hover:border-[#d4a843]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === 2 && currentPage > 3) ||
                  (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return <span key={pageNum} className="px-1 select-none">...</span>;
                }
                return null;
              })}
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 bg-[#12121a] border border-[#252535] rounded-lg text-white hover:text-[#d4a843] hover:border-[#d4a843] disabled:opacity-40 disabled:hover:text-white disabled:hover:border-[#252535] transition-all cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
