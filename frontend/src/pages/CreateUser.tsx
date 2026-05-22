import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../api/usersApi'

function CreateUser() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setSubmitting(true)

    try {
      const user = await createUser(name.trim(), email.trim(), password)
      setSuccess(`User ${user.name} (${user.email}) created successfully`)
      setName('')
      setEmail('')
      setPassword('')
    } catch (err: any) {
      setError(err?.message || 'Failed to create user')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow h-full">
        <h1 className="text-2xl font-semibold mb-6 text-center text-slate-900">Create User</h1>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 p-2 rounded">{error}</div>
        )}

        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-100 p-2 rounded">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm">
          <button
            onClick={() => navigate('/incidents')}
            className="text-indigo-600 hover:underline"
          >
            Back to Incidents
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateUser
