import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function EventsOverTimeChart({ data }: { data: { date: string; count: number }[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="eventsGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#174b3a" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#174b3a" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#d9cfbf" strokeDasharray="4 4" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="#174b3a" fill="url(#eventsGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
