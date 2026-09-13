import type { FrappeClient, FrappeDoc } from 'frappe-js-client'

import { describe, expectTypeOf, it } from 'vitest'

import { type CreateDocVariables, frappeQueryOptions, type UpdateDocVariables, useFrappeGetDoc } from '../src'

type ToDo = FrappeDoc<{ description?: string }>

interface GeneratedDocs {
    ToDo: ToDo
}

describe('Docs generic inference', () => {
    it('infers the generated DocType from a typed client on queryOptions', () => {
        const client = {} as FrappeClient<GeneratedDocs>
        const options = frappeQueryOptions.db.getDoc(client, 'ToDo', 'TD-1')
        expectTypeOf(options.queryFn).returns.resolves.toEqualTypeOf<ToDo>()
    })

    it('accepts a plain string doctype on an untyped client', () => {
        const client = {} as FrappeClient
        const options = frappeQueryOptions.db.getDoc(client, 'ToDo', 'TD-1')
        expectTypeOf(options.queryFn).returns.resolves.toEqualTypeOf<FrappeDoc<object>>()
    })

    it('keeps useFrappeGetDoc callable with a string doctype without Register', () => {
        expectTypeOf(useFrappeGetDoc).toBeCallableWith('ToDo', 'TD-1')
    })

    it('exports mutation variable types', () => {
        expectTypeOf<CreateDocVariables>().toHaveProperty('doctype')
        expectTypeOf<CreateDocVariables>().toHaveProperty('doc')
        expectTypeOf<UpdateDocVariables>().toHaveProperty('name')
    })
})
