import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DashboardProvider } from './app/DashboardContext'
import AppLayout from './app/AppLayout'
import Overview from './pages/Overview'
import Revenue from './pages/Revenue'
import Doctors from './pages/Doctors'
import Clients from './pages/Clients'
import Costs from './pages/Costs'
import DataEntry from './pages/DataEntry'
import './App.css'
export default function App() {
 return <DashboardProvider><BrowserRouter><Routes><Route element={<AppLayout/>}>
  <Route index element={<Overview/>}/>
  <Route path="revenue" element={<Revenue/>}/>
  <Route path="doctors" element={<Doctors/>}/>
  <Route path="clients" element={<Clients/>}/>
  <Route path="costs" element={<Costs/>}/>
  <Route path="data-entry" element={<DataEntry/>}/>
  <Route path="*" element={<Overview/>}/>
 </Route></Routes></BrowserRouter></DashboardProvider>
}
