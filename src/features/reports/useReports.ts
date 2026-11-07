import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { fetchReport, clearReport } from './reportsSlice'
import { ReportType } from './reportsService'

export const useReports = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { report, loading, error } = useSelector((s: RootState) => s.reports)

  return {
    report,
    loading,
    error,
    fetchReport: (type: ReportType, date: string) => dispatch(fetchReport({ type, date })),
    clearReport: () => dispatch(clearReport()),
  }
}
