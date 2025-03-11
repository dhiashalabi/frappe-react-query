import { useCallback, useContext, useState } from 'react'
import useSWR, { Key, SWRConfiguration, SWRResponse, preload } from 'swr'
import { FrappeConfig, FrappeDoc, GetDocListArgs, Filter, FrappeError as Error } from '../types'
import { FrappeContext } from '../context/FrappeProvider'
import { getRequestURL, getDocListQueryString, encodeQueryData } from '../utils'

/**
 * Hook to fetch a document from the database
 *
 * @param doctype - The doctype to fetch
 * @param name - the name of the document to fetch
 * @param options [Optional] SWRConfiguration options for fetching data
 * @returns an object (SWRResponse) with the following properties: data, error, isValidating, and mutate
 *
 * @typeParam T - The type of the document
 */
export const useFrappeGetDoc = <T = any>(
    doctype: string,
    name?: string,
    swrKey?: Key,
    options?: SWRConfiguration,
): SWRResponse<FrappeDoc<T>, Error> => {
    const { url, db } = useContext(FrappeContext) as FrappeConfig

    const swrResult = useSWR<FrappeDoc<T>, Error>(
        swrKey === undefined ? getRequestURL(doctype, url, name) : swrKey,
        () => db.getDoc<T>(doctype, name),
        options,
    )

    return swrResult
}

/**
 * Hook to prefetch a document from the database
 * @param doctype - The doctype to fetch
 * @param name - The name of the document to fetch
 * @param swrKey - The SWRKey to use for caching the result - optional
 * @param options - The SWRConfiguration options for fetching data
 * @returns A function to prefetch the document
 */
export const useFrappePrefetchDoc = <T = any>(
    doctype: string,
    name?: string,
    swrKey?: Key,
    // @ts-ignore
    options?: SWRConfiguration,
) => {
    const { db, url } = useContext(FrappeContext) as FrappeConfig
    const key = swrKey === undefined ? getRequestURL(doctype, url, name) : swrKey
    const preloadCall = useCallback(() => {
        preload(key, () => db.getDoc<T>(doctype, name))
    }, [key, doctype, name])
    return preloadCall
}

/**
 * Hook to fetch a list of documents from the database
 *
 * @param doctype Name of the doctype to fetch
 * @param args Arguments to pass (filters, pagination, etc)
 * @param options [Optional] SWRConfiguration options for fetching data
 * @returns an object (SWRResponse) with the following properties: data, error, isValidating, and mutate
 *
 * @typeParam T - The type definition of the document object
 */
export const useFrappeGetDocList = <T = any, K = FrappeDoc<T>>(
    doctype: string,
    args?: GetDocListArgs<K>,
    swrKey?: Key,
    options?: SWRConfiguration,
) => {
    const { url, db } = useContext(FrappeContext) as FrappeConfig

    const swrResult = useSWR<T[], Error>(
        swrKey === undefined ? `${getRequestURL(doctype, url)}?${getDocListQueryString(args)}` : swrKey,
        () => db.getDocList<T, K>(doctype, args),
        options,
    )

    return swrResult
}

/**
 * Hook to prefetch a list of documents from the database
 * @param doctype - The doctype to fetch
 * @param args - The arguments to pass to the getDocList method
 * @param swrKey - The SWRKey to use for caching the result - optional
 * @returns A function to prefetch the list of documents
 */
export const useFrappePrefetchDocList = <T = any>(doctype: string, args?: GetDocListArgs<T>, swrKey?: Key) => {
    const { db, url } = useContext(FrappeContext) as FrappeConfig
    const key = swrKey === undefined ? `${getRequestURL(doctype, url)}?${getDocListQueryString(args)}` : swrKey

    const preloadCall = useCallback(() => {
        preload(key, () => db.getDocList<T>(doctype, args))
    }, [key, doctype, args])

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
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [isCompleted, setIsCompleted] = useState(false)

    const reset = useCallback(() => {
        setLoading(false)
        setError(null)
        setIsCompleted(false)
    }, [])

    const createDoc = useCallback(async (doctype: string, doc: T) => {
        setError(null)
        setIsCompleted(false)
        setLoading(true)

        return db
            .createDoc<T>(doctype, doc)
            .then((document) => {
                setLoading(false)
                setIsCompleted(true)
                return document
            })
            .catch((error) => {
                setLoading(false)
                setIsCompleted(false)
                setError(error)
                throw error
            })
    }, [])

    return {
        createDoc,
        loading,
        error,
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
    /** Will be true if document is created. Else false */
    isCompleted: boolean
    /** Function to reset the state of the hook */
    reset: () => void
} => {
    const { db } = useContext(FrappeContext) as FrappeConfig
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [isCompleted, setIsCompleted] = useState(false)

    const reset = useCallback(() => {
        setLoading(false)
        setError(null)
        setIsCompleted(false)
    }, [])

    const updateDoc = useCallback(async (doctype: string, docname: string | null, doc: Partial<T>) => {
        setError(null)
        setIsCompleted(false)
        setLoading(true)
        return db
            .updateDoc<T>(doctype, docname, doc)
            .then((document) => {
                setLoading(false)
                setIsCompleted(true)
                return document
            })
            .catch((error) => {
                setLoading(false)
                setIsCompleted(false)
                setError(error)
                throw error
            })
    }, [])

    return {
        updateDoc,
        loading,
        error,
        reset,
        isCompleted,
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
    /** Will be true if document is created. Else false */
    isCompleted: boolean
    /** Function to reset the state of the hook */
    reset: () => void
} => {
    const { db } = useContext(FrappeContext) as FrappeConfig
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [isCompleted, setIsCompleted] = useState(false)

    const reset = useCallback(() => {
        setLoading(false)
        setError(null)
        setIsCompleted(false)
    }, [])

    const deleteDoc = useCallback(async (doctype: string, docname?: string | null): Promise<{ message: string }> => {
        setError(null)
        setIsCompleted(false)
        setLoading(true)

        return db
            .deleteDoc(doctype, docname)
            .then((message) => {
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
    }, [])

    return {
        deleteDoc,
        loading,
        error,
        reset,
        isCompleted,
    }
}

/**
 * Hook to fetch number of documents from the database
 *
 * @param doctype - The doctype to fetch
 * @param filters - filters to apply to the query
 * @param cache - Whether to cache the result or not. Defaults to false
 * @param debug - Whether to log debug messages or not. Defaults to false
 * @param options [Optional] SWRConfiguration options for fetching data
 * @returns an object (SWRResponse) with the following properties: data (number), error, isValidating, and mutate
 */
export const useFrappeGetDocCount = <T = any>(
    doctype: string,
    filters?: Filter<T>[],
    cache: boolean = false,
    debug: boolean = false,
    swrKey?: Key,
    options?: SWRConfiguration,
): SWRResponse<number, Error> => {
    const { url, db } = useContext(FrappeContext) as FrappeConfig
    const getUniqueURLKey = () => {
        const params = encodeQueryData(
            cache
                ? { doctype, filters: filters ?? [], cache, debug }
                : { doctype, filters: filters ?? [], debug: debug },
        )
        return `${url}/api/method/frappe.client.get_count?${params}`
    }
    const swrResult = useSWR<number, Error>(
        swrKey === undefined ? getUniqueURLKey() : swrKey,
        () => db.getCount(doctype, filters, cache, debug),
        options,
    )

    return swrResult
}

/**
 * Hook to prefetch the number of documents from the database
 * @param doctype - The doctype to fetch
 * @param filters - filters to apply to the query
 * @param cache - Whether to cache the result or not. Defaults to false
 * @param debug - Whether to log debug messages or not. Defaults to false
 * @param swrKey - The SWRKey to use for caching the result - optional
 * @returns A function to prefetch the number of documents
 */
export const useFrappePrefetchDocCount = <T = any>(
    doctype: string,
    filters?: Filter<T>[],
    cache: boolean = false,
    debug: boolean = false,
    swrKey?: Key,
) => {
    const { db, url } = useContext(FrappeContext) as FrappeConfig
    const key =
        swrKey === undefined
            ? `${url}/api/method/frappe.client.get_count?${encodeQueryData({
                  doctype,
                  filters: filters ?? [],
                  cache,
                  debug,
              })}`
            : swrKey
    const preloadCall = useCallback(() => {
        preload(key, () => db.getCount<T>(doctype, filters, false, false))
    }, [key, doctype, filters])
    return preloadCall
}
