import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#8b5cf6', '#ef4444']

function RevenueCategoryChart({ categories }) {
  const totalRevenue = categories.reduce(
    (total, category) => total + category.value,
    0
  )

  return (
    <div className="revenue-category-card">
      <h4>Revenue Mix</h4>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={categories}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
          >
            {categories.map((category, index) => (
              <Cell key={category.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => {
              const percentage = ((value / totalRevenue) * 100).toFixed(1)

              return [
                `$${value.toLocaleString()} (${percentage}%)`,
                'Revenue',
              ]
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <ul className="revenue-category-list">
        {categories.map((category) => (
          <li key={category.name}>
            <span>{category.name}</span>
            <strong>${category.value.toLocaleString()}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RevenueCategoryChart