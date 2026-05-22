import { useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Incidents from './pages/Incidents'
import IncidentDetail from './pages/IncidentDetail'
import CreateUser from './pages/CreateUser'
import SuperAdminAdmins from './pages/SuperAdminAdmins'
import SuperAdminTenants from './pages/SuperAdminTenants'

function App() {
  const { user: initialUser, isAuthenticated } = useAuth()
  const [user, setUser] = useState(initialUser)
  const role = user?.role ?? null

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/login'
  }
  const homeRoute = role === 'superadmin' ? '/superadmin/admins' : '/incidents'

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-4">
          {user && (
            <div className="mb-4 rounded bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
                  {role === 'superadmin' && (
                    <Link to="/superadmin/admins" className="text-indigo-600 hover:text-indigo-700">
                      Admins
                    </Link>
                  )}
                  {role === 'superadmin' && (
                    <Link to="/superadmin/tenants" className="text-indigo-600 hover:text-indigo-700">
                      Tenants
                    </Link>
                  )}
                  {role !== 'superadmin' && (
                    <Link to="/incidents" className="text-indigo-600 hover:text-indigo-700">
                      Incidents
                    </Link>
                  )}
                  {role === 'admin' && (
                    <Link to="/users/new" className="text-indigo-600 hover:text-indigo-700">
                      Create User
                    </Link>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
                  <span>Signed in as <strong>{user.name || user.email}</strong>{user.role ? ` (${user.role})` : ''}</span>
                  <button onClick={handleLogout} className="text-indigo-600 hover:underline">
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}

          <Routes>
            <Route path="/" element={<Navigate to={isAuthenticated ? homeRoute : '/login'} replace />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to={homeRoute} replace /> : <Login onLogin={setUser} />} />
            <Route path="/incidents" element={
              !isAuthenticated ? <Navigate to="/login" replace />
              : role === 'superadmin' ? <Navigate to="/superadmin/admins" replace />
              : <Incidents />
            } />
            <Route path="/incidents/:id" element={
              !isAuthenticated ? <Navigate to="/login" replace />
              : role === 'superadmin' ? <Navigate to="/superadmin/admins" replace />
              : <IncidentDetail />
            } />
            <Route path="/users/new" element={
              !isAuthenticated ? <Navigate to="/login" replace />
              : role !== 'admin' ? <Navigate to={homeRoute} replace />
              : <CreateUser />
            } />
            <Route path="/superadmin/admins" element={
              !isAuthenticated ? <Navigate to="/login" replace />
              : role !== 'superadmin' ? <Navigate to="/incidents" replace />
              : <SuperAdminAdmins />
            } />
            <Route path="/superadmin/tenants" element={
              !isAuthenticated ? <Navigate to="/login" replace />
              : role !== 'superadmin' ? <Navigate to="/incidents" replace />
              : <SuperAdminTenants />
            } />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
