import { GetCountArgs } from '@mussnad/frappe-js-client/dist/client/types'
import { FrappeDoc, GetDocListArgs } from '../types'

export const getRequestURL = (doctype: string, url: string, docname?: string | null): string => {
    let requestURL = `${url}/api/resource/`
    if (docname) {
        requestURL += `${doctype}/${docname}`
    } else {
        requestURL += `${doctype}`
    }

    return requestURL
}

export const getDocListQueryString = (args?: GetDocListArgs<FrappeDoc<any>>): string => {
    let queryString = ''

    /** Fields to be fetched */
    if (args?.fields) {
        queryString += `fields=${JSON.stringify(args?.fields)}&`
    }

    /** Filters to be applied - SQL AND operation */
    if (args?.filters) {
        queryString += `filters=${JSON.stringify(args?.filters)}&`
    }

    /** Filters to be applied - SQL OR operation */
    if (args?.orFilters) {
        queryString += `or_filters=${JSON.stringify(args?.orFilters)}&`
    }

    /** Fetch from nth document in filtered and sorted list. Used for pagination  */
    if (args?.limit_start) {
        queryString += `limit_start=${JSON.stringify(args?.limit_start)}&`
    }

    /** Number of documents to be fetched. Default is 20  */
    if (args?.limit) {
        queryString += `limit=${JSON.stringify(args?.limit)}&`
    }

    if (args?.groupBy) {
        queryString += `group_by=${String(args.groupBy)}&`
    }

    /** Sort results by field and order  */
    if (args?.orderBy) {
        const orderByString = `${String(args.orderBy?.field)} ${args.orderBy?.order ?? 'asc'}`
        queryString += `order_by=${orderByString}&`
    }

    /** Fetch documents as a dictionary */
    if (args?.asDict) {
        queryString += `as_dict=${args.asDict}`
    }

    return queryString
}

export const getDocCountQueryString = (args?: GetCountArgs<any>): string => {
    let queryString = ''

    /** Filters to be applied - SQL AND operation */
    if (args?.filters) {
        queryString += `filters=${JSON.stringify(args?.filters)}&`
    }

    /** Debug mode */
    if (args?.debug) {
        queryString += `debug=${args.debug}`
    }

    /** Cache the result */
    if (args?.cache) {
        queryString += `cache=${args.cache}`
    }

    return queryString
}

export const encodeQueryData = (data: Record<string, any>) => {
    const ret = []
    for (const d in data) ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
    return ret.join('&')
}
