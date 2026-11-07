import { loginService, registerService } from '../features/auth/authService'

const mockFetch = (body: object, ok = true) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(body),
  }))
}

beforeEach(() => vi.unstubAllGlobals())

describe('loginService', () => {
  it('returns token and user on success', async () => {
    const payload = { token: 'abc', user: { name: 'John', email: 'john@test.com' } }
    mockFetch(payload)
    const result = await loginService('john@test.com', 'password')
    expect(result).toEqual(payload)
  })

  it('throws with error message on failure', async () => {
    mockFetch({ error: 'Invalid credentials' }, false)
    await expect(loginService('bad@test.com', 'wrong')).rejects.toThrow('Invalid credentials')
  })

  it('calls correct endpoint with POST', async () => {
    mockFetch({ token: 'abc', user: {} })
    await loginService('john@test.com', 'password')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/login'),
      expect.objectContaining({ method: 'POST' })
    )
  })
})

describe('registerService', () => {
  it('returns user on success', async () => {
    const payload = { user: { name: 'Jane', email: 'jane@test.com' } }
    mockFetch(payload)
    const result = await registerService('Jane', 'jane@test.com', 'password')
    expect(result).toEqual(payload)
  })

  it('throws with error message on failure', async () => {
    mockFetch({ error: 'Email already exists' }, false)
    await expect(registerService('Jane', 'jane@test.com', 'password')).rejects.toThrow('Email already exists')
  })
})
