export async function authenticatedFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Missing auth token')
  }

  // Normalize and merge headers, ensuring Authorization is set.
  const headers = new Headers(init?.headers as HeadersInit)
  headers.set('Authorization', `Bearer ${token}`)

  const mergedInit: RequestInit = {
    ...init,
    headers,
  }

  return fetch(input, mergedInit)
}

export default { authenticatedFetch }
