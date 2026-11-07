import { useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, MousePointerClick, LucideIcon } from 'lucide-react'
import { RootState } from '../store'

const stats: { label: string; value: string; change: string; up: boolean; icon: LucideIcon }[] = [
  { label: 'Total Users', value: '12,430', change: '+8.2%', up: true, icon: Users },
  { label: 'Revenue', value: '$48,295', change: '+12.5%', up: true, icon: DollarSign },
  { label: 'Active Sessions', value: '1,893', change: '-3.1%', up: false, icon: Activity },
  { label: 'Conversion Rate', value: '3.24%', change: '+0.4%', up: true, icon: MousePointerClick },
]

const recentActivity = [
  { id: 1, name: 'Alice Johnson', action: 'Signed up', time: '2 min ago' },
  { id: 2, name: 'Bob Smith', action: 'Upgraded to Pro', time: '15 min ago' },
  { id: 3, name: 'Carol White', action: 'Submitted report', time: '1 hr ago' },
  { id: 4, name: 'David Lee', action: 'Logged in', time: '2 hr ago' },
  { id: 5, name: 'Eva Martinez', action: 'Updated profile', time: '3 hr ago' },
]

export default function Dashboard() {
  const user = useSelector((s: RootState) => s.auth.user)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Good morning, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your app today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, up, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{value}</div>
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {recentActivity.map((item) => (
              <li key={item.id} className="flex items-center justify-between px-6 py-3.5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                      {item.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.action}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
