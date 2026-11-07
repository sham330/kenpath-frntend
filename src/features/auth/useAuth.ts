import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { login, register, logout, clearError } from './authSlice'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, token, loading, error } = useSelector((s: RootState) => s.auth)

  return {
    user,
    token,
    loading,
    error,
    login: (email: string, password: string) => dispatch(login({ email, password })),
    register: (name: string, email: string, password: string) => dispatch(register({ name, email, password })),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
  }
}
