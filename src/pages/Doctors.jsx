import { Heading } from '../app/UI'
import DoctorInsights from '../components/DoctorInsights'
import doctorData from '../data/doctorData'
export default function Doctors() {
 return <><Heading eyebrow="PROVIDER PERFORMANCE" title="Doctor insights" subtitle="Review individual provider production, transactions and service mix."/>
 <div className="info-strip">Sample provider dataset · This report is illustrative and is not linked to the editable monthly totals.</div>
 <DoctorInsights doctors={doctorData}/></>
}
