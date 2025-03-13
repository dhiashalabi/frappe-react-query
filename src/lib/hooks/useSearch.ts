import { useState, useContext } from 'react'
import { useEffect } from 'react'
import { Filter } from '../types'
import { SearchResult } from '../types'
import { useQuery } from '@tanstack/react-query'
import { FrappeContext } from '../context/FrappeContext'
import type { FrappeConfig } from '../types'

/**
 * Type for validate link response with dynamic fields
 */

/**
 * Hook to search for documents - only works with Frappe v15+
 *
 * @param doctype - name of the doctype (table) where we are performing our search
 * @param text - search text
 * @param filters - (optional) the results will be filtered based on these
 * @param limit - (optional) the number of results to return. Defaults to 20
 * @param debounce - (optional) the number of milliseconds to wait before making the API call. Defaults to 250ms.
 * @returns result - array of type SearchResult with a list of suggestions based on search text
 *
 * @example
 *
 * const [searchText, setSearchText] = useState("")
 * const { data, error, isFetching, mutate } = useSearch("User", searchText)
 */
export const useSearch = (
    doctype: string,
    text: string,
    filters: Filter[] = [],
    limit: number = 20,
    debounce: number = 250,
) => {
    const debouncedText = useDebounce(text, debounce)
    const { call } = useContext(FrappeContext) as FrappeConfig

    const query = useQuery<{ message: SearchResult[] }>({
        queryKey: ['search', doctype, debouncedText, filters, limit],
        queryFn: () =>
            call.get('frappe.desk.search.search_link', {
                doctype,
                page_length: limit,
                txt: debouncedText,
                filters: JSON.stringify(filters ?? []),
            }),
        enabled: debouncedText !== '',
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
 * Hook to debounce user input
 * @param value - the value to be debounced
 * @param delay - the number of milliseconds to wait before returning the value
 * @returns string value after the specified delay
 */
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}
