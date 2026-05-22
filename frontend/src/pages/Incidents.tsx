import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
  const [showForm, setShowForm] = useState(false)
  const [filterSeverity, setFilterSeverity] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

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
      setShowForm(false)

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

  const total = incidents.length
  const open = incidents.filter(i => i.status === 'Open').length
  const critical = incidents.filter(i => i.severity === 'Critical').length
  const resolved = incidents.filter(i => i.status === 'Resolved').length

  const filteredIncidents = incidents
    .filter(i => filterSeverity === 'All' || i.severity === filterSeverity)
    .filter(i => filterStatus === 'All' || i.status === filterStatus)

  const DATE_FIELDS = new Set(['created_at', 'updated_at'])

  const sortedIncidents = sortField === null
    ? filteredIncidents
    : filteredIncidents.slice().sort((a, b) => {
        const av = (a[sortField as keyof Incident] ?? '') as string
        const bv = (b[sortField as keyof Incident] ?? '') as string
        if (DATE_FIELDS.has(sortField)) {
          return sortDir === 'asc'
            ? new Date(av).getTime() - new Date(bv).getTime()
            : new Date(bv).getTime() - new Date(av).getTime()
        }
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      })

  function handleSort(field: string) {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  function sortIndicator(field: string) {
    if (sortField !== field) return ''
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-semibold">Incidents</h1>

        {!loading && !error && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded border p-4 bg-slate-50">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-semibold mt-1">{total}</p>
            </div>
            <div className="rounded border p-4 bg-blue-50">
              <p className="text-sm text-gray-500">Open</p>
              <p className="text-2xl font-semibold mt-1 text-blue-700">{open}</p>
            </div>
            <div className="rounded border p-4 bg-red-50">
              <p className="text-sm text-gray-500">Critical</p>
              <p className="text-2xl font-semibold mt-1 text-red-700">{critical}</p>
            </div>
            <div className="rounded border p-4 bg-green-50">
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-2xl font-semibold mt-1 text-green-700">{resolved}</p>
            </div>
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={() => setShowForm(v => !v)}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
          >
            {showForm ? 'Hide Form' : 'New Incident'}
          </button>
        </div>

        {showForm && <form onSubmit={handleCreate} className="mt-4 space-y-3">
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
        </form>}

        {loading && <p className="mt-4 text-sm text-gray-600">Loading incidents...</p>}

        {error && (
          <div className="mt-4 text-sm text-red-700 bg-red-100 p-3 rounded">{error}</div>
        )}

        {!loading && !error && incidents.length === 0 && (
          <p className="mt-4 text-sm text-gray-600">No incidents found.</p>
        )}

        {!loading && !error && incidents.length > 0 && (
          <div className="mt-6">
            <div className="flex flex-wrap gap-3 mb-4">
              <select
                value={filterSeverity}
                onChange={e => setFilterSeverity(e.target.value)}
                className="px-3 py-2 border rounded text-sm"
              >
                {['All', 'Low', 'Medium', 'High', 'Critical'].map(v => (
                  <option key={v}>{v}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded text-sm"
              >
                {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(v => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>

            {sortedIncidents.length === 0 ? (
              <p className="text-sm text-gray-600">No incidents match the current filters.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                  <thead>
                    <tr>
                      {(['title', 'severity', 'status', 'assigned_to', 'created_at', 'updated_at'] as const).map((field, i) => (
                        <th
                          key={field}
                          onClick={() => handleSort(field)}
                          className="border-b px-4 py-2 cursor-pointer select-none hover:bg-slate-50"
                        >
                          {(['Title', 'Severity', 'Status', 'Assigned To', 'Created At', 'Updated At'] as const)[i]}{sortIndicator(field)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedIncidents.map((incident) => (
                      <tr key={incident.id} className="odd:bg-slate-50">
                        <td className="border-b px-4 py-3">
                          <Link to={`/incidents/${incident.id}`} className="text-indigo-600 hover:text-indigo-700">
                            {incident.title}
                          </Link>
                        </td>
                        <td className="border-b px-4 py-3">{incident.severity}</td>
                        <td className="border-b px-4 py-3">{incident.status}</td>
                        <td className="border-b px-4 py-3">{incident.assigned_to}</td>
                        <td className="border-b px-4 py-3" title={new Date(incident.created_at).toLocaleString()}>{new Date(incident.created_at).toLocaleDateString()}</td>
                        <td className="border-b px-4 py-3" title={new Date(incident.updated_at).toLocaleString()}>{new Date(incident.updated_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Incidents
