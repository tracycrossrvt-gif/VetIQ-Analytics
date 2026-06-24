function DataEntryForm({ formData, onChange, onSubmit, isUpdated, onReset }) {
  return (
    <form className="data-entry-form" onSubmit={onSubmit}>
      <h3>Update Current Month</h3>

      <div className="form-grid">
        <label>
          Revenue
          <input
            type="number"
            name="revenue"
            value={formData.revenue}
            onChange={onChange}
          />
        </label>

        <label>
          Transactions
          <input
            type="number"
            name="transactions"
            value={formData.transactions}
            onChange={onChange}
          />
        </label>

        <label>
          Hourly Labor Cost
          <input
            type="number"
            name="hourlyLaborCost"
            value={formData.hourlyLaborCost}
            onChange={onChange}
          />
        </label>

        <label>
          Salary Labor Cost
          <input
            type="number"
            name="salaryLaborCost"
            value={formData.salaryLaborCost}
            onChange={onChange}
          />
        </label>

        <label>
          COGS
          <input
            type="number"
            name="cogs"
            value={formData.cogs}
            onChange={onChange}
          />
        </label>

        <label>
          New Clients
          <input
            type="number"
            name="newClients"
            value={formData.newClients}
            onChange={onChange}
          />
        </label>

        <label>
          Business Days Elapsed
          <input
            type="number"
            name="businessDaysElapsed"
            value={formData.businessDaysElapsed}
            onChange={onChange}
          />
        </label>

        <label>
          Total Business Days
          <input
            type="number"
            name="totalBusinessDays"
            value={formData.totalBusinessDays}
            onChange={onChange}
          />
        </label>
      </div>
<div className="form-actions">
  <button type="submit">
    Update Dashboard
  </button>

  <button
    type="button"
    onClick={onReset}
  >
    Reset
  </button>
</div>


 {isUpdated && (
  <div className="success-message">
    <p>✓ Dashboard Updated</p>
    <p>✓ Forecast Recalculated</p>
    <p>✓ Health Score Updated</p>
  </div>
)}   

    </form>
  )
}

export default DataEntryForm