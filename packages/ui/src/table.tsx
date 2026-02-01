import type { ReactNode, TableHTMLAttributes } from 'react';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T, index: number) => ReactNode;
  width?: string;
}

export interface TableProps<T> extends Omit<TableHTMLAttributes<HTMLTableElement>, 'children'> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  emptyMessage?: string;
  onRowClick?: (item: T, index: number) => void;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  onRowClick,
  className = '',
  ...props
}: TableProps<T>) {
  const getCellValue = (item: T, column: TableColumn<T>, index: number): ReactNode => {
    if (column.render) {
      return column.render(item, index);
    }
    const value = item[column.key as keyof T];
    if (value === null || value === undefined) {
      return '-';
    }
    return String(value);
  };

  return (
    <div className="ui-table-container">
      <table className={`ui-table ${className}`.trim()} {...props}>
        <thead className="ui-table__head">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="ui-table__header"
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="ui-table__body">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="ui-table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={keyExtractor(item, index)}
                className={`ui-table__row ${onRowClick ? 'ui-table__row--clickable' : ''}`}
                onClick={onRowClick ? () => onRowClick(item, index) : undefined}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className="ui-table__cell">
                    {getCellValue(item, column, index)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
