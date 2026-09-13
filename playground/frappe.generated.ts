import type { FrappeDoc, FrappeInsert, Link } from 'frappe-js-client/types'

/** Generated from DocType `ToDo`. Do not edit by hand — regenerate with `frappe-codegen --help`. */
export type ToDo = FrappeDoc<{
    doctype: 'ToDo'
    description: string
    status: 'Open' | 'Closed'
    priority?: 'High' | 'Medium' | 'Low'
    date?: string
    allocated_to?: Link<'User'>
    reference_type?: Link<'DocType'>
    reference_name?: string
    assigned_by?: Link<'User'>
    sender?: string
}>
export type ToDoInsert = FrappeInsert<ToDo>

/** Maps a DocType name to its generated read type. Pass as `createFrappeClient<GeneratedDocTypes>(...)`. */
export interface GeneratedDocTypes {
    ToDo: ToDo
}

/** Maps a DocType name to its insert payload type. */
export interface GeneratedInserts {
    ToDo: ToDoInsert
}

declare module 'frappe-react-query' {
    interface Register {
        docs: GeneratedDocTypes
    }
}
