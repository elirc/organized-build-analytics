import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function EventsByTypeChart({ data }: { data: { eventType: string; count: number }[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#d9cfbf" strokeDasharray="4 4" />
          <XAxis dataKey="eventType" interval={0} angle={-20} height={70} textAnchor="end" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#d97904" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
