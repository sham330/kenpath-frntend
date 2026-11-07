import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { type VariantProps } from 'class-variance-authority'
import { badgeVariants } from '@/components/ui/badge'

type BadgeVariant = VariantProps<typeof badgeVariants>['variant']

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', joined: 'Jan 12, 2024' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Active', joined: 'Feb 3, 2024' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'User', status: 'Inactive', joined: 'Feb 18, 2024' },
  { id: 4, name: 'David Lee', email: 'david@example.com', role: 'Editor', status: 'Active', joined: 'Mar 5, 2024' },
  { id: 5, name: 'Eva Martinez', email: 'eva@example.com', role: 'User', status: 'Active', joined: 'Mar 22, 2024' },
]

const roleVariant: Record<string, BadgeVariant> = { Admin: 'default', Editor: 'secondary', User: 'outline' }

export default function Users() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Users</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your team members and their roles.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Users</CardTitle>
          <CardDescription>{users.length} members total</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                          {u.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground text-sm">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleVariant[u.role] ?? 'outline'}>{u.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.status === 'Active' ? 'success' : 'secondary'}>{u.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{u.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
