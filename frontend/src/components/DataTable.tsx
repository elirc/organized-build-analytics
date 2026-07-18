import type { ReactNode } from "react";

interface DataTableProps<T extends object> {
  columns: { key: keyof T; header: string; render?: (value: T[keyof T], row: T) => ReactNode }[];
  rows: T[];
}

export function DataTable<T extends object>({ columns, rows }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--border)]">
      <table className="min-w-full bg-[var(--surface)] text-left text-sm">
        <thead className="bg-[var(--surface-2)] text-[var(--muted)]">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-4 py-3 font-medium">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-[var(--border)]">
              {columns.map((column) => {
                const value = row[column.key];

                return (
                  <td key={String(column.key)} className="px-4 py-3">
                    {column.render ? column.render(value, row) : String(value ?? "")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
