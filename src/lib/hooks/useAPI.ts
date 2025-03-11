import { useCallback, useContext, useState } from 'react'
import useSWR, { Key, SWRConfiguration, SWRResponse, useSWRConfig, preload } from 'swr'
import { FrappeContext } from '../context/FrappeContext'
import { FrappeError as Error, FrappeConfig } from '../types'
import { encodeQueryData } from '../utils'
export { useSWR, useSWRConfig, preload }

/**
 *  Hook to make a GET request to the server
 *
 * @param method - name of the method to call (will be dotted path e.g. "frappe.client.get_list")
 * @param params - parameters to pass to the method
 * @param swrKey - optional SWRKey that will be used to cache the result. If not provided, the method name with the URL params will be used as the key
 * @param options [Optional] SWRConfiguration options for fetching data
 * @param type - type of the request to make - defaults to GET
 *
 * @typeParam T - Type of the data returned by the method
 * @returns an object (SWRResponse) with the following properties: data (number), error, isValidating, isLoading, and mutate
 *
 * @example
 *
 * const { data, error, isLoading, mutate } = useFrappeGetCall("ping")
 *
 */
export const useFrappeGetCall = <T = unknown>(
    method: string,
    params?: Record<string, unknown>,
    swrKey?: Key,
    options?: SWRConfiguration,
    type: 'GET' | 'POST' = 'GET',
): SWRResponse<T, Error> => {
    const { call } = useContext(FrappeContext) as FrappeConfig
    const urlParams = encodeQueryData(params ?? {})
    const url = `${method}?${urlParams}`

    const swrResult = useSWR<T, Error>(
        swrKey === undefined ? url : swrKey,
        type === 'GET' ? () => call.get(method, params) : () => call.post(method, params),
        options,
    )

    return {
        ...swrResult,
    }
}

/**
 *  Hook to make a GET request to the server
 *
 * @param method - name of the method to call (will be dotted path e.g. "frappe.client.get_list")
 * @param params - parameters to pass to the method
 * @param swrKey - optional SWRKey that will be used to cache the result. If not provided, the method name with the URL params will be used as the key
 * @param options [Optional] SWRConfiguration options for fetching data
 * @param type - type of the request to make - defaults to GET
 *
 * @typeParam T - Type of the data returned by the method
 * @returns an object (SWRResponse) with the following properties: data (number), error, isValidating, isLoading, and mutate
 */
export const useFrappePrefetchCall = <T = unknown>(
    method: string,
    params?: Record<string, unknown>,
    swrKey?: Key,
    type: 'GET' | 'POST' = 'GET',
) => {
    const { call } = useContext(FrappeContext) as FrappeConfig
    const urlParams = encodeQueryData(params ?? {})
    const url = `${method}?${urlParams}`

    const preloadCall = useCallback(() => {
        preload(swrKey ?? url, type === 'GET' ? () => call.get<T>(method, params) : () => call.post<T>(method, params))
    }, [url, method, params, swrKey, call, type])

    return preloadCall
}

/**
 *
 * @param method - name of the method to call (POST request) (will be dotted path e.g. "frappe.client.set_value")
 * @returns an object with the following properties: loading, error, isCompleted , result, and call and reset functions
 */
export const useFrappePostCall = <T = unknown>(
    method: string,
): {
    /** Function to call the method. Returns a promise which resolves to the data returned by the method */
    call: (params: Record<string, unknown>) => Promise<T>
    /** The result of the API call */
    result: T | null
    /** Will be true when the API request is pending.  */
    loading: boolean
    /** Error object returned from API call */
    error: Error | null
    /** Will be true if API call is successful. Else false */
    isCompleted: boolean
    /** Function to reset the state of the hook */
    reset: () => void
} => {
    const { call: frappeCall } = useContext(FrappeContext) as FrappeConfig

    const [result, setResult] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [isCompleted, setIsCompleted] = useState(false)

    const reset = useCallback(() => {
        setResult(null)
        setLoading(false)
        setError(null)
        setIsCompleted(false)
    }, [])

    const call = useCallback(
        async (params: Record<string, unknown>): Promise<T> => {
            setError(null)
            setIsCompleted(false)
            setLoading(true)
            setResult(null)

            return frappeCall
                .post<T>(method, params)
                .then((message) => {
                    setResult(message)
                    setLoading(false)
                    setIsCompleted(true)
                    return message
                })
                .catch((error) => {
                    setLoading(false)
                    setIsCompleted(false)
                    setError(error)
                    throw error
                })
        },
        [frappeCall, method],
    )

    return {
        call,
        result,
        loading,
        error,
        reset,
        isCompleted,
    }
}

/**
 *
 * @param method - name of the method to call (PUT request) (will be dotted path e.g. "frappe.client.set_value")
 * @returns an object with the following properties: loading, error, isCompleted , result, and call and reset functions
 */
export const useFrappePutCall = <T = unknown>(
    method: string,
): {
    /** Function to call the method. Returns a promise which resolves to the data returned by the method */
    call: (params: Record<string, unknown>) => Promise<T>
    /** The result of the API call */
    result: T | null
    /** Will be true when the API request is pending.  */
    loading: boolean
    /** Error object returned from API call */
    error: Error | null
    /** Will be true if API call is successful. Else false */
    isCompleted: boolean
    /** Function to reset the state of the hook */
    reset: () => void
} => {
    const { call: frappeCall } = useContext(FrappeContext) as FrappeConfig

    const [result, setResult] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [isCompleted, setIsCompleted] = useState(false)

    const reset = useCallback(() => {
        setResult(null)
        setLoading(false)
        setError(null)
        setIsCompleted(false)
    }, [])

    const call = useCallback(
        async (params: Record<string, unknown>) => {
            setError(null)
            setIsCompleted(false)
            setLoading(true)
            setResult(null)

            return frappeCall
                .put<T>(method, params)
                .then((message) => {
                    setResult(message)
                    setLoading(false)
                    setIsCompleted(true)
                    return message
                })
                .catch((error) => {
                    setLoading(false)
                    setIsCompleted(false)
                    setError(error)
                    throw error
                })
        },
        [frappeCall, method],
    )

    return {
        call,
        result,
        loading,
        error,
        reset,
        isCompleted,
    }
}

/**
 *
 * @param method - name of the method to call (DELETE request) (will be dotted path e.g. "frappe.client.delete")
 * @returns an object with the following properties: loading, error, isCompleted , result, and call and reset functions
 */
export const useFrappeDeleteCall = <T = unknown>(
    method: string,
): {
    /** Function to call the method. Returns a promise which resolves to the data returned by the method */
    call: (params: Record<string, unknown>) => Promise<T>
    /** The result of the API call */
    result: T | null
    /** Will be true when the API request is pending.  */
    loading: boolean
    /** Error object returned from API call */
    error: Error | null
    /** Will be true if API call is successful. Else false */
    isCompleted: boolean
    /** Function to reset the state of the hook */
    reset: () => void
} => {
    const { call: frappeCall } = useContext(FrappeContext) as FrappeConfig

    const [result, setResult] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [isCompleted, setIsCompleted] = useState(false)

    const reset = useCallback(() => {
        setResult(null)
        setLoading(false)
        setError(null)
        setIsCompleted(false)
    }, [])

    const call = useCallback(
        async (params: Record<string, unknown>) => {
            setError(null)
            setIsCompleted(false)
            setLoading(true)
            setResult(null)

            return frappeCall
                .delete<T>(method, params)
                .then((message) => {
                    setResult(message)
                    setLoading(false)
                    setIsCompleted(true)
                    return message
                })
                .catch((error) => {
                    setLoading(false)
                    setIsCompleted(false)
                    setError(error)
                    throw error
                })
        },
        [frappeCall, method],
    )

    return {
        call,
        result,
        loading,
        error,
        reset,
        isCompleted,
    }
}
