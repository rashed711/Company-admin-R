import React from 'react';
import { useTranslation } from '../../services/localization';

interface Column<T> {
  header: string;
  accessor: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
}

const Table = <T extends { id: any }>(
  { columns, data, actions, onRowClick, isLoading = false }: TableProps<T>
) => {
  const { t } = useTranslation();

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-10">
      <svg className="animate-spin h-8 w-8 text-[rgb(var(--color-primary))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
  
  return (
    <div className="bg-[rgb(var(--color-surface))] p-4 rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full text-sm text-start text-[rgb(var(--color-text-secondary))]">
        <thead className="text-xs text-[rgb(var(--color-text-secondary))] bg-[rgb(var(--color-muted))]">
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} scope="col" className="px-6 py-3 font-semibold">
                {col.header}
              </th>
            ))}
            {actions && <th scope="col" className="px-6 py-3 text-center font-semibold">{t('actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {!isLoading && data.map((row) => (
            <tr 
              key={row.id} 
              className={`border-b border-[rgb(var(--color-border))] odd:bg-[rgb(var(--color-surface))] even:bg-[rgb(var(--color-muted))] hover:bg-[rgba(var(--color-primary),0.05)] dark:odd:bg-[rgb(var(--color-background))] dark:even:bg-[rgba(var(--color-surface),0.3)] dark:hover:bg-[rgb(var(--color-surface))] ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => (
                <td key={`${row.id}-${col.accessor}`} className="px-6 py-4 font-medium">
                  {col.render ? col.render((row as any)[col.accessor], row) : String((row as any)[col.accessor] ?? '')}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 text-center">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {isLoading && <LoadingSpinner />}
      {!isLoading && data.length === 0 && (
          <div className="text-center py-10 text-[rgb(var(--color-text-secondary))]">
              {t('no_data_to_display')}
          </div>
      )}
    </div>
  );
};

export default Table;