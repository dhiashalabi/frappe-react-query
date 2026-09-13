import { renderHook } from '@testing-library/react'
import { createTestClient, createExtendedTestClient } from 'frappe-js-client/testing'
import { describe, expect, it, vi } from 'vitest'

import { useFrappeHasPermission } from '../src/extended'
import { createWrapper } from './helpers/render'

describe('extended hooks', () => {
    it('throws when the provider client is not extended', () => {
        const { client } = createTestClient()
        const { wrapper } = createWrapper({ client })
        expect(() => renderHook(() => useFrappeHasPermission('User', 'Administrator'), { wrapper })).toThrow(
            /withExtended/,
        )
    })

    it('accepts a client from withExtended', () => {
        const { client } = createExtendedTestClient()
        vi.spyOn(client.permission, 'has').mockResolvedValue({ has_permission: true })
        const { wrapper } = createWrapper({ client })
        const { result } = renderHook(() => useFrappeHasPermission('User', 'Administrator'), { wrapper })
        expect(result.current.fetchStatus).not.toBe(undefined)
    })
})
