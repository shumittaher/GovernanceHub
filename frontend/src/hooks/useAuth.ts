import type { User } from '../api/authApi'

export function useAuth() {
  const user: User | null = (() => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? (JSON.parse(raw) as User) : null
    } catch { return null }
  })()

  return {
    user,
    role: user?.role ?? null,
    isAuthenticated: Boolean(localStorage.getItem('token')),
  }
}
