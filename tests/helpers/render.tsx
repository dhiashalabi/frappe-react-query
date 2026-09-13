import type { PropsWithChildren } from 'react'
import type { FrappeClient } from 'frappe-js-client'
import type { FrappeRealtime } from 'frappe-js-client/realtime'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTestClient } from 'frappe-js-client/testing'

import { FrappeProvider } from '../../src'

export function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })
}

export function createWrapper(options?: {
    client?: FrappeClient
    realtime?: FrappeRealtime
    queryClient?: QueryClient
}) {
    const queryClient = options?.queryClient ?? createQueryClient()
    const client = options?.client ?? createTestClient().client

    function Wrapper({ children }: PropsWithChildren) {
        return (
            <QueryClientProvider client={queryClient}>
                <FrappeProvider
                    client={client}
                    realtime={options?.realtime}
                >
                    {children}
                </FrappeProvider>
            </QueryClientProvider>
        )
    }

    return { wrapper: Wrapper, queryClient, client }
}
