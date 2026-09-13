import { createTestClient } from 'frappe-js-client/testing'
import { describe, expect, it } from 'vitest'

import { frappeQueryOptions } from '../src'

describe('getDocListInfinite', () => {
    it('uses start as the page param and stops when hasNextPage is false', async () => {
        const { client } = createTestClient()
        const options = frappeQueryOptions.db.getDocListInfinite(client, 'ToDo', { limit: 20 })

        expect(options.initialPageParam).toBe(0)

        const lastPage = { data: [{ name: 'a' }], hasNextPage: false }
        expect(options.getNextPageParam(lastPage as never, [lastPage] as never, 0, [0])).toBeUndefined()
    })

    it('advances start by limit when the server reports another page', () => {
        const { client } = createTestClient()
        const options = frappeQueryOptions.db.getDocListInfinite(client, 'ToDo', { limit: 10, start: 5 })

        expect(options.initialPageParam).toBe(5)
        const lastPage = { data: new Array(10).fill({ name: 'x' }), hasNextPage: true }
        expect(options.getNextPageParam(lastPage as never, [lastPage] as never, 5, [5])).toBe(15)
    })

    it('forwards extra infinite query options through the factory', () => {
        const { client } = createTestClient()
        const options = frappeQueryOptions.db.getDocListInfinite(client, 'ToDo', { limit: 20 }, {
            staleTime: 12_000,
            enabled: false,
        })

        expect(options.staleTime).toBe(12_000)
        expect(options.enabled).toBe(false)
    })

    it('stops when the page is short and hasNextPage is unknown', () => {
        const { client } = createTestClient()
        const options = frappeQueryOptions.db.getDocListInfinite(client, 'ToDo', { limit: 20 })
        const lastPage = { data: [{ name: 'only' }] }
        expect(options.getNextPageParam(lastPage as never, [lastPage] as never, 0, [0])).toBeUndefined()
    })
})
