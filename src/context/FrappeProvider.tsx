import type { FrappeClient } from 'frappe-js-client'
import type { FrappeRealtime } from 'frappe-js-client/realtime'
import type { PropsWithChildren } from 'react'

import { useMemo } from 'react'

import type { RegisteredDocs } from '../types'

import { FrappeContext, type FrappeContextValue } from './FrappeContext'

export interface FrappeProviderProps<Docs extends object = RegisteredDocs> extends PropsWithChildren {
    client: FrappeClient<Docs>
    realtime?: FrappeRealtime
}

export function FrappeProvider<Docs extends object = RegisteredDocs>({
    client,
    realtime,
    children,
}: FrappeProviderProps<Docs>) {
    const value = useMemo<FrappeContextValue<Docs>>(() => ({ client, realtime }), [client, realtime])

    return <FrappeContext.Provider value={value as unknown as FrappeContextValue}>{children}</FrappeContext.Provider>
}
