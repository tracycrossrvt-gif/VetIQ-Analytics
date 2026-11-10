import { useState } from 'react'
import { useDashboard } from '../app/DashboardContext'
import { Heading, Panel } from '../app/UI'
const fields = [
 ['revenue','Revenue ($)'],['transactions','Transactions'],['hourlyLaborCost','Hourly labor cost ($)'],
 ['salaryLaborCost','Salaried labor cost ($)'],['cogs','Cost of goods ($)'],['newClients','New clients'],
 ['businessDaysElapsed','Business days elapsed'],['totalBusinessDays','Total business days']
]
export default function DataEntry() {
 const {data,save,savedAt}=useDashboard()
 const [draft,setDraft]=useState(data)
 const [message,setMessage]=useState('')
 function submit(e) {
  e.preventDefault()
  const values=fields.map(([key])=>Number(draft[key]))
  if(values.some(v=>!Number.isFinite(v)||v<0)||Number(draft.transactions)<=0||Number(draft.revenue)<=0||
    Number(draft.businessDaysElapsed)<=0||Number(draft.totalBusinessDays)<=0||
    Number(draft.businessDaysElapsed)>Number(draft.totalBusinessDays)) {
    setMessage('Please enter valid nonnegative values. Revenue, transactions and business days must be positive; elapsed days cannot exceed total days.')
    return
  }
  const next={...data,...Object.fromEntries(fields.map(([key])=>[key,Number(draft[key])]))}
  save(next);setMessage('Saved. All pages now use your updated current-month figures.')
 }
 function reset(){setDraft(data);setMessage('Unsaved edits discarded.')}
 return <><Heading eyebrow="DATA MANAGEMENT" title="Update practice data" subtitle="Enter your current-month figures. Changes appear across the dashboard after saving."/>
 <div className="info-strip">Data is stored in this browser only. It is not uploaded, synced between devices or shared with other users.</div>
 <Panel title="Current month"><form onSubmit={submit}>
  <div className="entry-grid">{fields.map(([key,label])=><label key={key} className="entry-field"><span>{label}</span><input type="number" min="0" step={['revenue','hourlyLaborCost','salaryLaborCost','cogs'].includes(key)?'0.01':'1'} value={draft[key]??''} onChange={e=>{setDraft(v=>({...v,[key]:e.target.value}));setMessage('')}} required/></label>)}</div>
  <div className="form-footer"><button className="save-button" type="submit">Save changes</button><button className="reset-button" type="button" onClick={reset}>Discard edits</button></div>
  {message&&<p className="form-message" role="status">{message}</p>}
  {savedAt&&<p className="fine-print">Last saved in this session: {savedAt.toLocaleTimeString()}</p>}
 </form></Panel>
 <p className="data-note">Doctor production, revenue mix and historical charts remain separate sample data. Current-month edits update the Overview, Revenue, Client Growth and Cost & Labor metrics.</p>
 </>
}
