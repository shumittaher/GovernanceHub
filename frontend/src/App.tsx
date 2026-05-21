import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import type { User } from './api'
import Login from './pages/Login'
import Incidents from './pages/Incidents'

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
            <div className="mb-4 flex items-center justify-between text-sm text-gray-700">
              <div>
                Signed in as <strong>{(user as any).name || (user as any).email}</strong>
              </div>
              <button onClick={handleLogout} className="text-indigo-600 hover:underline">
                Sign out
              </button>
            </div>
          )}

          <Routes>
            <Route path="/" element={<Navigate to={isAuthenticated ? '/incidents' : '/login'} replace />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/incidents" replace /> : <Login onLogin={setUser} />} />
            <Route path="/incidents" element={isAuthenticated ? <Incidents /> : <Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
