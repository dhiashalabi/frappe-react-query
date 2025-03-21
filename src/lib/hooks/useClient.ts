import { FrappeContext } from '../context/FrappeContext'
import { FrappeError, GetCountResponse, GetDocListArgs } from '../types'
import { useContext } from 'react'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { getRequestURL, getDocListQueryString, getDocCountQueryString } from '../utils'
import { GetCountArgs, GetDocArgs } from '@mussnad/frappe-js-client/dist/client/types'
import { FrappeDocument } from '@mussnad/frappe-js-client/dist/frappe/types'

/**
 * Fetches a list of documents from the Frappe database.
 *
 * @param doctype - The name of the document type to fetch
 * @param args - The arguments for the fetch operation
 * @param queryKey - The query key for the fetch operation
 * @param options - The options for the fetch operation
 *
 * @returns An object with the following properties:
 *
 * @typeParam T - The type definition of the document object
 * @typeParam K - The type of the document for args
 *
 * @example
 * const { data, error, isFetching, mutate } = useGetList('DocType', { filters: [{ field: 'name', operator: 'like', value: 'test' }] })
 */
export const useGetList = <T extends FrappeDocument>(
    doctype: string,
    args?: GetDocListArgs<T>,
    queryKey?: readonly any[],
    options?: UseQueryOptions<T[], FrappeError>,
) => {
    const { url, client } = useContext(FrappeContext)

    const defaultQueryKey = ['frappe', doctype, args, `${getRequestURL(doctype, url)}?${getDocListQueryString(args)}`]

    const query = useQuery({
        queryKey: queryKey ?? defaultQueryKey,
        queryFn: () => client.getList<T>(doctype, args),
        ...options,
    })

    return query
}

/**
 * Fetches the count of documents from the Frappe database.
 *
 * @param doctype - The name of the document type to fetch
 * @param args - The arguments for the fetch operation
 * @param queryKey - The query key for the fetch operation
 * @param options - The options for the fetch operation
 *
 * @returns An object with the following properties:
 *
 * @typeParam T - The type definition of the document object
 * @typeParam K - The type of the document for args
 *
 * @example
 * const { data, error, isFetching, mutate } = useGetCount('DocType', { filters: [{ field: 'name', operator: 'like', value: 'test' }] })
 */
export const useGetCount = (
    doctype: string,
    args?: GetCountArgs,
    options?: UseQueryOptions<GetCountResponse, FrappeError>,
) => {
    const { url, client } = useContext(FrappeContext)

    const query = useQuery({
        queryKey: ['frappe', doctype, args, `${getRequestURL(doctype, url)}?${getDocCountQueryString(args)}`],
        queryFn: () => client.getCount(doctype, args),
        ...options,
    })

    return query
}

/**
 * Fetches a single document from the Frappe database.
 *
 * @param doctype - The name of the document type to fetch
 * @param name - The name of the document to fetch
 * @param options - The options for the fetch operation
 *
 * @returns An object with the following properties:
 *
 * @typeParam T - The type definition of the document object
 * @typeParam K - The type of the document for args
 *
 * @example
 * const { data, error, isFetching, mutate } = useGetDoc('DocType', 'name')
 */
export const useGetDoc = <T extends FrappeDocument = FrappeDocument>(
    doctype: string,
    name: string,
    args?: GetDocArgs<T>,
    options?: UseQueryOptions<T, FrappeError>,
) => {
    const { client } = useContext(FrappeContext)

    const query = useQuery({
        queryKey: ['frappe', doctype, name],
        queryFn: () => client.getDoc<T>(doctype, name, args),
        ...options,
    })

    return query
}
