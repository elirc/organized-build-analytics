import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ConversionFunnelChart({
  data
}: {
  data: Array<{ stage: string; count: number; conversionRate: number }>;
}) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#d9cfbf" strokeDasharray="4 4" />
          <XAxis dataKey="stage" interval={0} angle={-15} height={60} textAnchor="end" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#174b3a" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
