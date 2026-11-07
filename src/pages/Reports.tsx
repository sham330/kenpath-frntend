import { useEffect, useState } from 'react'
import { useReports } from '../features/reports/useReports'
import { ReportType } from '../features/reports/reportsService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const REPORT_TYPES: { value: ReportType; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'mtd', label: 'Month to Date' },
  { value: 'monthly', label: 'Monthly' },
]

const SLOT_COLORS: Record<string, string> = {
  MORNING: '#6366f1',
  AFTER_BREAKFAST: '#f59e0b',
  AFTER_LUNCH: '#10b981',
  AFTER_DINNER: '#f43f5e',
}

const todayStr = new Date().toISOString().split('T')[0]
const currentMonth = todayStr.slice(0, 7)

function getMtdHint(date: string): string {
  if (!date) return ''
  const d = new Date(date)
  const first = new Date(d.getFullYear(), d.getMonth(), 1)
  return `${first.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

function getMonthlyHint(yearMonth: string): string {
  if (!yearMonth) return ''
  const [y, m] = yearMonth.split('-').map(Number)
  const first = new Date(y, m - 1, 1)
  const last = new Date(y, m, 0)
  return `${first.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${last.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

export default function Reports() {
  const { report, loading, error, fetchReport, clearReport } = useReports()
  const [type, setType] = useState<ReportType>('daily')
  const [date, setDate] = useState(todayStr)
  const [month, setMonth] = useState(currentMonth)

  useEffect(() => {
    fetchReport('daily', todayStr)
    return () => { clearReport() }
  }, [])

  const handleFetch = () => {
    if (type === 'monthly') fetchReport('monthly', `${month}-01`)
    else fetchReport(type, date)
  }

  const slots = report?.chartData
    ? Array.from(new Set(report.chartData.flatMap(d => Object.keys(d).filter(k => k !== 'date'))))
    : []

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 items-end">

            <div className="space-y-1">
              <Label>Report Type</Label>
              <div className="flex rounded-md border overflow-hidden">
                {REPORT_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      type === t.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-foreground hover:bg-muted'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {type !== 'monthly' && (
              <div className="space-y-1">
                <Label>{type === 'daily' ? 'Date' : 'Up to date'}</Label>
                <Input type="date" value={date} max={todayStr} onChange={(e) => setDate(e.target.value)} />
                {type === 'mtd' && date && (
                  <p className="text-xs text-muted-foreground pt-0.5">Range: {getMtdHint(date)}</p>
                )}
              </div>
            )}

            {type === 'monthly' && (
              <div className="space-y-1">
                <Label>Month</Label>
                <Input type="month" value={month} max={currentMonth} onChange={(e) => setMonth(e.target.value)} />
                {month && (
                  <p className="text-xs text-muted-foreground pt-0.5">Range: {getMonthlyHint(month)}</p>
                )}
              </div>
            )}

            <Button onClick={handleFetch} disabled={loading}>
              {loading ? 'Loading...' : 'Generate Report'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />{error}
        </div>
      )}

      {report && (
        <>
          <p className="text-sm text-muted-foreground">Period: <span className="font-medium text-foreground">{report.label}</span></p>

          {report.empty ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {report.message ?? 'No data for this period.'}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-1">
                    <CardTitle className="text-sm text-muted-foreground">Readings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{report.count}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-1">
                    <CardTitle className="text-sm text-muted-foreground">Average</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-2xl font-bold">
                      <Activity className="h-5 w-5 text-primary" />
                      {report.average?.toFixed(1)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-1">
                    <CardTitle className="text-sm text-muted-foreground">Highest</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-2xl font-bold text-red-500">
                      <TrendingUp className="h-5 w-5" />
                      {report.highest}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-1">
                    <CardTitle className="text-sm text-muted-foreground">Lowest</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-2xl font-bold text-emerald-500">
                      <TrendingDown className="h-5 w-5" />
                      {report.lowest}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Glucose Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={report.chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} domain={[0, 'auto']} />
                      <Tooltip />
                      <Legend />
                      {slots.map((slot) => (
                        <Bar key={slot} dataKey={slot} fill={SLOT_COLORS[slot] ?? '#94a3b8'} radius={[4, 4, 0, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {report.readings && report.readings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Readings</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left px-6 py-3 text-muted-foreground font-medium">Time Slot</th>
                          <th className="text-left px-6 py-3 text-muted-foreground font-medium">Value (mg/dL)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.readings.map((r) => (
                          <tr key={r.id} className="border-b last:border-0">
                            <td className="px-6 py-3">{r.slotLabel}</td>
                            <td className="px-6 py-3 font-medium">{r.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
