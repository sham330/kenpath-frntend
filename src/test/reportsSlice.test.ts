import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import reportsReducer, { fetchReport, clearReport } from '../features/reports/reportsSlice'
import * as reportsService from '../features/reports/reportsService'

const makeStore = () => configureStore({
  reducer: { auth: authReducer, reports: reportsReducer },
  preloadedState: { auth: { user: null, token: 'test-token', loading: false, error: null } } as any,
})

beforeEach(() => vi.restoreAllMocks())

describe('fetchReport', () => {
  it('sets report on fulfilled', async () => {
    const mockReport = {
      type: 'daily' as const,
      label: '2025-01-15',
      empty: false,
      highest: 180,
      lowest: 95,
      average: 137.5,
      count: 2,
      chartData: [{ date: '2025-01-15', MORNING: 95, AFTER_LUNCH: 180 }],
      readings: [{ id: '1', timeSlot: 'MORNING', slotLabel: 'Morning (fasting)', value: 95 }],
    }
    vi.spyOn(reportsService, 'getReportService').mockResolvedValue(mockReport)
    const store = makeStore()
    await store.dispatch(fetchReport({ type: 'daily', date: '2025-01-15' }))
    const { report, loading, error } = store.getState().reports
    expect(report?.label).toBe('2025-01-15')
    expect(report?.count).toBe(2)
    expect(loading).toBe(false)
    expect(error).toBeNull()
  })

  it('handles empty report', async () => {
    vi.spyOn(reportsService, 'getReportService').mockResolvedValue({
      type: 'monthly' as const,
      label: '2025-01-01 to 2025-01-31',
      empty: true,
      message: 'No readings found for this period.',
    })
    const store = makeStore()
    await store.dispatch(fetchReport({ type: 'monthly', date: '2025-01-01' }))
    expect(store.getState().reports.report?.empty).toBe(true)
  })

  it('sets error on rejected', async () => {
    vi.spyOn(reportsService, 'getReportService').mockRejectedValue(new Error('Unauthorized'))
    const store = makeStore()
    await store.dispatch(fetchReport({ type: 'daily', date: '2025-01-15' }))
    expect(store.getState().reports.error).toBe('Unauthorized')
  })
})

describe('clearReport', () => {
  it('resets report and error', async () => {
    vi.spyOn(reportsService, 'getReportService').mockResolvedValue({
      type: 'daily' as const, label: '2025-01-15', empty: true, message: 'No data',
    })
    const store = makeStore()
    await store.dispatch(fetchReport({ type: 'daily', date: '2025-01-15' }))
    store.dispatch(clearReport())
    expect(store.getState().reports.report).toBeNull()
    expect(store.getState().reports.error).toBeNull()
  })
})
