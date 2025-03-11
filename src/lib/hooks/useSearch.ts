import { useState } from 'react'
import { useEffect } from 'react'
import { Filter } from '../types'
import { useFrappeGetCall } from './useAPI'
import { SearchResult } from '../types'

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
 * const { data, error, isLoading, mutate } = useSearch("User", searchText)
 */
export const useSearch = (
    doctype: string,
    text: string,
    filters: Filter[] = [],
    limit: number = 20,
    debounce: number = 250,
) => {
    const debouncedText = useDebounce(text, debounce)
    const swrResult = useFrappeGetCall<{ message: SearchResult[] }>('frappe.desk.search.search_link', {
        doctype,
        page_length: limit,
        txt: debouncedText,
        filters: JSON.stringify(filters ?? []),
    })
    return swrResult
}

/**
 * Hook to debounce user input
 * @param value - the value to be debounced
 * @param delay - the number of milliseconds to wait before returning the value
 * @returns string value after the specified delay
 */
const useDebounce = (value: unknown, delay: number) => {
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
