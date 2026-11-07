import { useEffect, useState } from 'react'
import { useReadings } from '../features/readings/useReadings'
import { Reading, TimeSlot } from '../features/readings/readingsService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertCircle, Pencil, Trash2, Check, X } from 'lucide-react'

const TIME_SLOTS: TimeSlot[] = ['MORNING', 'AFTER_BREAKFAST', 'AFTER_LUNCH', 'AFTER_DINNER']
const defaultForm = { readingDate: '', timeSlot: 'MORNING' as TimeSlot, value: '' }

export default function Readings() {
  const { items, meta, loading, createLoading, actionLoadingId, error, fetchReadings, createReading, updateReading, deleteReading, clearError } = useReadings()
  const [form, setForm] = useState(defaultForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{ readingDate: string; timeSlot: TimeSlot; value: string }>({ readingDate: '', timeSlot: 'MORNING', value: '' })

  useEffect(() => {
    fetchReadings(1)
    return () => { clearError() }
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const val = Number(form.value)
    if (!val || val < 40 || val > 600) { setFormError('Value must be between 40 and 600 mg/dl.'); return }
    setFormError(null)
    const result = await createReading({ readingDate: form.readingDate, timeSlot: form.timeSlot, value: val })
    if ((result as any).meta?.requestStatus === 'fulfilled') setForm(defaultForm)
  }

  const startEdit = (r: Reading) => {
    setEditId(r.id)
    setEditForm({
      readingDate: r.readingDate.split('T')[0],
      timeSlot: r.timeSlot,
      value: String(r.value),
    })
  }

  const handleUpdate = async (id: string) => {
    const val = Number(editForm.value)
    if (!val || val < 40 || val > 600) return
    const result = await updateReading(id, { readingDate: editForm.readingDate, timeSlot: editForm.timeSlot, value: val })
    if ((result as any).meta?.requestStatus === 'fulfilled') setEditId(null)
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Glucose Readings</h1>

      <Card>
        <CardHeader className="pb-2 font-semibold">Add Reading</CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <Label>Date</Label>
              <Input type="date" required value={form.readingDate} max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setForm({ ...form, readingDate: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Time Slot</Label>
              <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.timeSlot}
                onChange={(e) => setForm({ ...form, timeSlot: e.target.value as TimeSlot })}>
                {TIME_SLOTS.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Value (mg/dL)</Label>
              <Input type="number" required min={40} max={600} placeholder="e.g. 95" value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })} />
            </div>
            <Button type="submit" disabled={createLoading}>
              {createLoading ? 'Saving...' : 'Add'}
            </Button>
          </form>
          {(formError || error) && (
            <div className="flex items-center gap-2 mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />{formError || error}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time Slot</TableHead>
                <TableHead>Value (mg/dL)</TableHead>
                <TableHead>Recorded At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No readings yet.</TableCell>
                </TableRow>
              )}
              {items.map((r) => {
                const isEditing = editId === r.id
                const isActing = actionLoadingId === r.id
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      {isEditing
                        ? <Input type="date" className="h-8 w-36" value={editForm.readingDate} max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setEditForm({ ...editForm, readingDate: e.target.value })} />
                        : new Date(r.readingDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {isEditing
                        ? <select className="border rounded-md px-2 py-1 text-sm bg-background" value={editForm.timeSlot}
                            onChange={(e) => setEditForm({ ...editForm, timeSlot: e.target.value as TimeSlot })}>
                            {TIME_SLOTS.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                          </select>
                        : r.timeSlot.replace(/_/g, ' ')}
                    </TableCell>
                    <TableCell>
                      {isEditing
                        ? <Input type="number" className="h-8 w-24" min={40} max={600} value={editForm.value}
                            onChange={(e) => setEditForm({ ...editForm, value: e.target.value })} />
                        : r.value}
                    </TableCell>
                    <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" disabled={isActing} onClick={() => handleUpdate(r.id)}>
                            <Check className="h-4 w-4 text-emerald-600" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditId(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" disabled={isActing} onClick={() => startEdit(r)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" disabled={isActing} onClick={() => deleteReading(r.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <span>Page {meta.page} of {meta.totalPages} ({meta.total} total)</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={loading || !meta.hasPrev} onClick={() => fetchReadings(meta.page - 1)}>Prev</Button>
                <Button variant="outline" size="sm" disabled={loading || !meta.hasNext} onClick={() => fetchReadings(meta.page + 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
