import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login(email, password)
      const { token, userId, name, role } = res.data
      loginUser({ userId, name, email, role }, token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-headline text-4xl text-primary mb-2">HR Sanctuary</h1>
          <p className="text-on-surface-variant font-body">Sign in to continue</p>
        </div>
        <div className="aveon-card p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                Email
              </label>
              <input
                className="aveon-input"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                Password
              </label>
              <input
                className="aveon-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm font-body">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="aveon-btn aveon-btn-primary w-full !justify-center disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}