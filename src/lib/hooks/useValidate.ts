import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FrappeContext } from '../context/FrappeContext'
import type { FrappeConfig, ValidateLinkResponse } from '../types'

/**
 * Hook to validate a link
 * @param doctype - the doctype of the document
 * @param docname - the name of the document
 * @param fields - the fields to validate
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
        isValidating: query.isFetching,
        mutate: query.refetch,
    }
}
