import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { getReportService, Report, ReportType } from './reportsService'
import { RootState } from '../../store'

interface ReportsState {
  report: Report | null
  loading: boolean
  error: string | null
}

const initialState: ReportsState = {
  report: null,
  loading: false,
  error: null,
}

export const fetchReport = createAsyncThunk<Report, { type: ReportType; date: string }, { state: RootState; rejectValue: string }>(
  'reports/fetch',
  async ({ type, date }, { getState, rejectWithValue }) => {
    try {
      return await getReportService(type, date, getState().auth.token!)
    } catch (e) {
      return rejectWithValue((e as Error).message)
    }
  }
)

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReport(state) { state.report = null; state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchReport.fulfilled, (state, action: PayloadAction<Report>) => { state.loading = false; state.report = action.payload })
      .addCase(fetchReport.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? null })
  },
})

export const { clearReport } = reportsSlice.actions
export default reportsSlice.reducer
