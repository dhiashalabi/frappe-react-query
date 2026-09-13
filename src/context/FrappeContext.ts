import type { FrappeClient } from 'frappe-js-client'
import type { FrappeRealtime } from 'frappe-js-client/realtime'

import { createContext } from 'react'

import type { RegisteredDocs } from '../types'

export interface FrappeContextValue<Docs extends object = RegisteredDocs> {
    client: FrappeClient<Docs>
    realtime?: FrappeRealtime
}

export const FrappeContext = createContext<FrappeContextValue | null>(null)
