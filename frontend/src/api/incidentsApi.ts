export interface Incident {
  id: number
  title: string
  severity: string
  status: string
  assigned_to: string
}

export async function fetchIncidents(): Promise<Incident[]> {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Missing auth token')
  }

  const res = await fetch('http://localhost:5000/api/incidents', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    const message = data?.message || data?.error || 'Failed to load incidents'
    throw new Error(message)
  }

  const data = await res.json()
  return data.incidents as Incident[]
}

export interface NewIncident {
  title: string
  description?: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  assigned_to?: string
}

export async function createIncident(payload: NewIncident): Promise<Incident> {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Missing auth token')
  }

  const res = await fetch('http://localhost:5000/api/incidents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message = data?.message || data?.error || 'Failed to create incident'
    throw new Error(message)
  }

  // backend returns { incident }
  return data.incident as Incident
}
