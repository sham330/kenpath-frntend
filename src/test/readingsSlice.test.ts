import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import readingsReducer, { fetchReadings, createReading, updateReading, deleteReading } from '../features/readings/readingsSlice'
import * as readingsService from '../features/readings/readingsService'

const mockReading = {
  id: '1',
  userId: 'u1',
  readingDate: '2025-01-15T00:00:00.000Z',
  timeSlot: 'MORNING' as const,
  value: 95,
  createdAt: '2025-01-15T10:00:00.000Z',
}

const mockMeta = { total: 1, page: 1, pageSize: 10, totalPages: 1, hasNext: false, hasPrev: false }

const makeStore = () => configureStore({
  reducer: { auth: authReducer, readings: readingsReducer },
  preloadedState: { auth: { user: null, token: 'test-token', loading: false, error: null } } as any,
})

beforeEach(() => vi.restoreAllMocks())

describe('fetchReadings', () => {
  it('sets items and meta on fulfilled', async () => {
    vi.spyOn(readingsService, 'getReadingsService').mockResolvedValue({ data: [mockReading], meta: mockMeta })
    const store = makeStore()
    await store.dispatch(fetchReadings(1))
    const { items, meta, loading } = store.getState().readings
    expect(items).toHaveLength(1)
    expect(items[0].value).toBe(95)
    expect(meta?.total).toBe(1)
    expect(loading).toBe(false)
  })

  it('sets error on rejected', async () => {
    vi.spyOn(readingsService, 'getReadingsService').mockRejectedValue(new Error('Unauthorized'))
    const store = makeStore()
    await store.dispatch(fetchReadings(1))
    expect(store.getState().readings.error).toBe('Unauthorized')
  })
})

describe('createReading', () => {
  it('sets createLoading false on fulfilled', async () => {
    vi.spyOn(readingsService, 'createReadingService').mockResolvedValue(mockReading)
    vi.spyOn(readingsService, 'getReadingsService').mockResolvedValue({ data: [mockReading], meta: mockMeta })
    const store = makeStore()
    await store.dispatch(createReading({ readingDate: '2025-01-15', timeSlot: 'MORNING', value: 95 }))
    expect(store.getState().readings.createLoading).toBe(false)
  })

  it('sets error on rejected', async () => {
    vi.spyOn(readingsService, 'createReadingService').mockRejectedValue(new Error('Value must be between 40 and 600 mg/dl.'))
    const store = makeStore()
    await store.dispatch(createReading({ readingDate: '2025-01-15', timeSlot: 'MORNING', value: 999 }))
    expect(store.getState().readings.error).toBe('Value must be between 40 and 600 mg/dl.')
  })
})

describe('updateReading', () => {
  it('clears actionLoadingId on fulfilled', async () => {
    vi.spyOn(readingsService, 'updateReadingService').mockResolvedValue({ ...mockReading, value: 120 })
    vi.spyOn(readingsService, 'getReadingsService').mockResolvedValue({ data: [mockReading], meta: mockMeta })
    const store = makeStore()
    await store.dispatch(updateReading({ id: '1', payload: { value: 120 } }))
    expect(store.getState().readings.actionLoadingId).toBeNull()
  })
})

describe('deleteReading', () => {
  it('clears actionLoadingId on fulfilled', async () => {
    vi.spyOn(readingsService, 'deleteReadingService').mockResolvedValue(undefined)
    vi.spyOn(readingsService, 'getReadingsService').mockResolvedValue({ data: [], meta: { ...mockMeta, total: 0 } })
    const store = makeStore()
    await store.dispatch(deleteReading('1'))
    expect(store.getState().readings.actionLoadingId).toBeNull()
  })
})
