function KPICard({
  title,
  value,
  goal,
  status,
  onClick,
}) {
  return (
    <div
      className="kpi-card"
      onClick={onClick}
    >
      <div className="kpi-card__header">
        <p>{title}</p>

        {status && (
          <span className={`status-badge ${status}`}>
            {status}
          </span>
        )}
      </div>

      <h2>{value}</h2>
      <span>{goal}</span>
    </div>
  )
}

export default KPICard