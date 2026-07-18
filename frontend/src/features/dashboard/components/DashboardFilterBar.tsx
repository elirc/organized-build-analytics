import { Card } from "../../../components/ui/card";
import { DateRangePicker } from "./DateRangePicker";

export function DashboardFilterBar(props: {
  startDate: string;
  endDate: string;
  interval: string;
  onRangeChange: (filters: { startDate: string; endDate: string }) => void;
  onIntervalChange: (interval: string) => void;
}) {
  return (
    <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Filters</p>
        <h2 className="mt-1 text-lg font-semibold">Date range and chart granularity</h2>
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <DateRangePicker startDate={props.startDate} endDate={props.endDate} onChange={props.onRangeChange} />
        <select
          value={props.interval}
          onChange={(event) => props.onIntervalChange(event.target.value)}
          className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
        </select>
      </div>
    </Card>
  );
}
