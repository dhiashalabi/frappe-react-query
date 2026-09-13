import type { Filter } from 'frappe-js-client'

import { useFrappeCreateDoc, useFrappeGetCount, useFrappeGetDocList } from 'frappe-react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import type { ToDo } from '@/frappe.generated'
import type { TodoFormValues } from '@/todo'

import { TodoForm } from '@/components/todo-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { emptyTodoForm, formToInsert } from '@/todo'
import { getErrorMessage } from '@/utils'

type StatusFilter = 'all' | ToDo['status']

const TODO_FIELDS = ['name', 'description', 'status', 'priority', 'date', 'allocated_to'] as const

function stripHtml(value: string) {
    return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function statusBadge(status: string | undefined) {
    return status === 'Closed' ? <Badge variant="secondary">Closed</Badge> : <Badge>Open</Badge>
}

export function Todos() {
    const [status, setStatus] = useState<StatusFilter>('all')
    const [createOpen, setCreateOpen] = useState(false)
    const [form, setForm] = useState<TodoFormValues>(emptyTodoForm)
    const [formError, setFormError] = useState<string | null>(null)

    const filters: Filter<ToDo>[] | undefined = status === 'all' ? undefined : [['status', '=', status]]
    const list = useFrappeGetDocList('ToDo', {
        fields: TODO_FIELDS,
        filters,
        orderBy: { field: 'modified', order: 'desc' },
        limit: 20,
    }, { realtime: true })
    const count = useFrappeGetCount<ToDo>('ToDo', filters ? { filters } : undefined)
    const { createDoc, isPending } = useFrappeCreateDoc()

    const handleCreate = async () => {
        setFormError(null)
        try {
            await createDoc({ doctype: 'ToDo', doc: formToInsert(form) })
            setForm(emptyTodoForm)
            setCreateOpen(false)
        } catch (error) {
            setFormError(getErrorMessage(error))
        }
    }

    return (
        <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="font-heading text-lg font-medium">ToDos</h1>
                    <p className="text-sm text-muted-foreground">
                        {count.data ?? '—'} documents · cookie session against frappe16.localhost
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {(['all', 'Open', 'Closed'] as const).map((value) => (
                        <Button
                            key={value}
                            size="sm"
                            variant={status === value ? 'default' : 'outline'}
                            onClick={() => setStatus(value)}
                        >
                            {value === 'all' ? 'All' : value}
                        </Button>
                    ))}
                    <Button
                        size="sm"
                        onClick={() => {
                            setForm(emptyTodoForm)
                            setFormError(null)
                            setCreateOpen(true)
                        }}
                    >
                        New ToDo
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>List</CardTitle>
                    <CardDescription>useFrappeGetDocList for the ToDo doctype, invalidated over realtime.</CardDescription>
                </CardHeader>
                <CardContent>
                    {list.isLoading ? (
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : list.error ? (
                        <Alert variant="destructive">
                            <AlertTitle>Could not load ToDos</AlertTitle>
                            <AlertDescription>{getErrorMessage(list.error)}</AlertDescription>
                        </Alert>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Allocated to</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(list.data ?? []).map((todo) => (
                                    <TableRow key={todo.name}>
                                        <TableCell>
                                            <Link
                                                to={`/todos/${todo.name}`}
                                                className="font-medium hover:underline"
                                            >
                                                {todo.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {stripHtml(String(todo.description ?? '')) || '—'}
                                        </TableCell>
                                        <TableCell>{statusBadge(todo.status)}</TableCell>
                                        <TableCell>{todo.priority ?? '—'}</TableCell>
                                        <TableCell>{todo.date ?? '—'}</TableCell>
                                        <TableCell>{todo.allocated_to ?? '—'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                title="New ToDo"
                description="useFrappeCreateDoc with cookie CSRF."
            >
                {formError ? (
                    <Alert
                        variant="destructive"
                        className="mb-4"
                    >
                        <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                ) : null}
                <TodoForm
                    values={form}
                    onChange={setForm}
                    onSubmit={() => void handleCreate()}
                    submitting={isPending}
                    submitLabel={isPending ? 'Creating…' : 'Create'}
                />
            </Dialog>
        </div>
    )
}
