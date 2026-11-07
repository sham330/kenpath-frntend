import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const monthly = [
  { month: 'Jan', visits: 4200, sales: 1800 },
  { month: 'Feb', visits: 5800, sales: 2400 },
  { month: 'Mar', visits: 4900, sales: 2100 },
  { month: 'Apr', visits: 7200, sales: 3200 },
  { month: 'May', visits: 6100, sales: 2800 },
  { month: 'Jun', visits: 8400, sales: 4100 },
]

const topPages = [
  { page: '/dashboard', views: 4821, bounce: '24%' },
  { page: '/analytics', views: 3204, bounce: '31%' },
  { page: '/users', views: 2109, bounce: '18%' },
  { page: '/settings', views: 987, bounce: '42%' },
]

const max = Math.max(...monthly.map((d) => d.visits))

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your app's performance over time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Monthly Overview</CardTitle>
            <CardDescription>Visits vs Sales for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-44">
              {monthly.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-1 items-end" style={{ height: '140px' }}>
                    <div
                      className="flex-1 bg-primary rounded-t-sm opacity-80 transition-all hover:opacity-100"
                      style={{ height: `${(d.visits / max) * 100}%` }}
                      title={`Visits: ${d.visits.toLocaleString()}`}
                    />
                    <div
                      className="flex-1 bg-primary/30 rounded-t-sm transition-all hover:bg-primary/50"
                      style={{ height: `${(d.sales / max) * 100}%` }}
                      title={`Sales: ${d.sales.toLocaleString()}`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 pt-4 border-t">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-sm bg-primary opacity-80 inline-block" /> Visits
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-sm bg-primary/30 inline-block" /> Sales
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Pages</CardTitle>
            <CardDescription>Most visited routes</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {topPages.map((p) => (
                <li key={p.page} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground font-mono">{p.page}</p>
                    <p className="text-xs text-muted-foreground">{p.views.toLocaleString()} views</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{p.bounce} bounce</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
