import type { FrappeRealtime } from 'frappe-js-client/realtime'

import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { frappeQueryKeys } from '../src'
import { useFrappeDocLive, useFrappeDocViewers, useFrappeRealtimeEvent } from '../src/realtime'
import { createQueryClient, createWrapper } from './helpers/render'

function fakeRealtime(overrides?: Partial<FrappeRealtime>) {
    return {
        connected: true,
        connect: vi.fn(),
        close: vi.fn(),
        subscribeDoc: vi.fn(() => vi.fn()),
        subscribeDocType: vi.fn(() => vi.fn()),
        subscribeDocViewers: vi.fn(() => vi.fn()),
        on: vi.fn(() => vi.fn()),
        ...overrides,
    } as unknown as FrappeRealtime
}

describe('useFrappeDocLive', () => {
    it('throws when realtime was not passed to the provider', () => {
        const { wrapper } = createWrapper()
        expect(() => renderHook(() => useFrappeDocLive('ToDo', 'TD-1'), { wrapper })).toThrow(/realtime/)
    })

    it('invalidates the document key when subscribeDoc fires', async () => {
        const queryClient = createQueryClient()
        const unsub = vi.fn()
        let handler: ((event: { doctype: string; name: string }) => void) | undefined
        const realtime = fakeRealtime({
            subscribeDoc: vi.fn((_dt, _name, cb) => {
                handler = cb
                return unsub
            }),
        })

        const docKey = frappeQueryKeys.db.doc('ToDo', 'TD-1')
        queryClient.setQueryData(docKey, { name: 'TD-1' })

        const { wrapper } = createWrapper({ queryClient, realtime })
        renderHook(() => useFrappeDocLive('ToDo', 'TD-1'), { wrapper })

        expect(realtime.subscribeDoc).toHaveBeenCalled()
        handler?.({ doctype: 'ToDo', name: 'TD-1' })

        await waitFor(() => {
            expect(queryClient.getQueryState(docKey)?.isInvalidated).toBe(true)
        })
    })
})

describe('useFrappeDocViewers', () => {
    it('returns viewers from subscribeDocViewers', async () => {
        let handler: ((event: { viewers: Array<{ user: string }> }) => void) | undefined
        const realtime = fakeRealtime({
            subscribeDocViewers: vi.fn((_dt, _name, cb) => {
                handler = cb
                return vi.fn()
            }),
        })

        const { wrapper } = createWrapper({ realtime })
        const { result } = renderHook(() => useFrappeDocViewers('ToDo', 'TD-1'), { wrapper })

        expect(result.current).toEqual([])
        handler?.({ viewers: [{ user: 'Administrator' }] })

        await waitFor(() => {
            expect(result.current).toEqual([{ user: 'Administrator' }])
        })
    })
})

describe('useFrappeRealtimeEvent', () => {
    it('subscribes to a connection event', () => {
        const handler = vi.fn()
        const unsub = vi.fn()
        const realtime = fakeRealtime({
            on: vi.fn(() => unsub),
        })

        const { wrapper } = createWrapper({ realtime })
        const { unmount } = renderHook(() => useFrappeRealtimeEvent('connect', handler), { wrapper })

        expect(realtime.on).toHaveBeenCalledWith('connect', handler)
        unmount()
        expect(unsub).toHaveBeenCalled()
    })
})
