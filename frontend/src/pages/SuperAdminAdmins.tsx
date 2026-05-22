import { useEffect, useState } from 'react'
import { fetchAdmins, createAdmin, deleteAdmin, type AdminRecord } from '../api/superadminApi'

const EMPTY_FORM = { name: '', email: '', password: '', tenant_id: '' }

function SuperAdminAdmins() {
  const [admins, setAdmins] = useState<AdminRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function loadAdmins() {
    setLoadError(null)
    try {
      setAdmins(await fetchAdmins())
    } catch (err: any) {
      setLoadError(err?.message || 'Failed to load admins')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAdmins() }, [])

  async function handleCreate(e: { preventDefault: () => void }) {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)
    try {
      await createAdmin({
        name: form.name,
        email: form.email,
        password: form.password,
        tenant_id: Number(form.tenant_id),
      })
      setForm(EMPTY_FORM)
      await loadAdmins()
    } catch (err: any) {
      setFormError(err?.message || 'Failed to create admin')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this admin?')) return
    setDeleteError(null)
    setDeletingId(id)
    try {
      await deleteAdmin(id)
      await loadAdmins()
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete admin')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Manage Admins</h1>

      {/* Create form */}
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Create Admin</h2>

        {formError && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded">{formError}</div>
        )}

        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tenant ID</label>
            <input
              type="number"
              required
              min={1}
              value={form.tenant_id}
              onChange={e => setForm(f => ({ ...f, tenant_id: e.target.value }))}
              className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        </form>
      </div>

      {/* Admin list */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-medium mb-4">Admins</h2>

        {deleteError && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded">{deleteError}</div>
        )}

        {loading && <p className="text-sm text-gray-600">Loading...</p>}

        {loadError && (
          <div className="text-sm text-red-700 bg-red-100 p-3 rounded">{loadError}</div>
        )}

        {!loading && !loadError && admins.length === 0 && (
          <p className="text-sm text-gray-600">No admins found.</p>
        )}

        {!loading && !loadError && admins.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="pb-2 pr-4 font-medium">Name</th>
                  <th className="pb-2 pr-4 font-medium">Email</th>
                  <th className="pb-2 pr-4 font-medium">Tenant</th>
                  <th className="pb-2 pr-4 font-medium">Created</th>
                  <th className="pb-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {admins.map(admin => (
                  <tr key={admin.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{admin.name}</td>
                    <td className="py-2 pr-4">{admin.email}</td>
                    <td className="py-2 pr-4">{admin.tenant_name}</td>
                    <td className="py-2 pr-4">{new Date(admin.created_at).toLocaleDateString()}</td>
                    <td className="py-2">
                      <button
                        onClick={() => handleDelete(admin.id)}
                        disabled={deletingId === admin.id}
                        className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                      >
                        {deletingId === admin.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default SuperAdminAdmins
