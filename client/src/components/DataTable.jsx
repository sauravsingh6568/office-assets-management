function DataTable({ columns, rows, renderCell, keyField }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="hidden grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 lg:grid">
        {columns.map((column) => (
          <div key={column.key} className={`min-w-0 ${column.className}`}>
            {column.label}
          </div>
        ))}
      </div>

      <div className="divide-y divide-slate-200">
        {rows.map((row) => (
          <div
            key={row[keyField]}
            className="grid gap-4 px-5 py-5 sm:grid-cols-2 lg:grid-cols-12 lg:items-start"
          >
            {columns.map((column) => (
              <div key={column.key} className={`min-w-0 ${column.className}`}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 lg:hidden">
                  {column.label}
                </p>
                {renderCell(row, column.key)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DataTable;
