import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout.jsx'
import HRHub from './pages/HRHub.jsx'
import SmartScreening from './pages/SmartScreening.jsx'
import PolicyQA from './pages/PolicyQA.jsx'
import AppraisalGenerator from './pages/AppraisalGenerator.jsx'
import OfferCenter from './pages/OfferCenter.jsx'
import Login from './pages/Login.jsx'
import Aurora from './components/ui/Aurora.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center">
    <p className="text-on-surface-variant font-body">Loading...</p>
  </div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<HRHub />} />
        <Route path="/screening" element={<SmartScreening />} />
        <Route path="/policy-qa" element={<PolicyQA />} />
        <Route path="/appraisals" element={<AppraisalGenerator />} />
        <Route path="/offers" element={<OfferCenter />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="relative min-h-screen selection:bg-secondary/20 selection:text-on-surface overflow-x-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Aurora
            colorStops={["#7cff67","#B497CF","#5227FF"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>
        <div className="relative z-10 text-on-surface">
          <AppRoutes />
        </div>
      </div>
    </AuthProvider>
  )
}

export default App