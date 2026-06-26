import { useState } from 'react'

function DoctorInsights({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0].id)

  const selectedDoctor = doctors.find(
    (doctor) => doctor.id === selectedDoctorId
  )

  return (
    <section className="doctor-insights">
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Production Intelligence</p>
          <h3>Doctor Insights</h3>
        </div>
      </div>

      <div className="doctor-layout">
        <div className="doctor-grid">
          {doctors.map((doctor) => (
            <button
              key={doctor.id}
              className={`doctor-card ${
                doctor.id === selectedDoctorId ? 'active' : ''
              }`}
              onClick={() => setSelectedDoctorId(doctor.id)}
            >
              <span>{doctor.name}</span>
              <strong>${doctor.production.toLocaleString()}</strong>
              <small>ACT: ${doctor.act}</small>
            </button>
          ))}
        </div>

        <div className="doctor-detail-card">
          <h4>{selectedDoctor.name}</h4>

          <div className="doctor-stats-grid">
            <div>
              <p>Production</p>
              <strong>${selectedDoctor.production.toLocaleString()}</strong>
            </div>

            <div>
              <p>ACT</p>
              <strong>${selectedDoctor.act}</strong>
            </div>

            <div>
              <p>Transactions</p>
              <strong>{selectedDoctor.transactions}</strong>
            </div>
          </div>

          <h5>Revenue Categories</h5>

          <ul className="doctor-category-list">
            {Object.entries(selectedDoctor.categories).map(([category, value]) => (
              <li key={category}>
                <span>{formatCategoryName(category)}</span>
                <strong>${value.toLocaleString()}</strong>
              </li>
            ))}
          </ul>

          <h5>Strengths</h5>

          <ul className="doctor-strengths">
            {selectedDoctor.strengths.map((strength) => (
              <li key={strength}>✓ {strength}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function formatCategoryName(category) {
  return category
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letter) => letter.toUpperCase())
}

export default DoctorInsights