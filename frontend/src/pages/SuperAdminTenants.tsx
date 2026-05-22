import { useEffect, useState } from 'react'
import { fetchTenants, createTenant, deleteTenant, type TenantRecord } from '../api/superadminApi'

function SuperAdminTenants() {
  const [tenants, setTenants] = useState<TenantRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function loadTenants() {
    setLoadError(null)
    try {
      setTenants(await fetchTenants())
    } catch (err: any) {
      setLoadError(err?.message || 'Failed to load tenants')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTenants() }, [])

  async function handleCreate(e: { preventDefault: () => void }) {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)
    try {
      await createTenant(name)
      setName('')
      await loadTenants()
    } catch (err: any) {
      setFormError(err?.message || 'Failed to create tenant')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this tenant? This will permanently delete all its users and incidents.')) return
    setDeleteError(null)
    setDeletingId(id)
    try {
      await deleteTenant(id)
      await loadTenants()
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete tenant')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-slate-900">Manage Tenants</h1>

      {/* Create form */}
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-lg font-medium mb-4 text-slate-800">Create Tenant</h2>

        {formError && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded">{formError}</div>
        )}

        <form onSubmit={handleCreate} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 block w-full border border-slate-300 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Tenant'}
          </button>
        </form>
      </div>

      {/* Tenant list */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-medium mb-3 text-slate-800">Tenants</h2>

        <div className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded">
          Deleting a tenant permanently removes all of its users and incidents.
        </div>

        {deleteError && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded">{deleteError}</div>
        )}

        {loading && <p className="text-sm text-slate-600">Loading...</p>}

        {loadError && (
          <div className="text-sm text-red-700 bg-red-100 p-3 rounded">{loadError}</div>
        )}

        {!loading && !loadError && tenants.length === 0 && (
          <p className="text-sm text-slate-600">No tenants found.</p>
        )}

        {!loading && !loadError && tenants.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="pb-2 pr-4 font-medium">ID</th>
                  <th className="pb-2 pr-4 font-medium">Name</th>
                  <th className="pb-2 pr-4 font-medium">Created</th>
                  <th className="pb-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(tenant => (
                  <tr key={tenant.id} className="border-b border-slate-200 last:border-0">
                    <td className="py-2 pr-4 text-slate-600">{tenant.id}</td>
                    <td className="py-2 pr-4 text-slate-900">{tenant.name}</td>
                    <td className="py-2 pr-4 text-slate-700">{new Date(tenant.created_at).toLocaleDateString()}</td>
                    <td className="py-2">
                      <button
                        onClick={() => handleDelete(tenant.id)}
                        disabled={deletingId === tenant.id}
                        className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                      >
                        {deletingId === tenant.id ? 'Deleting...' : 'Delete'}
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

export default SuperAdminTenants
