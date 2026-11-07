const BASE_URL = `${import.meta.env.VITE_API_URL}/api/readings/reports`

export type ReportType = 'daily' | 'mtd' | 'monthly'

export interface ReportReading {
  id: string
  timeSlot: string
  slotLabel: string
  value: number
}

export interface ReportChartData {
  date: string
  MORNING?: number
  AFTER_BREAKFAST?: number
  AFTER_LUNCH?: number
  AFTER_DINNER?: number
}

export interface Report {
  type: ReportType
  label: string
  empty: boolean
  message?: string
  highest?: number
  lowest?: number
  average?: number
  count?: number
  chartData?: ReportChartData[]
  readings?: ReportReading[]
}

export const getReportService = async (type: ReportType, date: string, token: string): Promise<Report> => {
  const res = await fetch(`${BASE_URL}?type=${type}&date=${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || data.message)
  return data
}
