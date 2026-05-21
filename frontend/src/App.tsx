import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import type { User } from './api/authApi'
import Login from './pages/Login'
import Incidents from './pages/Incidents'
import CreateUser from './pages/CreateUser'

function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('user')
    if (raw) {
      try {
        setUser(JSON.parse(raw))
      } catch {
        setUser(null)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/login'
  }

  const isAuthenticated = Boolean(localStorage.getItem('token'))

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4">
          {user && (
            <div className="mb-4 rounded bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                  <Link to="/incidents" className="text-indigo-600 hover:text-indigo-700">
                    Incidents
                  </Link>
                  <Link to="/users/new" className="text-indigo-600 hover:text-indigo-700">
                    Create User
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                  <span>Signed in as <strong>{(user as any).name || (user as any).email}</strong></span>
                  <button onClick={handleLogout} className="text-indigo-600 hover:underline">
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}

          <Routes>
            <Route path="/" element={<Navigate to={isAuthenticated ? '/incidents' : '/login'} replace />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/incidents" replace /> : <Login onLogin={setUser} />} />
            <Route path="/incidents" element={isAuthenticated ? <Incidents /> : <Navigate to="/login" replace />} />
            <Route path="/users/new" element={isAuthenticated ? <CreateUser /> : <Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
