import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchIncidentById, type Incident } from '../api/incidentsApi'

function IncidentDetail() {
  const { id } = useParams()
  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-3xl p-8 bg-white rounded shadow">
        <Link to="/incidents" className="text-indigo-600 hover:text-indigo-700 text-sm">
          &larr; Back to incidents
        </Link>

        <h1 className="text-2xl font-semibold mt-4">Incident Detail</h1>

        {loading && <p className="mt-4 text-sm text-gray-600">Loading incident...</p>}

        {error && (
          <div className="mt-4 text-sm text-red-700 bg-red-100 p-3 rounded">{error}</div>
        )}

        {!loading && !error && incident && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold">{incident.title}</h2>
              <p className="mt-2 text-gray-600">
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
      </div>
    </div>
  )
}

export default IncidentDetail
