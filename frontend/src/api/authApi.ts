export interface User {
  id: number
  tenant_id: number
  name: string
  email: string
  role: string
}

export async function login(email: string, password: string): Promise<User> {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  let data: any = null
  try {
    data = await res.json()
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    const message = data?.message || data?.error || 'Invalid credentials'
    throw new Error(message)
  }

  const { token, user } = data || {}
  if (token) {
    localStorage.setItem('token', token)
  }
  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  return user
}
