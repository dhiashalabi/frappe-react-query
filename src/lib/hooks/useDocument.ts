import { useCallback, useContext, useState } from 'react'
import { GetDocListArgs } from '../types'
import { FrappeContext } from '../context/FrappeContext'
import { getRequestURL, getDocListQueryString } from '../utils'
import { useQuery, UseQueryOptions, useQueryClient, useMutation } from '@tanstack/react-query'
import { FrappeDoc, FrappeError } from '@mussnad/frappe-js-client/dist/frappe/types'

/**
 * Hook to fetch a document from the database
 *
 * @param doctype - The doctype to fetch
 * @param name - the name of the document to fetch
 * @param queryKey - The queryKey to use for caching the result - optional
 * @param options [Optional] UseQueryOptions options for fetching data
 *
 * @returns an object with the following properties: data, error, isFetching, and mutate
 *
 * @typeParam T - The type of the document
 *
 * @example
 *
 * const { data, error, isFetching, mutate } = useFrappeGetDoc('DocType', 'name')
 */
export const useFrappeGetDoc = <T extends FrappeDoc<object>>(
    doctype: string,
    name?: string,
    queryKey?: readonly any[],
    options?: UseQueryOptions<T, FrappeError>,
) => {
    const { url, db } = useContext(FrappeContext)
    const defaultQueryKey = ['frappe', doctype, name, getRequestURL(doctype, url, name)]

    const query = useQuery<T, FrappeError>({
        queryKey: queryKey ?? defaultQueryKey,
        queryFn: () => db.getDoc<T>(doctype, name),
        ...options,
    })

    return {
        ...query,
        data: query.data,
        error: query.error,
        isFetching: query.isFetching,
        mutate: query.refetch,
    }
}

/**
 * Hook to prefetch a document from the database
 * @param doctype - The doctype to fetch
 * @param name - The name of the document to fetch
 * @param queryKey - The queryKey to use for caching the result - optional
 *
 * @returns A function to prefetch the document
 *
 * @example
 *
 * const prefetch = useFrappePrefetchDoc('DocType', 'name')
 */
export const useFrappePrefetchDoc = <T extends FrappeDoc<object>>(
    doctype: string,
    name?: string,
    queryKey?: readonly any[],
) => {
    const { db, url } = useContext(FrappeContext)
    const queryClient = useQueryClient()

    const preloadCall = useCallback(() => {
        const defaultQueryKey = ['frappe', doctype, name, getRequestURL(doctype, url, name)]
        return queryClient.prefetchQuery({
            queryKey: queryKey ?? defaultQueryKey,
            queryFn: () => db.getDoc<T>(doctype, name),
        })
    }, [queryClient, queryKey, doctype, name, db, url])

    return preloadCall
}

/**
 * Hook to fetch a list of documents from the database
 *
 * @param doctype Name of the doctype to fetch
 * @param args Arguments to pass (filters, pagination, etc)
 * @param queryKey Optional query key for caching
 * @param options [Optional] UseQueryOptions for React Query
 *
 * @returns an object with data, error, isFetching, and mutate properties
 *
 * @typeParam T - The type definition of the document object
 * @typeParam K - The type of the document for args
 *
 * @example
 *
 * const { data, error, isFetching, mutate } = useFrappeGetDocList('DocType', { filters: [{ field: 'name', operator: 'like', value: 'test' }] })
 */
export const useFrappeGetDocList = <T extends FrappeDoc<object>>(
    doctype: string,
    args?: GetDocListArgs<T>,
    queryKey?: readonly any[],
    options?: UseQueryOptions<T[], FrappeError>,
) => {
    const { url, db } = useContext(FrappeContext)

    const defaultQueryKey = ['frappe', doctype, args, `${getRequestURL(doctype, url)}?${getDocListQueryString(args)}`]

    const query = useQuery<T[], FrappeError>({
        queryKey: queryKey ?? defaultQueryKey,
        queryFn: () => db.getDocList<T>(doctype, args),
        ...options,
    })

    return {
        ...query,
        data: query.data,
        error: query.error,
        isFetching: query.isFetching,
        mutate: query.refetch,
    }
}

/**
 * Hook to prefetch a list of documents from the database
 * @param doctype - The doctype to fetch
 * @param args - The arguments to pass to the getDocList method
 * @param queryKey - The queryKey to use for caching the result - optional
 *
 * @returns A function to prefetch the list of documents
 *
 * @example
 *
 * const prefetch = useFrappePrefetchDocList('DocType', { filters: [{ field: 'name', operator: 'like', value: 'test' }] })
 */
export const useFrappePrefetchDocList = <T extends FrappeDoc<object>>(
    doctype: string,
    args?: GetDocListArgs<T>,
    queryKey?: readonly any[],
) => {
    const { db, url } = useContext(FrappeContext)
    const queryClient = useQueryClient()

    const preloadCall = useCallback(() => {
        const defaultQueryKey = [
            'frappe',
            doctype,
            args,
            `${getRequestURL(doctype, url)}?${getDocListQueryString(args)}`,
        ]
        return queryClient.prefetchQuery({
            queryKey: queryKey ?? defaultQueryKey,
            queryFn: () => db.getDocList<T>(doctype, args),
        })
    }, [queryClient, queryKey, doctype, args, db, url])

    return preloadCall
}

/**
 * Hook to create a document in the database and maintain loading and error states
 * @returns Object with the following properties: loading, error, isCompleted and createDoc and reset functions
 *
 * @example
 *
 * const { createDoc, loading, error, isCompleted, reset } = useFrappeCreateDoc()
 */
export const useFrappeCreateDoc = <T extends FrappeDoc<object>>(): {
    /** Function to create a document in the database */
    createDoc: (doctype: string, doc: T) => Promise<T>
    /** Will be true when the API request is pending.  */
    loading: boolean
    /** Error object returned from API call */
    error: FrappeError | null | undefined
    /** Will be true if document is created. Else false */
    isCompleted: boolean
    /** Function to reset the state of the hook */
    reset: () => void
} => {
    const { db } = useContext(FrappeContext)
    const [isCompleted, setIsCompleted] = useState(false)

    const mutation = useMutation<T, FrappeError, { doctype: string; doc: T }>({
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
 *
 * @example
 *
 * const { updateDoc, loading, error, isCompleted, reset } = useFrappeUpdateDoc()
 */
export const useFrappeUpdateDoc = <T extends FrappeDoc<object>>(): {
    /** Function to update a document in the database */
    updateDoc: (doctype: string, docname: string | null, doc: Partial<T>) => Promise<T>
    /** Will be true when the API request is pending.  */
    loading: boolean
    /** Error object returned from API call */
    error: FrappeError | null | undefined
    /** Will be true if document is updated. Else false */
    isCompleted: boolean
    /** Function to reset the state of the hook */
    reset: () => void
} => {
    const { db } = useContext(FrappeContext)
    const [isCompleted, setIsCompleted] = useState(false)

    const mutation = useMutation<T, FrappeError, { doctype: string; docname: string | null; doc: Partial<T> }>({
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
 *
 * @example
 *
 * const { deleteDoc, loading, error, isCompleted, reset } = useFrappeDeleteDoc()
 */
export const useFrappeDeleteDoc = (): {
    /** Function to delete a document in the database. Returns a promise which resolves to an object with message "ok" if successful */
    deleteDoc: (doctype: string, docname?: string | null) => Promise<string>
    /** Will be true when the API request is pending.  */
    loading: boolean
    /** Error object returned from API call */
    error: FrappeError | null | undefined
    /** Will be true if document is deleted. Else false */
    isCompleted: boolean
    /** Function to reset the state of the hook */
    reset: () => void
} => {
    const { db } = useContext(FrappeContext)
    const [isCompleted, setIsCompleted] = useState(false)

    const mutation = useMutation<string, FrappeError, { doctype: string; docname?: string | null }>({
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
