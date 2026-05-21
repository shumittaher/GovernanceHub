import { useEffect, useState } from 'react'
import { fetchIncidents, type Incident } from '../api/incidentsApi'

function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-semibold">Incidents</h1>

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
