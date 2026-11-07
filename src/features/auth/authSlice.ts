import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { loginService, registerService, AuthUser, LoginResponse, RegisterResponse } from './authService'

interface AuthState {
  user: AuthUser | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
}

export const login = createAsyncThunk<LoginResponse, { email: string; password: string }, { rejectValue: string }>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await loginService(email, password)
    } catch (e) {
      return rejectWithValue((e as Error).message)
    }
  }
)

export const register = createAsyncThunk<RegisterResponse, { name: string; email: string; password: string }, { rejectValue: string }>(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      return await registerService(name, email, password)
    } catch (e) {
      return rejectWithValue((e as Error).message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? null })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null })
      .addCase(register.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
        state.loading = false
        state.user = action.payload.user
      })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? null })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
