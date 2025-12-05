import { useState, useMemo } from 'react';

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

export function useTableState<T>(initialData: T[]) {
  const [data, setData] = useState<T[]>(initialData);
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);
  const [filters, setFilters] = useState<Partial<Record<keyof T, any>>>({});

  const handleSort = (key: keyof T, direction: SortDirection) => {
    setSortConfig({ key, direction });
  };

  const handleFilter = (key: keyof T, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      if (value === '' || value === null || value === undefined) {
        delete newFilters[key];
      }
      return newFilters;
    });
  };

  const clearFilter = (key: keyof T) => {
    handleFilter(key, null);
  };

  const processedData = useMemo(() => {
    let result = [...data];

    // Apply Filters
    Object.keys(filters).forEach(key => {
      const filterValue = filters[key as keyof T];
      if (filterValue) {
        result = result.filter(item => {
          const itemValue = String(item[key as keyof T]).toLowerCase();
          const searchTerms = String(filterValue).toLowerCase();
          return itemValue.includes(searchTerms);
        });
      }
    });

    // Apply Sort
    if (sortConfig && sortConfig.direction) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, sortConfig]);

  return {
    data,
    setData,
    processedData,
    sortConfig,
    filters,
    handleSort,
    handleFilter,
    clearFilter
  };
}
