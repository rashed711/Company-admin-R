
import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T;
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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
      <table className="w-full text-sm text-start text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((col) => (
              <th key={String(col.accessor)} scope="col" className="px-6 py-3">
                {col.header}
              </th>
            ))}
            {actions && <th scope="col" className="px-6 py-3 text-center">إجراءات</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr 
              key={row.id} 
              className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => (
                <td key={`${row.id}-${String(col.accessor)}`} className="px-6 py-4">
                  {col.render ? col.render(row[col.accessor], row) : String(row[col.accessor])}
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
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              لا توجد بيانات لعرضها.
          </div>
      )}
    </div>
  );
};

export default Table;