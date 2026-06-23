function ProgressBar({ label, value, target, percent, helper }) {
  return (
    <div className="progress-card">
      <div className="progress-card__header">
        <div>
          <p>{label}</p>
          <h4>{value}</h4>
        </div>

        <span>{percent}%</span>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${Math.min(percent, 100)}%` }}
        ></div>
      </div>

      <small>{helper || `Target: ${target}`}</small>
    </div>
  )
}

export default ProgressBar