export function sanitizeCsvCell(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value);
  if (/^[=+\-@]/.test(text)) {
    return `'${text}`;
  }

  return text;
}

export function toCsv<T extends Record<string, unknown>>(rows: T[]) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]!);
  const csvRows = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = sanitizeCsvCell(row[header]);
          return `"${value.replaceAll('"', '""')}"`;
        })
        .join(",")
    )
  ];

  return csvRows.join("\n");
}
