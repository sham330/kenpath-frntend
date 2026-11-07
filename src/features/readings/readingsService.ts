const BASE_URL = `${import.meta.env.VITE_API_URL}/api/readings`

export type TimeSlot = 'MORNING' | 'AFTER_BREAKFAST' | 'AFTER_LUNCH' | 'AFTER_DINNER'

export interface Reading {
  id: string
  userId: string
  readingDate: string
  timeSlot: TimeSlot
  value: number
  createdAt: string
}

export interface ReadingsMeta {
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ReadingsResponse {
  data: Reading[]
  meta: ReadingsMeta
}

export interface CreateReadingPayload {
  readingDate: string
  timeSlot: TimeSlot
  value: number
}

export interface UpdateReadingPayload {
  readingDate?: string
  timeSlot?: TimeSlot
  value?: number
}

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const createReadingService = async (payload: CreateReadingPayload, token: string): Promise<Reading> => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || data.message)
  return data
}

export const getReadingsService = async (token: string, page = 1): Promise<ReadingsResponse> => {
  const res = await fetch(`${BASE_URL}?page=${page}`, {
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || data.message)
  return data
}

export const updateReadingService = async (id: string, payload: UpdateReadingPayload, token: string): Promise<Reading> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || data.message)
  return data
}

export const deleteReadingService = async (id: string, token: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || data.message)
  }
}
