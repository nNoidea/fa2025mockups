import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ArrowUp, ArrowDown, Filter, X, Search, Check } from 'lucide-react';

interface ColumnHeaderProps<T> extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  columnKey?: keyof T;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'select';
  filterOptions?: string[];
  currentSort?: 'asc' | 'desc' | null;
  currentFilter?: any;
  onSort?: (direction: 'asc' | 'desc' | null) => void;
  onFilter?: (value: any) => void;
}

const ColumnHeader = <T,>({ 
  children, 
  className, 
  columnKey,
  sortable,
  filterable,
  filterType = 'text',
  filterOptions = [],
  currentSort,
  currentFilter,
  onSort,
  onFilter,
  ...props 
}: ColumnHeaderProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = currentSort || currentFilter;

  return (
    <th 
      className={cn(
        "p-4 text-xs font-bold text-slate-500 uppercase border-b border-slate-200 relative group select-none",
        isActive && "text-secondary bg-slate-50",
        className
      )} 
      {...props}
    >
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => (sortable || filterable) && setIsOpen(!isOpen)}
      >
        <span>{children}</span>
        
        {/* Instant Clear Button */}
        {isActive && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onSort) onSort(null);
              if (onFilter) onFilter(null);
            }}
            className="p-0.5 rounded-full hover:bg-red-100 text-red-500 transition-colors"
            title="Filter Wissen"
          >
            <X className="h-3 w-3" />
          </button>
        )}

        {(sortable || filterable) && (
          <div
            className={cn(
              "p-1 rounded-full transition-colors",
              (isOpen || isActive) 
                ? "bg-blue-100 text-secondary" 
                : "text-slate-400 group-hover:bg-blue-100 group-hover:text-secondary"
            )}
          >
            {currentSort === 'asc' && <ArrowUp className="h-3 w-3" />}
            {currentSort === 'desc' && <ArrowDown className="h-3 w-3" />}
            {!currentSort && currentFilter && <Filter className="h-3 w-3" />}
            {!currentSort && !currentFilter && <ChevronDown className="h-3 w-3" />}
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (sortable || filterable) && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden"
        >
          {/* Sort Options */}
          {sortable && onSort && (
            <div className="p-2 border-b border-slate-100">
              <div className="text-xs font-semibold text-slate-400 mb-2 px-2">SORTEREN</div>
              <button 
                onClick={() => { onSort('asc'); setIsOpen(false); }}
                className={cn(
                  "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-slate-50 flex items-center gap-2",
                  currentSort === 'asc' && "text-secondary bg-blue-50"
                )}
              >
                <ArrowUp className="h-3 w-3" /> Oplopend
              </button>
              <button 
                onClick={() => { onSort('desc'); setIsOpen(false); }}
                className={cn(
                  "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-slate-50 flex items-center gap-2",
                  currentSort === 'desc' && "text-secondary bg-blue-50"
                )}
              >
                <ArrowDown className="h-3 w-3" /> Aflopend
              </button>
            </div>
          )}

          {/* Filter Options */}
          {filterable && onFilter && (
            <div className="p-2">
              <div className="text-xs font-semibold text-slate-400 mb-2 px-2">FILTEREN</div>
              
              <div className="px-2 mb-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Zoeken..."
                    value={filterType === 'text' ? (currentFilter || '') : ''} 
                    onChange={(e) => onFilter && onFilter(e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:border-secondary"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {filterType === 'select' && (
                <div className="space-y-1 px-2 max-h-40 overflow-y-auto border-t border-slate-100 pt-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => onFilter && onFilter(currentFilter === option ? null : option)}
                      className={cn(
                        "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-slate-50 flex items-center gap-2",
                        currentFilter === option && "text-secondary bg-blue-50 font-medium"
                      )}
                    >
                      {currentFilter === option && <Check className="h-3 w-3" />}
                      <span className={cn(currentFilter !== option && "pl-5")}>{option}</span>
                    </button>
                  ))}
                </div>
              )}

              {(currentFilter || currentSort) && (
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (onSort) onSort(null);
                      if (onFilter) onFilter(null);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded flex items-center gap-2"
                  >
                    <X className="h-3 w-3" /> Filters Wissen
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </th>
  );
};

export default ColumnHeader;
