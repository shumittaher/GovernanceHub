import { authenticatedFetch } from './httpClient'

export interface AdminRecord {
  id: number
  tenant_id: number
  tenant_name: string
  name: string
  email: string
  role: string
  created_at: string
}

export interface NewAdmin {
  name: string
  email: string
  password: string
  tenant_id: number
}

export async function fetchAdmins(): Promise<AdminRecord[]> {
  const res = await authenticatedFetch('http://localhost:5000/api/superadmin/admins', {
    method: 'GET',
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const message = data?.message || data?.error || 'Failed to load admins'
    throw new Error(message)
  }

  return data.admins as AdminRecord[]
}

export async function createAdmin(payload: NewAdmin): Promise<AdminRecord> {
  const res = await authenticatedFetch('http://localhost:5000/api/superadmin/admins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const message = data?.message || data?.error || 'Failed to create admin'
    throw new Error(message)
  }

  return data.admin as AdminRecord
}

export interface TenantRecord {
  id: number
  name: string
  created_at: string
}

export async function fetchTenants(): Promise<TenantRecord[]> {
  const res = await authenticatedFetch('http://localhost:5000/api/superadmin/tenants', {
    method: 'GET',
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const message = data?.message || data?.error || 'Failed to load tenants'
    throw new Error(message)
  }

  return data.tenants as TenantRecord[]
}

export async function createTenant(name: string): Promise<TenantRecord> {
  const res = await authenticatedFetch('http://localhost:5000/api/superadmin/tenants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const message = data?.message || data?.error || 'Failed to create tenant'
    throw new Error(message)
  }

  return data.tenant as TenantRecord
}

export async function deleteTenant(id: number): Promise<void> {
  const res = await authenticatedFetch(`http://localhost:5000/api/superadmin/tenants/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    const message = data?.message || data?.error || 'Failed to delete tenant'
    throw new Error(message)
  }
}

export async function deleteAdmin(id: number): Promise<void> {
  const res = await authenticatedFetch(`http://localhost:5000/api/superadmin/admins/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    const message = data?.message || data?.error || 'Failed to delete admin'
    throw new Error(message)
  }
}
