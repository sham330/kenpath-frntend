import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RootState } from '../store'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useSelector((s: RootState) => s.auth.token)
  return token ? children : <Navigate to="/login" replace />
}
