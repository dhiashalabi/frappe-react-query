import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { frappeQueryKeys, useFrappeAuth, useFrappeGetCall, useFrappeSearchLink } from '../src'
import { createWrapper } from './helpers/render'

describe('useFrappeAuth', () => {
    it('sets the logged-user query after login', async () => {
        const { wrapper, client, queryClient } = createWrapper()
        vi.spyOn(client.auth, 'login').mockResolvedValue({ message: 'Logged In' })
        vi.spyOn(client.auth, 'getLoggedUser').mockResolvedValue('Administrator')

        const { result } = renderHook(() => useFrappeAuth(), { wrapper })
        await result.current.login({ username: 'Administrator', password: 'x' })

        expect(queryClient.getQueryData(frappeQueryKeys.auth.loggedUser)).toBe('Administrator')
    })
})

describe('useFrappeGetCall', () => {
    it('calls client.call.get with the abort signal', async () => {
        const { wrapper, client } = createWrapper()
        const spy = vi.spyOn(client.call, 'get').mockResolvedValue({ ok: true })
        const { result } = renderHook(() => useFrappeGetCall('ping'), { wrapper })
        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(spy).toHaveBeenCalledWith(
            'ping',
            undefined,
            expect.objectContaining({ signal: expect.any(AbortSignal) }),
        )
    })
})

describe('useFrappeSearchLink', () => {
    it('does not search until the debounced text is non-empty', () => {
        const { wrapper, client } = createWrapper()
        const spy = vi.spyOn(client.search, 'searchLink')
        const { result } = renderHook(() => useFrappeSearchLink('User', '', undefined, { debounce: 0 }), { wrapper })
        expect(result.current.fetchStatus).toBe('idle')
        expect(spy).not.toHaveBeenCalled()
    })
})
