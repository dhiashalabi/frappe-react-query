import type { ExtendedFrappeClient } from 'frappe-js-client/extended'

import type { RegisteredDocs } from '../types'

import { useFrappe } from '../hooks/useFrappe'

export function useExtendedClient<Docs extends object = RegisteredDocs>(): ExtendedFrappeClient<Docs> {
    const { client } = useFrappe<Docs>()
    if (!('permission' in client) || !('workflow' in client) || !('site' in client)) {
        throw new Error(
            'This hook requires an extended client. Pass `withExtended(createFrappeClient(...))` to FrappeProvider.',
        )
    }
    return client as ExtendedFrappeClient<Docs>
}
