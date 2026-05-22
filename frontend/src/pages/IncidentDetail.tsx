import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteIncident, fetchIncidentById, updateIncident, type Incident } from '../api/incidentsApi'
import { useAuth } from '../hooks/useAuth'

const SEVERITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical']
const STATUS_OPTIONS = ['Open', 'In Progress', 'Resolved', 'Closed']

function IncidentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()
  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', severity: '', status: '', assigned_to: '' })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    const loadIncident = async () => {
      if (!id) {
        setError('Invalid incident id')
        setLoading(false)
        return
      }

      const incidentId = Number(id)
      if (!Number.isInteger(incidentId) || incidentId <= 0) {
        setError('Invalid incident id')
        setLoading(false)
        return
      }

      try {
        const data = await fetchIncidentById(incidentId)
        setIncident(data)
      } catch (err: any) {
        setError(err?.message || 'Unable to load incident')
      } finally {
        setLoading(false)
      }
    }

    loadIncident()
  }, [id])

  async function handleDelete() {
    if (!incident) return
    if (!window.confirm('Delete this incident?')) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteIncident(incident.id)
      navigate('/incidents')
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete incident')
      setDeleting(false)
    }
  }

  function openEdit() {
    if (!incident) return
    setForm({
      title: incident.title,
      description: incident.description ?? '',
      severity: incident.severity,
      status: incident.status,
      assigned_to: incident.assigned_to ?? '',
    })
    setSaveError(null)
    setSaveSuccess(false)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setSaveError(null)
  }

  async function handleSave(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (!incident) return
    setSaving(true)
    setSaveError(null)
    try {
      const updated = await updateIncident(incident.id, {
        title: form.title,
        description: form.description || undefined,
        severity: form.severity,
        status: form.status,
        assigned_to: form.assigned_to === '' ? undefined : form.assigned_to,
      })
      setIncident(updated)
      setEditing(false)
      setSaveSuccess(true)
    } catch (err: any) {
      setSaveError(err?.message || 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex justify-center bg-gray-50">
      <div className="w-full h-full max-w-4xl p-8 bg-white rounded shadow">
        <Link to="/incidents" className="text-indigo-600 hover:text-indigo-700 text-sm">
          &larr; Back to incidents
        </Link>

        <h1 className="text-2xl font-semibold mt-4">Incident Detail</h1>

        {loading && <p className="mt-4 text-sm text-gray-600">Loading incident...</p>}

        {error && (
          <div className="mt-4 text-sm text-red-700 bg-red-100 p-3 rounded">{error}</div>
        )}

        {!loading && !error && incident && !editing && (
          <div className="mt-6 space-y-6">
            {saveSuccess && (
              <div className="text-sm text-green-700 bg-green-100 p-3 rounded">Incident updated successfully.</div>
            )}

            {deleteError && (
              <div className="text-sm text-red-700 bg-red-100 p-3 rounded">{deleteError}</div>
            )}           

            <div className="flex items-start justify-end">
              <div className="ml-4 shrink-0 flex gap-2 rounded">
                <button
                  onClick={openEdit}
                  className="text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-300 rounded px-3 py-1"
                >
                  Edit
                </button>
                {role === 'admin' && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-sm text-red-600 hover:text-red-700 border border-red-300 rounded px-3 py-1 disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold">{incident.title}</h2>
              <p className="text-start mt-2 py-4 text-gray-600">
                {incident.description || 'No description provided.'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded border p-4 bg-slate-50">
                <p className="text-sm text-gray-600">Severity</p>
                <p className="mt-1 font-medium">{incident.severity}</p>
              </div>
              <div className="rounded border p-4 bg-slate-50">
                <p className="text-sm text-gray-600">Status</p>
                <p className="mt-1 font-medium">{incident.status}</p>
              </div>
              <div className="sm:col-span-2 rounded border p-4 bg-slate-50">
                <p className="text-sm text-gray-600">Assigned To</p>
                <p className="mt-1 font-medium">{incident.assigned_to || 'Unassigned'}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && incident && editing && (
          <form onSubmit={handleSave} className="mt-6 space-y-4">
            {saveError && (
              <div className="text-sm text-red-700 bg-red-100 p-3 rounded">{saveError}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={5}
                className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Severity</label>
                <select
                  value={form.severity}
                  onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}
                  className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {SEVERITY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Assigned To</label>
              <input
                type="text"
                value={form.assigned_to}
                onChange={e => setForm(f => ({ ...f, assigned_to: e.target.value }))}
                className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default IncidentDetail
