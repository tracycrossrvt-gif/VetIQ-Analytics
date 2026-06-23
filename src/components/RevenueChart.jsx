import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

function RevenueChart({ data, goal }) {
  return (
    <div className="chart-card">
      <h3>Revenue Trend</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" />

         <YAxis
  tickFormatter={(value) =>
    `$${(value / 1000).toFixed(0)}k`
  }
/> 

        <Tooltip
  formatter={(value) => [
    `$${value.toLocaleString()}`,
    'Revenue',
  ]}
/>  

<ReferenceLine
  y={goal}
  stroke="#dc2626"
  strokeDasharray="5 5"
  label="Revenue Goal"
/>

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={3} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueChart