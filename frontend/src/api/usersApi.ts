import { authenticatedFetch } from './httpClient'

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
  const res = await authenticatedFetch('http://localhost:5000/api/users', {
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
