import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
    frappeQueryKeys,
    setCachedDoc,
    useFrappeCreateDoc,
    useFrappeDeleteDoc,
    useFrappeUpdateDoc,
} from '../src'
import { createQueryClient, createWrapper } from './helpers/render'

function todoDoc(name: string) {
    return {
        name,
        doctype: 'ToDo',
        owner: 'Administrator',
        creation: '',
        modified: '',
        modified_by: '',
        idx: 0,
        docstatus: 0 as const,
        description: 'x',
    }
}

describe('mutation invalidation', () => {
    it('invalidates the doctype prefix after create', async () => {
        const queryClient = createQueryClient()
        const { wrapper, client } = createWrapper({ queryClient })
        vi.spyOn(client.db, 'createDoc').mockResolvedValue(todoDoc('TD-1'))

        const listKey = frappeQueryKeys.db.list('ToDo')
        queryClient.setQueryData(listKey, [])

        const { result } = renderHook(() => useFrappeCreateDoc(), { wrapper })
        await result.current.createDoc({ doctype: 'ToDo', doc: { description: 'x' } })

        await waitFor(() => {
            expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true)
        })
    })

    it('writes the updated document into the cache and invalidates the doctype', async () => {
        const queryClient = createQueryClient()
        const { wrapper, client } = createWrapper({ queryClient })
        const updated = todoDoc('TD-1')
        vi.spyOn(client.db, 'updateDoc').mockResolvedValue(updated)

        const docKey = frappeQueryKeys.db.doc('ToDo', 'TD-1')
        queryClient.setQueryData(docKey, todoDoc('TD-1'))

        const { result } = renderHook(() => useFrappeUpdateDoc(), { wrapper })
        await result.current.updateDoc({ doctype: 'ToDo', name: 'TD-1', doc: { description: 'y' } })

        expect(queryClient.getQueryData(docKey)).toEqual(updated)
        await waitFor(() => {
            expect(queryClient.getQueryState(docKey)?.isInvalidated).toBe(true)
        })
    })

    it('removes the document query after delete', async () => {
        const queryClient = createQueryClient()
        const { wrapper, client } = createWrapper({ queryClient })
        vi.spyOn(client.db, 'deleteDoc').mockResolvedValue(undefined)

        const docKey = frappeQueryKeys.db.doc('ToDo', 'TD-1')
        queryClient.setQueryData(docKey, todoDoc('TD-1'))

        const { result } = renderHook(() => useFrappeDeleteDoc(), { wrapper })
        await result.current.deleteDoc({ doctype: 'ToDo', name: 'TD-1' })

        expect(queryClient.getQueryData(docKey)).toBeUndefined()
    })

    it('updates every cached getDoc variant, including queries that passed args', () => {
        const queryClient = createQueryClient()
        const updated = todoDoc('TD-1')
        const plainKey = frappeQueryKeys.db.doc('ToDo', 'TD-1')
        const argsKey = frappeQueryKeys.db.doc('ToDo', 'TD-1', { expandLinks: true })

        queryClient.setQueryData(plainKey, todoDoc('TD-1'))
        queryClient.setQueryData(argsKey, todoDoc('TD-1'))

        setCachedDoc(queryClient, 'ToDo', 'TD-1', updated)

        expect(queryClient.getQueryData(plainKey)).toEqual(updated)
        expect(queryClient.getQueryData(argsKey)).toEqual(updated)
    })
})
