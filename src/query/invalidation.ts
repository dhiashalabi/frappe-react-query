import type { QueryClient } from '@tanstack/react-query'
import type { FrappeDoc } from 'frappe-js-client'

import { frappeQueryKeys } from './keys'

export function invalidateDoctype(queryClient: QueryClient, doctype: string) {
    return queryClient.invalidateQueries({ queryKey: frappeQueryKeys.db.doctype(doctype) })
}

export function setCachedDoc(queryClient: QueryClient, doctype: string, name: string, doc: FrappeDoc<object>) {
    queryClient.setQueriesData({ queryKey: frappeQueryKeys.db.doc(doctype, name) }, doc)
}

export function removeCachedDoc(queryClient: QueryClient, doctype: string, name: string) {
    queryClient.removeQueries({ queryKey: frappeQueryKeys.db.doc(doctype, name) })
}

export function invalidateCachedDoc(queryClient: QueryClient, doctype: string, name: string) {
    return queryClient.invalidateQueries({ queryKey: frappeQueryKeys.db.doc(doctype, name) })
}
