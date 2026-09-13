import type { FormEvent } from 'react'

import { useFrappeSearchLink } from 'frappe-react-query'
import { useState } from 'react'

import type { ToDo } from '@/frappe.generated'
import type { TodoFormValues } from '@/todo'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function TodoForm({
    values,
    onChange,
    onSubmit,
    submitting,
    submitLabel,
}: {
    values: TodoFormValues
    onChange: (values: TodoFormValues) => void
    onSubmit: () => void
    submitting: boolean
    submitLabel: string
}) {
    const [userQuery, setUserQuery] = useState(values.allocated_to)
    const users = useFrappeSearchLink('User', userQuery, undefined, { debounce: 250 })

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onSubmit()
    }

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="todo-description">Description</FieldLabel>
                    <Textarea
                        id="todo-description"
                        required
                        value={values.description}
                        disabled={submitting}
                        onChange={(event) => onChange({ ...values, description: event.target.value })}
                    />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                        <FieldLabel htmlFor="todo-status">Status</FieldLabel>
                        <Select
                            id="todo-status"
                            value={values.status}
                            disabled={submitting}
                            onChange={(event) => onChange({ ...values, status: event.target.value as ToDo['status'] })}
                        >
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </Select>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="todo-priority">Priority</FieldLabel>
                        <Select
                            id="todo-priority"
                            value={values.priority}
                            disabled={submitting}
                            onChange={(event) =>
                                onChange({
                                    ...values,
                                    priority: event.target.value as NonNullable<ToDo['priority']>,
                                })
                            }
                        >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </Select>
                    </Field>
                </div>
                <Field>
                    <FieldLabel htmlFor="todo-date">Date</FieldLabel>
                    <Input
                        id="todo-date"
                        type="date"
                        value={values.date}
                        disabled={submitting}
                        onChange={(event) => onChange({ ...values, date: event.target.value })}
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="todo-allocated">Allocated to</FieldLabel>
                    <Input
                        id="todo-allocated"
                        value={values.allocated_to}
                        disabled={submitting}
                        autoComplete="off"
                        onChange={(event) => {
                            onChange({ ...values, allocated_to: event.target.value })
                            setUserQuery(event.target.value)
                        }}
                    />
                    {users.data && users.data.length > 0 && userQuery ? (
                        <ul className="mt-1 max-h-36 overflow-auto rounded-lg border bg-background text-sm">
                            {users.data.map((user) => (
                                <li key={user.value}>
                                    <button
                                        type="button"
                                        className="w-full px-2.5 py-1.5 text-start hover:bg-muted"
                                        onClick={() => {
                                            onChange({ ...values, allocated_to: String(user.value) })
                                            setUserQuery('')
                                        }}
                                    >
                                        {user.description ?? user.value}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </Field>
                <Field>
                    <Button
                        type="submit"
                        disabled={submitting || !values.description.trim()}
                    >
                        {submitLabel}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
