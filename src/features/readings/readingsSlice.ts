import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {
  createReadingService, getReadingsService, updateReadingService, deleteReadingService,
  Reading, ReadingsMeta, ReadingsResponse, CreateReadingPayload, UpdateReadingPayload,
} from './readingsService'
import { RootState } from '../../store'

interface ReadingsState {
  items: Reading[]
  meta: ReadingsMeta | null
  loading: boolean
  createLoading: boolean
  actionLoadingId: string | null
  error: string | null
}

const initialState: ReadingsState = {
  items: [],
  meta: null,
  loading: false,
  createLoading: false,
  actionLoadingId: null,
  error: null,
}

export const fetchReadings = createAsyncThunk<ReadingsResponse, number | undefined, { state: RootState; rejectValue: string }>(
  'readings/fetchAll',
  async (page = 1, { getState, rejectWithValue }) => {
    try {
      return await getReadingsService(getState().auth.token!, page)
    } catch (e) {
      return rejectWithValue((e as Error).message)
    }
  }
)

export const createReading = createAsyncThunk<Reading, CreateReadingPayload, { state: RootState; rejectValue: string }>(
  'readings/create',
  async (payload, { getState, rejectWithValue, dispatch }) => {
    try {
      const reading = await createReadingService(payload, getState().auth.token!)
      dispatch(fetchReadings(1))
      return reading
    } catch (e) {
      return rejectWithValue((e as Error).message)
    }
  }
)

export const updateReading = createAsyncThunk<Reading, { id: string; payload: UpdateReadingPayload }, { state: RootState; rejectValue: string }>(
  'readings/update',
  async ({ id, payload }, { getState, rejectWithValue, dispatch }) => {
    try {
      const reading = await updateReadingService(id, payload, getState().auth.token!)
      dispatch(fetchReadings(getState().readings.meta?.page ?? 1))
      return reading
    } catch (e) {
      return rejectWithValue((e as Error).message)
    }
  }
)

export const deleteReading = createAsyncThunk<string, string, { state: RootState; rejectValue: string }>(
  'readings/delete',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      await deleteReadingService(id, getState().auth.token!)
      dispatch(fetchReadings(getState().readings.meta?.page ?? 1))
      return id
    } catch (e) {
      return rejectWithValue((e as Error).message)
    }
  }
)

const readingsSlice = createSlice({
  name: 'readings',
  initialState,
  reducers: {
    clearReadingsError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReadings.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchReadings.fulfilled, (state, action: PayloadAction<ReadingsResponse>) => {
        state.loading = false
        state.items = action.payload.data
        state.meta = action.payload.meta
      })
      .addCase(fetchReadings.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? null })

      .addCase(createReading.pending, (state) => { state.createLoading = true; state.error = null })
      .addCase(createReading.fulfilled, (state) => { state.createLoading = false })
      .addCase(createReading.rejected, (state, action) => { state.createLoading = false; state.error = action.payload ?? null })

      .addCase(updateReading.pending, (state, action) => { state.actionLoadingId = action.meta.arg.id; state.error = null })
      .addCase(updateReading.fulfilled, (state) => { state.actionLoadingId = null })
      .addCase(updateReading.rejected, (state, action) => { state.actionLoadingId = null; state.error = action.payload ?? null })

      .addCase(deleteReading.pending, (state, action) => { state.actionLoadingId = action.meta.arg; state.error = null })
      .addCase(deleteReading.fulfilled, (state) => { state.actionLoadingId = null })
      .addCase(deleteReading.rejected, (state, action) => { state.actionLoadingId = null; state.error = action.payload ?? null })
  },
})

export const { clearReadingsError } = readingsSlice.actions
export default readingsSlice.reducer
