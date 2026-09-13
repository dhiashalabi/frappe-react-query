import type { LinkSearchResult, SearchLinkArgs, SearchWidgetArgs } from 'frappe-js-client'

import { useQuery } from '@tanstack/react-query'

import type { FrappeQueryOptions } from '../types'

import { frappeQueryOptions } from '../query/options'
import { useDebouncedValue } from './debounce'
import { useFrappe } from './useFrappe'

export function useFrappeSearchLink(
    doctype: string,
    text: string,
    args?: SearchLinkArgs,
    options?: FrappeQueryOptions<LinkSearchResult[]> & { debounce?: number },
) {
    const { client } = useFrappe()
    const { debounce = 250, ...query } = options ?? {}
    const debouncedText = useDebouncedValue(text, debounce)
    return useQuery(frappeQueryOptions.search.searchLink(client, doctype, debouncedText, args, query))
}

export function useFrappeSearchWidget<T = unknown>(
    doctype: string,
    text: string,
    args?: SearchWidgetArgs,
    options?: FrappeQueryOptions<T> & { debounce?: number },
) {
    const { client } = useFrappe()
    const { debounce = 250, ...query } = options ?? {}
    const debouncedText = useDebouncedValue(text, debounce)
    return useQuery(frappeQueryOptions.search.searchWidget<T>(client, doctype, debouncedText, args, query))
}

export function useFrappeGetLinkTitle(doctype: string, name: string | number, options?: FrappeQueryOptions<string>) {
    const { client } = useFrappe()
    return useQuery(frappeQueryOptions.search.getLinkTitle(client, doctype, name, options))
}
