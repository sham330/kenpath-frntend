const BASE_URL = `${import.meta.env.VITE_API_URL}/api/auth`

export interface AuthUser {
  name?: string
  email?: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface RegisterResponse {
  user: AuthUser
}

export const loginService = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export const registerService = async (name: string, email: string, password: string): Promise<RegisterResponse> => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}
