import { useEffect, useState } from 'react'
import { useReadings } from '../features/readings/useReadings'
import { Reading, TimeSlot } from '../features/readings/readingsService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { AlertCircle, Pencil, Trash2, Plus } from 'lucide-react'

const TIME_SLOTS: TimeSlot[] = ['MORNING', 'AFTER_BREAKFAST', 'AFTER_LUNCH', 'AFTER_DINNER']
const defaultForm = { readingDate: '', timeSlot: 'MORNING' as TimeSlot, value: '' }

type FormState = typeof defaultForm

function ReadingFormFields({ fields, setFields, err }: {
  fields: FormState
  setFields: (f: FormState) => void
  err: string | null
}) {
  return (
    <>
      <div className="space-y-1">
        <Label>Date</Label>
        <Input type="date" required value={fields.readingDate} max={new Date().toISOString().split('T')[0]}
          onChange={(e) => setFields({ ...fields, readingDate: e.target.value })} />
      </div>
      <div className="space-y-1">
        <Label>Time Slot</Label>
        <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={fields.timeSlot}
          onChange={(e) => setFields({ ...fields, timeSlot: e.target.value as TimeSlot })}>
          {TIME_SLOTS.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        <Label>Value (mg/dL)</Label>
        <Input
          type="text"
          inputMode="numeric"
          required
          placeholder="e.g. 95"
          value={fields.value}
          onChange={(e) => { if (/^\d*$/.test(e.target.value)) setFields({ ...fields, value: e.target.value }) }}
        />
      </div>
      {err && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />{err}
        </div>
      )}
    </>
  )
}

export default function Readings() {
  const { items, meta, loading, createLoading, actionLoadingId, fetchReadings, createReading, updateReading, deleteReading, clearError } = useReadings()
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [editTarget, setEditTarget] = useState<Reading | null>(null)
  const [editForm, setEditForm] = useState<FormState>(defaultForm)
  const [editError, setEditError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Reading | null>(null)

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
    if ((result as any).meta?.requestStatus === 'fulfilled') {
      setForm(defaultForm)
      setCreateOpen(false)
    } else {
      setFormError((result as any).payload ?? 'Something went wrong.')
    }
  }

  const openEdit = (r: Reading) => {
    setEditTarget(r)
    setEditForm({ readingDate: r.readingDate.split('T')[0], timeSlot: r.timeSlot, value: String(r.value) })
    setEditError(null)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const val = Number(editForm.value)
    if (!val || val < 40 || val > 600) { setEditError('Value must be between 40 and 600 mg/dl.'); return }
    setEditError(null)
    const result = await updateReading(editTarget!.id, { readingDate: editForm.readingDate, timeSlot: editForm.timeSlot, value: val })
    if ((result as any).meta?.requestStatus === 'fulfilled') {
      setEditTarget(null)
    } else {
      setEditError((result as any).payload ?? 'Something went wrong.')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteReading(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Glucose Readings</h1>
        <Button onClick={() => { setForm(defaultForm); setFormError(null); setCreateOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Add Reading
        </Button>
      </div>

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
                const isActing = actionLoadingId === r.id
                return (
                  <TableRow key={r.id}>
                    <TableCell>{new Date(r.readingDate).toLocaleDateString()}</TableCell>
                    <TableCell>{r.timeSlot.replace(/_/g, ' ')}</TableCell>
                    <TableCell>{r.value}</TableCell>
                    <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" disabled={isActing} onClick={() => openEdit(r)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" disabled={isActing} onClick={() => setDeleteTarget(r)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={(open) => { if (!open) { setCreateOpen(false); setFormError(null) } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Reading</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="flex flex-col gap-4 py-2">
            <ReadingFormFields fields={form} setFields={setForm} err={formError} />
            <DialogFooter className="mt-2">
              <Button type="submit" className="w-full" disabled={createLoading}>
                {createLoading ? 'Saving...' : 'Add Reading'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => { if (!open) { setEditTarget(null); setEditError(null) } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Reading</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="flex flex-col gap-4 py-2">
            <ReadingFormFields fields={editForm} setFields={setEditForm} err={editError} />
            <DialogFooter className="mt-2">
              <Button type="submit" className="w-full" disabled={!!actionLoadingId}>
                {actionLoadingId ? 'Saving...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Reading</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-2">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" className="flex-1" disabled={!!actionLoadingId} onClick={handleDelete}>
              {actionLoadingId ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
