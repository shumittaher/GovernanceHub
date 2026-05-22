import { authenticatedFetch } from './httpClient'

export interface Incident {
  id: number
  title: string
  description?: string
  severity: string
  status: string
  assigned_to?: string | null
  created_at: string
  updated_at: string
}

export async function fetchIncidents(): Promise<Incident[]> {
  const res = await authenticatedFetch('http://localhost:5000/api/incidents', {
    method: 'GET',
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    const message = data?.message || data?.error || 'Failed to load incidents'
    throw new Error(message)
  }

  const data = await res.json()
  return data.incidents as Incident[]
}

export async function fetchIncidentById(id: number): Promise<Incident> {
  const res = await authenticatedFetch(`http://localhost:5000/api/incidents/${id}`, {
    method: 'GET',
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const message = data?.message || data?.error || 'Failed to load incident'
    throw new Error(message)
  }

  return data.incident as Incident
}

export interface NewIncident {
  title: string
  description?: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  assigned_to?: string
}

export interface IncidentUpdate {
  title?: string
  description?: string
  severity?: string
  status?: string
  assigned_to?: string | null
}

export async function updateIncident(id: number, updates: IncidentUpdate): Promise<Incident> {
  const res = await authenticatedFetch(`http://localhost:5000/api/incidents/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message = data?.message || data?.error || 'Failed to update incident'
    throw new Error(message)
  }

  return data.incident as Incident
}

export async function deleteIncident(id: number): Promise<void> {
  const res = await authenticatedFetch(`http://localhost:5000/api/incidents/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    const message = data?.message || data?.error || 'Failed to delete incident'
    throw new Error(message)
  }
}

export async function createIncident(payload: NewIncident): Promise<Incident> {
  const res = await authenticatedFetch('http://localhost:5000/api/incidents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
