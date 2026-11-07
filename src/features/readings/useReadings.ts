import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { fetchReadings, createReading, updateReading, deleteReading, clearReadingsError } from './readingsSlice'
import { CreateReadingPayload, UpdateReadingPayload } from './readingsService'

export const useReadings = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, meta, loading, createLoading, actionLoadingId, error } = useSelector((s: RootState) => s.readings)

  return {
    items,
    meta,
    loading,
    createLoading,
    actionLoadingId,
    error,
    fetchReadings: (page?: number) => dispatch(fetchReadings(page)),
    createReading: (payload: CreateReadingPayload) => dispatch(createReading(payload)),
    updateReading: (id: string, payload: UpdateReadingPayload) => dispatch(updateReading({ id, payload })),
    deleteReading: (id: string) => dispatch(deleteReading(id)),
    clearError: () => dispatch(clearReadingsError()),
  }
}
