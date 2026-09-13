import type { RealtimeConnectionEventMap, RealtimeEventName } from 'frappe-js-client/realtime'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { useFrappe, useFrappeRealtime } from './hooks/useFrappe'
import { frappeQueryKeys } from './query/keys'

function requireRealtime(enabled: boolean) {
    const { realtime } = useFrappe()
    if (enabled && !realtime) {
        throw new Error(
            'FrappeProvider was not given a `realtime` instance. Pass `createRealtime(client)` from `frappe-js-client/realtime`.',
        )
    }
    return realtime
}

/** Subscribe to `doc_update` and invalidate that document's query keys. */
export function useFrappeDocLive(doctype: string, name: string, enabled = true) {
    const realtime = requireRealtime(enabled)
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!enabled || !realtime || !name) return
        return realtime.subscribeDoc(doctype, name, () => {
            void queryClient.invalidateQueries({ queryKey: frappeQueryKeys.db.doc(doctype, name) })
        })
    }, [doctype, name, enabled, realtime, queryClient])
}

/** Subscribe to `list_update` and invalidate that DocType's query keys. */
export function useFrappeDocTypeLive(doctype: string, enabled = true) {
    const realtime = requireRealtime(enabled)
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!enabled || !realtime || !doctype) return
        return realtime.subscribeDocType(doctype, () => {
            void queryClient.invalidateQueries({ queryKey: frappeQueryKeys.db.doctype(doctype) })
        })
    }, [doctype, enabled, realtime, queryClient])
}

/** Presence list for a document (`doc_viewers`). */
export function useFrappeDocViewers(doctype: string, name: string, enabled = true) {
    const realtime = requireRealtime(enabled)
    const [viewers, setViewers] = useState<Array<{ user: string; [key: string]: unknown }>>([])

    useEffect(() => {
        if (!enabled || !realtime || !name) return
        return realtime.subscribeDocViewers(doctype, name, (event) => {
            setViewers(event.viewers ?? [])
        })
    }, [doctype, name, enabled, realtime])

    return viewers
}

/** Subscribe to a connection-lifecycle event on the realtime client. */
export function useFrappeRealtimeEvent<K extends RealtimeEventName>(
    event: K,
    handler: (payload: RealtimeConnectionEventMap[K]) => void,
) {
    const realtime = useFrappeRealtime()

    useEffect(() => {
        return realtime.on(event, handler)
    }, [realtime, event, handler])
}
