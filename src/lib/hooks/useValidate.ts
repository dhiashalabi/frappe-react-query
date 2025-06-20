import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FrappeContext } from '../context/FrappeContext'
import { FrappeDoc } from 'frappe-js-client/dist/frappe/types'

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
export const useValidateLink = <T extends FrappeDoc<object>>(doctype: string, docname: string, fields: string[]) => {
    const { client } = useContext(FrappeContext)

    const query = useQuery({
        queryKey: ['validateLink', doctype, docname, fields],
        queryFn: () => client.validateLink<T>(doctype, docname, fields),
    })

    return query
}
