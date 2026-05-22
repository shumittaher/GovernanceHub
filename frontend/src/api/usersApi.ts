import { authenticatedFetch } from './httpClient'
import { API_BASE_URL } from '../config'

export interface User {
  id: number
  tenant_id: number
  name: string
  email: string
}

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const res = await authenticatedFetch(`${API_BASE_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message = data?.message || data?.error || 'Failed to create user'
    throw new Error(message)
  }

  // backend returns { user }
  return data.user as User
}
