import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FrappeContext } from '../context/FrappeContext'
import type { FrappeConfig, ValidateLinkResponse } from '../types'

/**
 * Hook to validate a link
 * @param doctype - the doctype of the document
 * @param docname - the name of the document
 * @param fields - the fields to validate
 *
 * @returns Returns an object with the following properties: data, error, isFetching, mutate
 *
 * @example
 *
 * const { data, error, isFetching, mutate } = useValidateLink('DocType', 'name', ['field1', 'field2'])
 */
export const useValidateLink = <T extends string[]>(doctype: string, docname: string, fields: T) => {
    const { call } = useContext(FrappeContext) as FrappeConfig

    const query = useQuery<ValidateLinkResponse<T>>({
        queryKey: ['validateLink', doctype, docname, fields],
        queryFn: () => call.get('frappe.client.validate_link', { doctype, docname, fields }),
    })

    return {
        ...query,
        data: query.data,
        error: query.error,
        isFetching: query.isFetching,
        mutate: query.refetch,
    }
}
