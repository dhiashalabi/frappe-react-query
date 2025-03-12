import { useCallback, useContext, useState } from 'react'
import { FrappeConfig, FrappeDoc, GetDocListArgs, Filter, FrappeError as Error } from '../types'
import { FrappeContext } from '../context/FrappeContext'
import { getRequestURL, getDocListQueryString } from '../utils'
import { useQuery, UseQueryOptions, useQueryClient, useMutation } from '@tanstack/react-query'

/**
 * Hook to fetch a document from the database
 *
 * @param doctype - The doctype to fetch
 * @param name - the name of the document to fetch
 * @param options [Optional] UseQueryOptions options for fetching data
 * @returns an object with the following properties: data, error, isValidating, and mutate
 *
 * @typeParam T - The type of the document
 */
export const useFrappeGetDoc = <T = any>(
    doctype: string,
    name?: string,
    queryKey?: readonly any[],
    options?: UseQueryOptions<FrappeDoc<T>, Error>,
) => {
    const { url, db } = useContext(FrappeContext) as FrappeConfig
    const defaultQueryKey = ['frappe', doctype, name, getRequestURL(doctype, url, name)]

    const query = useQuery<FrappeDoc<T>, Error>({
        queryKey: queryKey ?? defaultQueryKey,
        queryFn: () => db.getDoc<T>(doctype, name),
        ...options,
    })

    return {
        ...query,
        data: query.data,
        error: query.error,
        isValidating: query.isFetching,
        mutate: query.refetch,
    }
}

/**
 * Hook to prefetch a document from the database
 * @param doctype - The doctype to fetch
 * @param name - The name of the document to fetch
 * @param queryKey - The queryKey to use for caching the result - optional
 * @returns A function to prefetch the document
 */
export const useFrappePrefetchDoc = <T = any>(doctype: string, name?: string, queryKey?: readonly any[]) => {
    const { db, url } = useContext(FrappeContext) as FrappeConfig
    const queryClient = useQueryClient()
    const defaultQueryKey = ['frappe', doctype, name, getRequestURL(doctype, url, name)]

    const preloadCall = useCallback(() => {
        return queryClient.prefetchQuery({
            queryKey: queryKey ?? defaultQueryKey,
            queryFn: () => db.getDoc<T>(doctype, name),
        })
    }, [queryClient, queryKey, defaultQueryKey, doctype, name, db])

    return preloadCall
}

/**
 * Hook to fetch a list of documents from the database
 *
 * @param doctype Name of the doctype to fetch
 * @param args Arguments to pass (filters, pagination, etc)
 * @param queryKey Optional query key for caching
 * @param options [Optional] UseQueryOptions for React Query
 * @returns an object with data, error, isValidating, and mutate properties
 *
 * @typeParam T - The type definition of the document object
 * @typeParam K - The type of the document for args
 */
export const useFrappeGetDocList = <T = any, K = FrappeDoc<T>>(
    doctype: string,
    args?: GetDocListArgs<K>,
    queryKey?: readonly any[],
    options?: UseQueryOptions<T[], Error>,
) => {
    const { url, db } = useContext(FrappeContext) as FrappeConfig

    const defaultQueryKey = ['frappe', doctype, args, `${getRequestURL(doctype, url)}?${getDocListQueryString(args)}`]

    const query = useQuery<T[], Error>({
        queryKey: queryKey ?? defaultQueryKey,
        queryFn: () => db.getDocList<T, K>(doctype, args),
        ...options,
    })

    return {
        ...query,
        data: query.data,
        error: query.error,
        isValidating: query.isFetching,
        mutate: query.refetch,
    }
}

/**
 * Hook to prefetch a list of documents from the database
 * @param doctype - The doctype to fetch
 * @param args - The arguments to pass to the getDocList method
 * @param queryKey - The queryKey to use for caching the result - optional
 * @returns A function to prefetch the list of documents
 */
export const useFrappePrefetchDocList = <T = any, K = FrappeDoc<T>>(
    doctype: string,
    args?: GetDocListArgs<K>,
    queryKey?: readonly any[],
) => {
    const { db, url } = useContext(FrappeContext) as FrappeConfig
    const queryClient = useQueryClient()
    const defaultQueryKey = ['frappe', doctype, args, `${getRequestURL(doctype, url)}?${getDocListQueryString(args)}`]

    const preloadCall = useCallback(() => {
        return queryClient.prefetchQuery({
            queryKey: queryKey ?? defaultQueryKey,
            queryFn: () => db.getDocList<T, K>(doctype, args),
        })
    }, [queryClient, queryKey, defaultQueryKey, doctype, args, db])

    return preloadCall
}

/**
 * Hook to create a document in the database and maintain loading and error states
 * @returns Object with the following properties: loading, error, isCompleted and createDoc and reset functions
 */
export const useFrappeCreateDoc = <T = any>(): {
    /** Function to create a document in the database */
    createDoc: (doctype: string, doc: T) => Promise<FrappeDoc<T>>
    /** Will be true when the API request is pending.  */
    loading: boolean
    /** Error object returned from API call */
    error: Error | null | undefined
    /** Will be true if document is created. Else false */
    isCompleted: boolean
    /** Function to reset the state of the hook */
    reset: () => void
} => {
    const { db } = useContext(FrappeContext) as FrappeConfig
    const [isCompleted, setIsCompleted] = useState(false)

    const mutation = useMutation<FrappeDoc<T>, Error, { doctype: string; doc: T }>({
        mutationFn: ({ doctype, doc }) => db.createDoc<T>(doctype, doc),
        onSuccess: () => {
            setIsCompleted(true)
        },
        onError: () => {
            setIsCompleted(false)
        },
    })

    const createDoc = useCallback(
        async (doctype: string, doc: T) => {
            setIsCompleted(false)
            const result = await mutation.mutateAsync({ doctype, doc })
            return result
        },
        [mutation],
    )

    const reset = useCallback(() => {
        mutation.reset()
        setIsCompleted(false)
    }, [mutation])

    return {
        createDoc,
        loading: mutation.isPending,
        error: mutation.error,
        isCompleted,
        reset,
    }
}

/**
 * Hook to update a document in the database and maintain loading and error states
 * @returns Object with the following properties: loading, error, isCompleted and updateDoc and reset functions
 */
export const useFrappeUpdateDoc = <T = any>(): {
    /** Function to update a document in the database */
    updateDoc: (doctype: string, docname: string | null, doc: Partial<T>) => Promise<FrappeDoc<T>>
    /** Will be true when the API request is pending.  */
    loading: boolean
    /** Error object returned from API call */
    error: Error | null | undefined
    /** Will be true if document is updated. Else false */
    isCompleted: boolean
    /** Function to reset the state of the hook */
    reset: () => void
} => {
    const { db } = useContext(FrappeContext) as FrappeConfig
    const [isCompleted, setIsCompleted] = useState(false)

    const mutation = useMutation<FrappeDoc<T>, Error, { doctype: string; docname: string | null; doc: Partial<T> }>({
        mutationFn: ({ doctype, docname, doc }) => db.updateDoc<T>(doctype, docname, doc),
        onSuccess: () => {
            setIsCompleted(true)
        },
        onError: () => {
            setIsCompleted(false)
        },
    })

    const updateDoc = useCallback(
        async (doctype: string, docname: string | null, doc: Partial<T>) => {
            setIsCompleted(false)
            const result = await mutation.mutateAsync({ doctype, docname, doc })
            return result
        },
        [mutation],
    )

    const reset = useCallback(() => {
        mutation.reset()
        setIsCompleted(false)
    }, [mutation])

    return {
        updateDoc,
        loading: mutation.isPending,
        error: mutation.error,
        isCompleted,
        reset,
    }
}

/**
 * Hook to delete a document in the database and maintain loading and error states
 * @returns Object with the following properties: loading, error, isCompleted and deleteDoc and reset functions
 */
export const useFrappeDeleteDoc = (): {
    /** Function to delete a document in the database. Returns a promise which resolves to an object with message "ok" if successful */
    deleteDoc: (doctype: string, docname?: string | null) => Promise<{ message: string }>
    /** Will be true when the API request is pending.  */
    loading: boolean
    /** Error object returned from API call */
    error: Error | null | undefined
    /** Will be true if document is deleted. Else false */
    isCompleted: boolean
    /** Function to reset the state of the hook */
    reset: () => void
} => {
    const { db } = useContext(FrappeContext) as FrappeConfig
    const [isCompleted, setIsCompleted] = useState(false)

    const mutation = useMutation<{ message: string }, Error, { doctype: string; docname?: string | null }>({
        mutationFn: ({ doctype, docname }) => db.deleteDoc(doctype, docname),
        onSuccess: () => {
            setIsCompleted(true)
        },
        onError: () => {
            setIsCompleted(false)
        },
    })

    const deleteDoc = useCallback(
        async (doctype: string, docname?: string | null) => {
            setIsCompleted(false)
            const result = await mutation.mutateAsync({ doctype, docname })
            return result
        },
        [mutation],
    )

    const reset = useCallback(() => {
        mutation.reset()
        setIsCompleted(false)
    }, [mutation])

    return {
        deleteDoc,
        loading: mutation.isPending,
        error: mutation.error,
        isCompleted,
        reset,
    }
}

/**
 * Hook to fetch number of documents from the database
 *
 * @param doctype - The doctype to fetch
 * @param filters - filters to apply to the query
 * @param cache - Whether to cache the result or not. Defaults to false
 * @param debug - Whether to log debug messages or not. Defaults to false
 * @param options [Optional] UseQueryOptions options for fetching data
 * @returns an object with data (number), error, isValidating, and mutate properties
 */
export const useFrappeGetDocCount = <T = any>(
    doctype: string,
    filters?: Filter<T>[],
    cache: boolean = false,
    debug: boolean = false,
    queryKey?: readonly any[],
    options?: UseQueryOptions<number, Error>,
) => {
    const { db } = useContext(FrappeContext) as FrappeConfig
    const defaultQueryKey = ['frappe', 'count', doctype, filters, cache, debug]

    const query = useQuery<number, Error>({
        queryKey: queryKey ?? defaultQueryKey,
        queryFn: () => db.getCount(doctype, filters, cache, debug),
        ...options,
    })

    return {
        ...query,
        data: query.data,
        error: query.error,
        isValidating: query.isFetching,
        mutate: query.refetch,
    }
}

/**
 * Hook to prefetch the number of documents from the database
 * @param doctype - The doctype to fetch
 * @param filters - filters to apply to the query
 * @param cache - Whether to cache the result or not. Defaults to false
 * @param debug - Whether to log debug messages or not. Defaults to false
 * @param queryKey - The queryKey to use for caching the result - optional
 * @returns A function to prefetch the number of documents
 */
export const useFrappePrefetchDocCount = <T = any>(
    doctype: string,
    filters?: Filter<T>[],
    cache: boolean = false,
    debug: boolean = false,
    queryKey?: readonly any[],
) => {
    const { db } = useContext(FrappeContext) as FrappeConfig
    const queryClient = useQueryClient()
    const defaultQueryKey = ['frappe', 'count', doctype, filters, cache, debug]

    const preloadCall = useCallback(() => {
        return queryClient.prefetchQuery({
            queryKey: queryKey ?? defaultQueryKey,
            queryFn: () => db.getCount<T>(doctype, filters, cache, debug),
        })
    }, [queryClient, queryKey, defaultQueryKey, doctype, filters, cache, debug, db])

    return preloadCall
}
