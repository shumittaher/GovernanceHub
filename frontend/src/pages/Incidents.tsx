import { useEffect, useState } from 'react'
import { fetchIncidents, createIncident, type Incident, type NewIncident } from '../api/incidentsApi'

function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Low')
  const [status, setStatus] = useState<'Open' | 'In Progress' | 'Resolved' | 'Closed'>('Open')
  const [assignedTo, setAssignedTo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  useEffect(() => {
    const loadIncidents = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchIncidents()
        setIncidents(data)
      } catch (err: any) {
        setError(err?.message || 'Unable to fetch incidents')
      } finally {
        setLoading(false)
      }
    }

    loadIncidents()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError(null)
    setSubmitting(true)
    try {
      const payload: NewIncident = {
        title: title.trim(),
        description: description.trim() || undefined,
        severity,
        status,
        assigned_to: assignedTo.trim() || undefined,
      }

      await createIncident(payload)
      // clear form
      setTitle('')
      setDescription('')
      setSeverity('Low')
      setStatus('Open')
      setAssignedTo('')

      // refresh list
      setLoading(true)
      const data = await fetchIncidents()
      setIncidents(data)
    } catch (err: any) {
      setCreateError(err?.message || 'Failed to create incident')
    } finally {
      setSubmitting(false)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-semibold">Incidents</h1>

        <form onSubmit={handleCreate} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="px-3 py-2 border rounded w-full"
            />
            <input
              placeholder="Assigned to"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="px-3 py-2 border rounded w-full"
            />
          </div>

          <div>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <select value={severity} onChange={(e) => setSeverity(e.target.value as any)} className="px-3 py-2 border rounded">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="px-3 py-2 border rounded">
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
            <div />
            <div />
          </div>

          {createError && <div className="text-sm text-red-700">{createError}</div>}

          <div>
            <button type="submit" disabled={submitting} className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create Incident'}
            </button>
          </div>
        </form>

        {loading && <p className="mt-4 text-sm text-gray-600">Loading incidents...</p>}

        {error && (
          <div className="mt-4 text-sm text-red-700 bg-red-100 p-3 rounded">{error}</div>
        )}

        {!loading && !error && incidents.length === 0 && (
          <p className="mt-4 text-sm text-gray-600">No incidents found.</p>
        )}

        {!loading && !error && incidents.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b px-4 py-2">Title</th>
                  <th className="border-b px-4 py-2">Severity</th>
                  <th className="border-b px-4 py-2">Status</th>
                  <th className="border-b px-4 py-2">Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id} className="odd:bg-slate-50">
                    <td className="border-b px-4 py-3">{incident.title}</td>
                    <td className="border-b px-4 py-3">{incident.severity}</td>
                    <td className="border-b px-4 py-3">{incident.status}</td>
                    <td className="border-b px-4 py-3">{incident.assigned_to}</td>
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

export default Incidents
