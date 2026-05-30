import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/authApi'
import type { User } from '../api/authApi'

interface LoginProps {
  onLogin: (user: User) => void
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const user = await login(email, password)
      onLogin(user)
      navigate(user.role === 'superadmin' ? '/superadmin/admins' : '/incidents', { replace: true })
    } catch (err: any) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center bg-slate-50">
      <h1 className="text-2xl font-semibold m-8 text-center text-slate-900">GovernanceHub</h1>

      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-semibold mb-6 text-center text-slate-900">Sign in</h1>

        {error && (
          <div data-testid="login-error" className="mb-4 text-sm text-red-700 bg-red-100 p-2 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-slate-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-slate-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
