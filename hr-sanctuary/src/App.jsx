import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import HRHub from './pages/HRHub.jsx'
import SmartScreening from './pages/SmartScreening.jsx'
import PolicyQA from './pages/PolicyQA.jsx'
import AppraisalGenerator from './pages/AppraisalGenerator.jsx'
import OfferCenter from './pages/OfferCenter.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HRHub />} />
        <Route path="/screening" element={<SmartScreening />} />
        <Route path="/policy-qa" element={<PolicyQA />} />
        <Route path="/appraisals" element={<AppraisalGenerator />} />
        <Route path="/offers" element={<OfferCenter />} />
      </Route>
    </Routes>
  )
}

export default App
