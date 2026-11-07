import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Activity, BarChart3 } from 'lucide-react'

const links = [
  { to: '/dashboard/readings', label: 'Readings', icon: Activity },
  { to: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
]

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside className={cn(
        'fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-56 bg-sidebar border-r border-sidebar-border z-40 flex flex-col transition-transform duration-200',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <nav className="flex-1 p-3 space-y-0.5">
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Menu</p>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <Separator />
        <div className="p-3">
          <p className="px-3 py-2 text-xs text-muted-foreground">v1.0.0</p>
        </div>
      </aside>
    </>
  )
}
