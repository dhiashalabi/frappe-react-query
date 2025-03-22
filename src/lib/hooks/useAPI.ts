import { useCallback, useContext } from 'react'
import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query'
import { FrappeContext } from '../context/FrappeContext'
import { FrappeError } from '../types'
import { encodeQueryData } from '../utils'
import { ApiParams, TypedResponse } from '@mussnad/frappe-js-client/dist/call/types'

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
 *
 * @returns an object with data, error, isLoading, and other React Query properties
 *
 * @example
 *
 * const { data, error, isLoading } = useFrappeGetCall('frappe.client.get_list', {
 *     filters: [{ field: 'name', operator: 'like', value: 'test' }],
 *     fields: ['name', 'title'],
 * })
 */
export const useFrappeGetCall = <T extends TypedResponse<any>>(
    method: string,
    params?: ApiParams,
    queryKey?: QueryKey,
    options?: any,
    type: 'GET' | 'POST' = 'GET',
) => {
    const { call } = useContext(FrappeContext)
    const urlParams = encodeQueryData(params ?? {})
    const defaultKey = [method, urlParams]

    return useQuery<T>({
        queryKey: queryKey || defaultKey,
        queryFn: () =>
            type === 'GET'
                ? call.get<T>(method, params).then((res) => res.message)
                : call.post<T>(method, params).then((res) => res.message),
        ...options,
    })
}

/**
 * Hook to prefetch data
 *
 * @param method - name of the method to call (will be dotted path e.g. "frappe.client.get_list")
 * @param params - parameters to pass to the method
 * @param queryKey - optional QueryKey that will be used to cache the result. If not provided, the method name with the URL params will be used as the key
 * @param type - type of the request to make - defaults to GET
 *
 * @typeParam T - Type of the data returned by the method
 *
 * @returns an object with data, error, isLoading, and other React Query properties
 *
 * @example
 *
 * const prefetch = useFrappePrefetchCall('frappe.client.get_list', {
 *     filters: [{ field: 'name', operator: 'like', value: 'test' }],
 *     fields: ['name', 'title'],
 * })
 */
export const useFrappePrefetchCall = <T extends TypedResponse<any>>(
    method: string,
    params?: ApiParams,
    queryKey?: QueryKey,
    type: 'GET' | 'POST' = 'GET',
) => {
    const { call } = useContext(FrappeContext)
    const queryClient = useQueryClient()

    return useCallback(() => {
        const defaultKey = [method, encodeQueryData(params ?? {})]
        queryClient.prefetchQuery({
            queryKey: queryKey || defaultKey,
            queryFn: () =>
                type === 'GET'
                    ? call.get<T>(method, params).then((res) => res.message)
                    : call.post<T>(method, params).then((res) => res.message),
        })
    }, [method, params, queryKey, type, call, queryClient])
}

/**
 * Hook for POST requests
 *
 * @param method - name of the method to call (will be dotted path e.g. "frappe.client.get_list")
 * @param params - parameters to pass to the method
 *
 * @typeParam T - Type of the data returned by the method
 *
 * @returns an object with data, error, isLoading, and other React Query properties
 *
 * @example
 *
 * const { data, error, isLoading } = useFrappePostCall('frappe.client.get_list', {
 *     filters: [{ field: 'name', operator: 'like', value: 'test' }],
 *     fields: ['name', 'title'],
 * })
 */
export const useFrappePostCall = <T extends TypedResponse<any>>(method: string) => {
    const { call: frappeCall } = useContext(FrappeContext)
    const mutation = useMutation<T, FrappeError, ApiParams>({
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
 *
 * @param method - name of the method to call (will be dotted path e.g. "frappe.client.get_list")
 * @param params - parameters to pass to the method
 *
 * @typeParam T - Type of the data returned by the method
 *
 * @returns an object with data, error, isLoading, and other React Query properties
 *
 * @example
 *
 * const { data, error, isLoading } = useFrappePutCall('frappe.client.get_list', {
 *     filters: [{ field: 'name', operator: 'like', value: 'test' }],
 *     fields: ['name', 'title'],
 * })
 */
export const useFrappePutCall = <T extends TypedResponse<any>>(method: string) => {
    const { call: frappeCall } = useContext(FrappeContext)
    const mutation = useMutation<T, FrappeError, ApiParams>({
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
 *
 * @param method - name of the method to call (will be dotted path e.g. "frappe.client.get_list")
 * @param params - parameters to pass to the method
 *
 * @typeParam T - Type of the data returned by the method
 *
 * @returns an object with data, error, isLoading, and other React Query properties
 *
 * @example
 *
 * const { data, error, isLoading } = useFrappeDeleteCall('frappe.client.get_list', {
 *     filters: [{ field: 'name', operator: 'like', value: 'test' }],
 *     fields: ['name', 'title'],
 * })
 */
export const useFrappeDeleteCall = <T extends TypedResponse<any>>(method: string) => {
    const { call: frappeCall } = useContext(FrappeContext)
    const mutation = useMutation<T, FrappeError, ApiParams>({
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
