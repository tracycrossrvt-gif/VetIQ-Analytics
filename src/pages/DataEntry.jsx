import { useState } from 'react'
import { useDashboard } from '../app/DashboardContext'
import { Heading, Panel } from '../app/UI'
const fields = [
 ['revenue','Revenue ($)'],['transactions','Transactions'],['hourlyLaborCost','Hourly labor cost ($)'],
 ['salaryLaborCost','Salaried labor cost ($)'],['otherOperatingExpenses','Other operating expenses ($)'],['cogs','Cost of Goods ($)'],['newClients','New clients'],
 ['businessDaysElapsed','Business days elapsed'],['totalBusinessDays','Total business days']
]
export default function DataEntry() {
 const {data,save,savedAt}=useDashboard()
 const [draft,setDraft]=useState({...data,otherOperatingExpenses:data.otherOperatingExpenses ?? ''})
 const [message,setMessage]=useState('')
 function submit(e) {
  e.preventDefault()
  const values=fields.filter(([key])=>key!=='otherOperatingExpenses').map(([key])=>Number(draft[key]))
  const expenses = draft.otherOperatingExpenses
  const expensesValid = expenses === '' || expenses === null || expenses === undefined || (Number.isFinite(Number(expenses)) && Number(expenses)>=0)
  if(!expensesValid || values.some(v=>!Number.isFinite(v)||v<0)||Number(draft.transactions)<=0||Number(draft.revenue)<=0||
    Number(draft.businessDaysElapsed)<=0||Number(draft.totalBusinessDays)<=0||
    Number(draft.businessDaysElapsed)>Number(draft.totalBusinessDays)) {
    setMessage('Please enter valid nonnegative values. Revenue, transactions and business days must be positive; elapsed days cannot exceed total days.')
    return
  }
  const next={...data,...Object.fromEntries(fields.map(([key])=>[key,key==='otherOperatingExpenses' && (draft[key] === '' || draft[key] == null) ? '' : Number(draft[key])]))}
  save(next);setMessage('Saved. All pages now use your updated current-month figures.')
 }
 function reset(){setDraft({...data,otherOperatingExpenses:data.otherOperatingExpenses ?? ''});setMessage('Unsaved edits discarded.')}
 return <><Heading eyebrow="DATA MANAGEMENT" title="Update practice data" subtitle="Enter your current-month figures. Changes appear across the dashboard after saving."/>
 <div className="info-strip">Data is stored in this browser only. It is not uploaded, synced between devices or shared with other users.</div>
 <Panel title="Current month"><form onSubmit={submit}>
  <p className="fine-print">Other operating expenses are optional, but EBITDA margin will show as unavailable until they are entered. Include all applicable operating expenses not already listed, excluding interest, taxes, depreciation and amortization.</p>
  <div className="entry-grid">{fields.map(([key,label])=><label key={key} className="entry-field"><span>{label}</span><input type="number" min="0" step={['revenue','hourlyLaborCost','salaryLaborCost','otherOperatingExpenses','cogs'].includes(key)?'0.01':'1'} value={draft[key]??''} onChange={e=>{setDraft(v=>({...v,[key]:e.target.value}));setMessage('')}} required={key!=='otherOperatingExpenses'}/></label>)}</div>
  <div className="form-footer"><button className="save-button" type="submit">Save changes</button><button className="reset-button" type="button" onClick={reset}>Discard edits</button></div>
  {message&&<p className="form-message" role="status">{message}</p>}
  {savedAt&&<p className="fine-print">Last saved in this session: {savedAt.toLocaleTimeString()}</p>}
 </form></Panel>
 <p className="data-note">Doctor production, revenue mix and historical charts remain separate sample data. Current-month edits update the Overview, Revenue, Client Growth and Cost & Labor metrics.</p>
 </>
}
