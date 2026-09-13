import type { ToDo, ToDoInsert } from '@/frappe.generated'

export interface TodoFormValues {
    description: string
    status: ToDo['status']
    priority: NonNullable<ToDo['priority']>
    date: string
    allocated_to: string
}

export const emptyTodoForm: TodoFormValues = {
    description: '',
    status: 'Open',
    priority: 'Medium',
    date: '',
    allocated_to: '',
}

export function todoFormFromDoc(doc: ToDo): TodoFormValues {
    return {
        description: doc.description ?? '',
        status: doc.status ?? 'Open',
        priority: doc.priority ?? 'Medium',
        date: doc.date ?? '',
        allocated_to: doc.allocated_to ?? '',
    }
}

export function formToInsert(values: TodoFormValues): ToDoInsert {
    return {
        description: values.description.trim(),
        status: values.status,
        priority: values.priority,
        ...(values.date ? { date: values.date } : {}),
        ...(values.allocated_to ? { allocated_to: values.allocated_to as ToDo['allocated_to'] } : {}),
    }
}

export function formToPatch(values: TodoFormValues): Partial<ToDo> {
    return {
        description: values.description.trim(),
        status: values.status,
        priority: values.priority,
        date: values.date || undefined,
        allocated_to: (values.allocated_to || undefined) as ToDo['allocated_to'],
    }
}
