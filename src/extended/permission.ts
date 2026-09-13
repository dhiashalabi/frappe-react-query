import type { HasPermissionResponse, Permissions, PermissionType } from 'frappe-js-client/extended'

import { useQuery } from '@tanstack/react-query'

import type { FrappeQueryOptions } from '../types'

import { useExtendedClient } from './assert'
import { frappeExtendedQueryOptions } from './options'

export function useFrappeHasPermission(
    doctype: string,
    name: string,
    permType: PermissionType = 'read',
    options?: FrappeQueryOptions<HasPermissionResponse>,
) {
    const client = useExtendedClient()
    return useQuery(frappeExtendedQueryOptions.permission.has(client, doctype, name, permType, options))
}

export function useFrappeGetDocPermissions(doctype: string, name: string, options?: FrappeQueryOptions<Permissions>) {
    const client = useExtendedClient()
    return useQuery(frappeExtendedQueryOptions.permission.getForDoc(client, doctype, name, options))
}
