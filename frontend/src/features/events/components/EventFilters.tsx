interface EventFiltersProps {
  value: string;
  onChange: (value: string) => void;
}

export function EventFilters({ value, onChange }: EventFiltersProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
    >
      <option value="">All events</option>
      <option value="USER_SIGNED_UP">User signed up</option>
      <option value="USER_LOGGED_IN">User logged in</option>
      <option value="API_ERROR">API error</option>
      <option value="CSV_EXPORTED">CSV exported</option>
      <option value="ADMIN_ACTION">Admin action</option>
    </select>
  );
}
