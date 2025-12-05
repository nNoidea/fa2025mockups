import React from 'react';
import { Search, Plus, Download } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onExport?: () => void;
  onAdd?: () => void;
  addLabel?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  searchPlaceholder = 'Zoeken ...',
  searchValue = '',
  onSearchChange,
  onExport,
  onAdd,
  addLabel = 'Toevoegen',
}) => {
  return (
    <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 rounded-t-lg">
      <h2 className="font-bold text-lg text-slate-700">{title}</h2>
      <div className="flex gap-3 w-full sm:w-auto">
        {onSearchChange && (
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary w-64"
            />
          </div>
        )}
        
        {onExport && (
          <button 
            onClick={onExport}
            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2 shrink-0"
          >
            <Download className="h-4 w-4" /> Exporteer CSV
          </button>
        )}

        {onAdd && (
          <button 
            onClick={onAdd}
            className="bg-secondary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2 shrink-0"
          >
            <Plus className="h-4 w-4" /> {addLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
