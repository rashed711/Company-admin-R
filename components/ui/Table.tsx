
import React from 'react';

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
}

const Table = <T extends { id: any }>(
  { columns, data, actions, onRowClick }: TableProps<T>
) => {
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
            {actions && <th scope="col" className="px-6 py-3 text-center font-semibold">إجراءات</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr 
              key={row.id} 
              className={`border-b border-[rgb(var(--color-border))] odd:bg-[rgb(var(--color-surface))] even:bg-[rgb(var(--color-muted))] dark:odd:bg-transparent dark:even:bg-[rgba(var(--color-surface),0.5)] hover:bg-[rgba(var(--color-primary),0.05)] dark:hover:bg-[rgb(var(--color-surface))] ${onRowClick ? 'cursor-pointer' : ''}`}
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
      {data.length === 0 && (
          <div className="text-center py-10 text-[rgb(var(--color-text-secondary))]">
              لا توجد بيانات لعرضها.
          </div>
      )}
    </div>
  );
};

export default Table;
