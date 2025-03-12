import { useCallback, useContext } from 'react'
import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query'
import { FrappeContext } from '../context/FrappeContext'
import { FrappeError as Error, FrappeConfig } from '../types'
import { encodeQueryData } from '../utils'
import { ApiParams } from '@mussnad/frappe-js-client'

/**
 *  Hook to make a GET request to the server
 *
 * @param method - name of the method to call (will be dotted path e.g. "frappe.client.get_list")
 * @param params - parameters to pass to the method
 * @param queryKey - optional QueryKey that will be used to cache the result. If not provided, the method name with the URL params will be used as the key
 * @param options [Optional] React Query configuration options for fetching data
 * @param type - type of the request to make - defaults to GET
 *
 * @typeParam T - Type of the data returned by the method
 * @returns an object with data, error, isLoading, and other React Query properties
 */
export const useFrappeGetCall = <T = any>(
    method: string,
    params?: ApiParams,
    queryKey?: QueryKey,
    options?: any,
    type: 'GET' | 'POST' = 'GET',
) => {
    const { call } = useContext(FrappeContext) as FrappeConfig
    const urlParams = encodeQueryData(params ?? {})
    const defaultKey = [method, urlParams]

    return useQuery<T>({
        queryKey: queryKey || defaultKey,
        queryFn: () =>
            type === 'GET'
                ? call.get(method, params).then((res) => res.message)
                : call.post(method, params).then((res) => res.message),
        ...options,
    })
}

/**
 *  Hook to prefetch data
 */
export const useFrappePrefetchCall = <T = any>(
    method: string,
    params?: ApiParams,
    queryKey?: QueryKey,
    type: 'GET' | 'POST' = 'GET',
) => {
    const { call } = useContext(FrappeContext) as FrappeConfig
    const queryClient = useQueryClient()
    const urlParams = encodeQueryData(params ?? {})
    const defaultKey = [method, urlParams]

    return useCallback(() => {
        queryClient.prefetchQuery({
            queryKey: queryKey || defaultKey,
            queryFn: () =>
                type === 'GET'
                    ? call.get<T>(method, params).then((res) => res.message)
                    : call.post<T>(method, params).then((res) => res.message),
        })
    }, [method, params, queryKey, type, call, queryClient, defaultKey])
}

/**
 * Hook for POST requests
 */
export const useFrappePostCall = <T = any>(method: string) => {
    const { call: frappeCall } = useContext(FrappeContext) as FrappeConfig
    const mutation = useMutation<T, Error, ApiParams>({
        mutationFn: (params) => frappeCall.post<T>(method, params).then((res) => res.message),
    })

    return {
        call: mutation.mutate,
        result: mutation.data,
        loading: mutation.isPending,
        error: mutation.error,
        isCompleted: mutation.isSuccess,
        reset: mutation.reset,
    }
}

/**
 * Hook for PUT requests
 */
export const useFrappePutCall = <T = any>(method: string) => {
    const { call: frappeCall } = useContext(FrappeContext) as FrappeConfig
    const mutation = useMutation<T, Error, ApiParams>({
        mutationFn: (params) => frappeCall.put<T>(method, params).then((res) => res.message),
    })

    return {
        call: mutation.mutate,
        result: mutation.data,
        loading: mutation.isPending,
        error: mutation.error,
        isCompleted: mutation.isSuccess,
        reset: mutation.reset,
    }
}

/**
 * Hook for DELETE requests
 */
export const useFrappeDeleteCall = <T = any>(method: string) => {
    const { call: frappeCall } = useContext(FrappeContext) as FrappeConfig
    const mutation = useMutation<T, Error, ApiParams>({
        mutationFn: (params) => frappeCall.delete<T>(method, params).then((res) => res.message),
    })

    return {
        call: mutation.mutate,
        result: mutation.data,
        loading: mutation.isPending,
        error: mutation.error,
        isCompleted: mutation.isSuccess,
        reset: mutation.reset,
    }
}
