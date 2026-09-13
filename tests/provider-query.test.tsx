import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useFrappe, useFrappeGetDoc } from '../src'
import { createWrapper } from './helpers/render'

describe('FrappeProvider', () => {
    it('throws when hooks are used outside the provider', () => {
        expect(() => renderHook(() => useFrappe())).toThrow(/FrappeProvider/)
    })

    it('exposes the client on context', () => {
        const { wrapper, client } = createWrapper()
        const { result } = renderHook(() => useFrappe(), { wrapper })
        expect(result.current.client).toBe(client)
        expect(result.current.realtime).toBeUndefined()
    })
})

describe('useFrappeGetDoc', () => {
    it('loads a document through the client and forwards the abort signal', async () => {
        const { wrapper, client } = createWrapper()
        const doc = {
            name: 'Administrator',
            doctype: 'User',
            owner: 'Administrator',
            creation: '',
            modified: '',
            modified_by: '',
            idx: 0,
            docstatus: 0 as const,
        }
        const spy = vi.spyOn(client.db, 'getDoc').mockResolvedValue(doc)

        const { result } = renderHook(() => useFrappeGetDoc('User', 'Administrator'), { wrapper })
        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data?.name).toBe('Administrator')
        expect(spy).toHaveBeenCalledWith(
            'User',
            'Administrator',
            undefined,
            expect.objectContaining({ signal: expect.any(AbortSignal) }),
        )
    })

    it('does not fetch when the document name is empty', () => {
        const { wrapper, client } = createWrapper()
        const spy = vi.spyOn(client.db, 'getDoc')
        const { result } = renderHook(() => useFrappeGetDoc('User', ''), { wrapper })
        expect(result.current.fetchStatus).toBe('idle')
        expect(spy).not.toHaveBeenCalled()
    })
})
