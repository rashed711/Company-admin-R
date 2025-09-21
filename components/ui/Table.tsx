
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
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full text-sm text-start text-gray-600 dark:text-gray-400">
        <thead className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
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
              className={`border-b dark:border-gray-800 odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800/50 hover:bg-sky-50 dark:hover:bg-gray-800 ${onRowClick ? 'cursor-pointer' : ''}`}
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
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              لا توجد بيانات لعرضها.
          </div>
      )}
    </div>
  );
};

export default Table;