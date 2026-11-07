import { configureStore } from '@reduxjs/toolkit'
import authReducer, { login, register, logout, clearError } from '../features/auth/authSlice'
import * as authService from '../features/auth/authService'

const makeStore = () => configureStore({ reducer: { auth: authReducer } })

beforeEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('authSlice reducers', () => {
  it('logout clears user and token', () => {
    const store = makeStore()
    store.dispatch(logout())
    const { user, token } = store.getState().auth
    expect(user).toBeNull()
    expect(token).toBeNull()
  })

  it('clearError sets error to null', () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: { auth: { user: null, token: null, loading: false, error: 'some error' } },
    })
    store.dispatch(clearError())
    expect(store.getState().auth.error).toBeNull()
  })
})

describe('login thunk', () => {
  it('sets token and user on fulfilled', async () => {
    vi.spyOn(authService, 'loginService').mockResolvedValue({
      token: 'tok123',
      user: { name: 'John', email: 'john@test.com' },
    })
    const store = makeStore()
    await store.dispatch(login({ email: 'john@test.com', password: 'pass' }))
    const { token, user, loading, error } = store.getState().auth
    expect(token).toBe('tok123')
    expect(user?.name).toBe('John')
    expect(loading).toBe(false)
    expect(error).toBeNull()
  })

  it('sets error on rejected', async () => {
    vi.spyOn(authService, 'loginService').mockRejectedValue(new Error('Invalid credentials'))
    const store = makeStore()
    await store.dispatch(login({ email: 'bad@test.com', password: 'wrong' }))
    const { error, token } = store.getState().auth
    expect(error).toBe('Invalid credentials')
    expect(token).toBeNull()
  })
})

describe('register thunk', () => {
  it('sets user on fulfilled', async () => {
    vi.spyOn(authService, 'registerService').mockResolvedValue({
      user: { name: 'Jane', email: 'jane@test.com' },
    })
    const store = makeStore()
    await store.dispatch(register({ name: 'Jane', email: 'jane@test.com', password: 'pass' }))
    const { user, error } = store.getState().auth
    expect(user?.name).toBe('Jane')
    expect(error).toBeNull()
  })

  it('sets error on rejected', async () => {
    vi.spyOn(authService, 'registerService').mockRejectedValue(new Error('Email already exists'))
    const store = makeStore()
    await store.dispatch(register({ name: 'Jane', email: 'jane@test.com', password: 'pass' }))
    expect(store.getState().auth.error).toBe('Email already exists')
  })
})
