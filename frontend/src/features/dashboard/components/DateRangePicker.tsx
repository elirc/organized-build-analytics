interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (filters: { startDate: string; endDate: string }) => void;
}

export function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <input
        type="date"
        className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
        value={startDate}
        onChange={(event) => onChange({ startDate: event.target.value, endDate })}
      />
      <input
        type="date"
        className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
        value={endDate}
        onChange={(event) => onChange({ startDate, endDate: event.target.value })}
      />
    </div>
  );
}
