import {
    useFrappeDeleteDoc,
    useFrappeGetDoc,
    useFrappeSetValue,
    useFrappeUpdateDoc,
    useFrappeValidateLink,
} from 'frappe-react-query'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import type { TodoFormValues } from '@/todo'

import { TodoForm } from '@/components/todo-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { emptyTodoForm, formToPatch, todoFormFromDoc } from '@/todo'
import { getErrorMessage } from '@/utils'

export function TodoDetail() {
    const { name = '' } = useParams()
    const navigate = useNavigate()
    const doc = useFrappeGetDoc('ToDo', name, undefined, { realtime: true, enabled: !!name })
    const validate = useFrappeValidateLink('ToDo', name, ['name', 'description', 'status'], {
        enabled: !!name,
    })
    const { updateDoc, isPending: isUpdating } = useFrappeUpdateDoc()
    const { setValue, isPending: isSetting } = useFrappeSetValue()
    const { deleteDoc, isPending: isDeleting } = useFrappeDeleteDoc()

    const [form, setForm] = useState<TodoFormValues>(emptyTodoForm)
    const [syncedName, setSyncedName] = useState<string | null>(null)
    const [actionError, setActionError] = useState<string | null>(null)

    if (doc.data && doc.data.name !== syncedName) {
        setForm(todoFormFromDoc(doc.data))
        setSyncedName(doc.data.name)
    }

    const busy = isUpdating || isSetting || isDeleting

    const handleUpdate = async () => {
        setActionError(null)
        try {
            await updateDoc({ doctype: 'ToDo', name, doc: formToPatch(form) })
            setSyncedName(null)
        } catch (error) {
            setActionError(getErrorMessage(error))
        }
    }

    const handleToggleStatus = async () => {
        const next = doc.data?.status === 'Closed' ? 'Open' : 'Closed'
        setActionError(null)
        try {
            await setValue({ doctype: 'ToDo', name, fieldName: 'status', value: next })
            setSyncedName(null)
        } catch (error) {
            setActionError(getErrorMessage(error))
        }
    }

    const handleDelete = async () => {
        setActionError(null)
        try {
            await deleteDoc({ doctype: 'ToDo', name })
            navigate('/todos', { replace: true })
        } catch (error) {
            setActionError(getErrorMessage(error))
        }
    }

    return (
        <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <Link
                        to="/todos"
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← ToDos
                    </Link>
                    <h1 className="font-heading mt-1 text-lg font-medium">{name || 'ToDo'}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={busy || !doc.data}
                        onClick={() => void handleToggleStatus()}
                    >
                        {doc.data?.status === 'Closed' ? 'Reopen' : 'Close'}
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        disabled={busy || !doc.data}
                        onClick={() => void handleDelete()}
                    >
                        {isDeleting ? 'Deleting…' : 'Delete'}
                    </Button>
                </div>
            </div>

            {actionError ? (
                <Alert variant="destructive">
                    <AlertDescription>{actionError}</AlertDescription>
                </Alert>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Document</CardTitle>
                        <CardDescription>useFrappeGetDoc + useFrappeUpdateDoc</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {doc.isLoading ? (
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        ) : doc.error ? (
                            <Alert variant="destructive">
                                <AlertTitle>Could not load ToDo</AlertTitle>
                                <AlertDescription>{getErrorMessage(doc.error)}</AlertDescription>
                            </Alert>
                        ) : (
                            <TodoForm
                                values={form}
                                onChange={setForm}
                                onSubmit={() => void handleUpdate()}
                                submitting={busy}
                                submitLabel={isUpdating ? 'Saving…' : 'Save'}
                            />
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Validate link</CardTitle>
                        <CardDescription>useFrappeValidateLink for ToDo / {name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {validate.isLoading ? (
                            <Skeleton className="h-16 w-full" />
                        ) : validate.error ? (
                            <Alert variant="destructive">
                                <AlertDescription>{getErrorMessage(validate.error)}</AlertDescription>
                            </Alert>
                        ) : (
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Name</FieldLabel>
                                    <p>{validate.data?.name ?? '—'}</p>
                                </Field>
                                <Field>
                                    <FieldLabel>Description</FieldLabel>
                                    <p>{validate.data?.description ?? '—'}</p>
                                </Field>
                                <Field>
                                    <FieldLabel>Status</FieldLabel>
                                    {validate.data?.status === 'Closed' ? (
                                        <Badge variant="secondary">Closed</Badge>
                                    ) : (
                                        <Badge>Open</Badge>
                                    )}
                                </Field>
                            </FieldGroup>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
