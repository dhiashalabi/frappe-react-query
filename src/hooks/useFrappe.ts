import { useContext } from 'react'

import type { FrappeContextValue } from '../context/FrappeContext'
import type { RegisteredDocs } from '../types'

import { FrappeContext } from '../context/FrappeContext'

export function useFrappe<Docs extends object = RegisteredDocs>(): FrappeContextValue<Docs> {
    const context = useContext(FrappeContext)
    if (!context) {
        throw new Error('useFrappe must be used within a FrappeProvider')
    }
    return context as unknown as FrappeContextValue<Docs>
}

export function useFrappeClient<Docs extends object = RegisteredDocs>() {
    return useFrappe<Docs>().client
}

export function useFrappeRealtime() {
    const { realtime } = useFrappe()
    if (!realtime) {
        throw new Error(
            'FrappeProvider was not given a `realtime` instance. Pass `createRealtime(client)` from `frappe-js-client/realtime`.',
        )
    }
    return realtime
}
