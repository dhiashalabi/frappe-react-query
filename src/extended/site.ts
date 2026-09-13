import type { TimeZoneResponse } from 'frappe-js-client/extended'

import { useQuery } from '@tanstack/react-query'

import type { FrappeQueryOptions } from '../types'

import { useExtendedClient } from './assert'
import { frappeExtendedQueryOptions } from './options'

export function useFrappeGetTimeZone(options?: FrappeQueryOptions<TimeZoneResponse>) {
    const client = useExtendedClient()
    return useQuery(frappeExtendedQueryOptions.site.getTimeZone(client, options))
}
