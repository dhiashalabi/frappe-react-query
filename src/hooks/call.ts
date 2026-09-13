import type { ApiArgs } from 'frappe-js-client'

import { useMutation, useQuery } from '@tanstack/react-query'

import type { FrappeMutationOptions, FrappeQueryOptions } from '../types'

import { mergeMutationOptions } from '../query/merge'
import { frappeQueryOptions } from '../query/options'
import { useFrappe } from './useFrappe'

export function useFrappeGetCall<T = unknown>(method: string, args?: ApiArgs, options?: FrappeQueryOptions<T>) {
    const { client } = useFrappe()
    return useQuery(frappeQueryOptions.call.get<T>(client, method, args, options))
}

export function useFrappePostCall<T = unknown>(
    method: string,
    options?: FrappeMutationOptions<T, ApiArgs | undefined>,
) {
    const { client } = useFrappe()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: (params) => client.call.post<T>(method, params),
            },
            options,
        ),
    )
    return { ...mutation, call: mutation.mutateAsync }
}

export function useFrappePutCall<T = unknown>(method: string, options?: FrappeMutationOptions<T, ApiArgs | undefined>) {
    const { client } = useFrappe()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: (params) => client.call.put<T>(method, params),
            },
            options,
        ),
    )
    return { ...mutation, call: mutation.mutateAsync }
}

export function useFrappeDeleteCall<T = unknown>(
    method: string,
    options?: FrappeMutationOptions<T, ApiArgs | undefined>,
) {
    const { client } = useFrappe()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: (params) => client.call.delete<T>(method, params),
            },
            options,
        ),
    )
    return { ...mutation, call: mutation.mutateAsync }
}

export interface DoctypeMethodVariables {
    params?: ApiArgs
}

export function useFrappeDoctypeMethod<T = unknown>(
    doctype: string,
    method: string,
    options?: FrappeMutationOptions<T, ApiArgs | undefined>,
) {
    const { client } = useFrappe()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: (params) => client.call.doctypeMethod<T>(doctype, method, params),
            },
            options,
        ),
    )
    return { ...mutation, call: mutation.mutateAsync }
}

export interface RunDocMethodVariables {
    method: string
    document: Record<string, unknown>
    args?: Record<string, unknown>
}

export function useFrappeRunDocMethod<T = unknown>(options?: FrappeMutationOptions<T, RunDocMethodVariables>) {
    const { client } = useFrappe()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ method, document, args }) => client.call.runDocMethod<T>(method, document, args),
            },
            options,
        ),
    )
    return { ...mutation, runDocMethod: mutation.mutateAsync }
}
