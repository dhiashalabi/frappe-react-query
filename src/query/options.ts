import type { FrappeClient } from 'frappe-js-client'
import type {
    ApiArgs,
    DocFromMap,
    FieldName,
    FieldsArg,
    FrappeDoc,
    GetCountArgs,
    GetDocArgs,
    GetDocListArgs,
    GetDocListPage,
    GetLastDocArgs,
    GetValueArgs,
    RowFor,
    SearchLinkArgs,
    SearchWidgetArgs,
} from 'frappe-js-client'

import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'

import type { AnyFrappeClient, DocTypeName, FrappeInfiniteQueryOptions, FrappeQueryOptions } from '../types'

import { frappeQueryKeys } from './keys'
import { withoutRealtime } from './merge'

export const DEFAULT_PAGE_SIZE = 20

function withEnabled<TData>(baseEnabled: boolean, options?: FrappeQueryOptions<TData>) {
    const rest = withoutRealtime(options)
    const enabled = rest?.enabled
    return {
        ...rest,
        enabled: typeof enabled === 'function' ? enabled : baseEnabled && (enabled ?? true),
    }
}

function getDocOptions<Docs extends object, K extends DocTypeName<Docs>>(
    client: FrappeClient<Docs>,
    doctype: K,
    name: string,
    args?: GetDocArgs,
    options?: FrappeQueryOptions<DocFromMap<Docs, K>>,
) {
    return queryOptions({
        queryKey: frappeQueryKeys.db.doc(doctype, name, args),
        queryFn: ({ signal }) => client.db.getDoc(doctype, name, args, { signal }),
        ...withEnabled(!!name, options as FrappeQueryOptions<DocFromMap<Docs, K>>),
    })
}

function getDocListOptions<
    Docs extends object,
    K extends DocTypeName<Docs>,
    T extends DocFromMap<Docs, K> = DocFromMap<Docs, K>,
    F extends FieldsArg<T> = '*',
>(
    client: FrappeClient<Docs>,
    doctype: K,
    args?: GetDocListArgs<T, F>,
    options?: FrappeQueryOptions<RowFor<T, F>[]>,
) {
    return queryOptions({
        queryKey: frappeQueryKeys.db.list(doctype, args),
        queryFn: ({ signal }) => client.db.getDocList(doctype, args, { signal }),
        ...withoutRealtime(options as FrappeQueryOptions<RowFor<T, F>[]>),
    })
}

function getDocListInfiniteOptions<
    Docs extends object,
    K extends DocTypeName<Docs>,
    T extends DocFromMap<Docs, K> = DocFromMap<Docs, K>,
    F extends FieldsArg<T> = '*',
>(
    client: FrappeClient<Docs>,
    doctype: K,
    args?: GetDocListArgs<T, F>,
    options?: FrappeInfiniteQueryOptions<GetDocListPage<RowFor<T, F>>>,
) {
    const { start: initialStart, ...keyArgs } = args ?? {}
    const limit = args?.limit ?? DEFAULT_PAGE_SIZE
    return infiniteQueryOptions({
        queryKey: frappeQueryKeys.db.listInfinite(doctype, keyArgs),
        queryFn: ({ pageParam, signal }) =>
            client.db.getDocListPage(doctype, { ...args, start: pageParam, limit }, { signal }),
        initialPageParam: initialStart ?? 0,
        getNextPageParam: (lastPage, _pages, lastPageParam) => {
            if (lastPage.hasNextPage === false) return undefined
            if (lastPage.hasNextPage !== true && lastPage.data.length < limit) return undefined
            return lastPageParam + limit
        },
        ...withoutRealtime(options),
    })
}

export const frappeQueryOptions = {
    db: {
        getDoc: getDocOptions,
        getDocList: getDocListOptions,
        getDocListInfinite: getDocListInfiniteOptions,
        getCount: <Docs extends object = object, T extends object = object>(
            client: FrappeClient<Docs>,
            doctype: DocTypeName<Docs>,
            args?: GetCountArgs<T>,
            options?: FrappeQueryOptions<number>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.db.count(doctype, args),
                queryFn: ({ signal }) => client.db.getCount(doctype, args, { signal }),
                ...withoutRealtime(options),
            }),
        getLastDoc: <Docs extends object = object, K extends DocTypeName<Docs> = DocTypeName<Docs>>(
            client: FrappeClient<Docs>,
            doctype: K,
            args?: GetLastDocArgs<DocFromMap<Docs, K>>,
            options?: FrappeQueryOptions<DocFromMap<Docs, K> | null>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.db.last(doctype, args),
                queryFn: ({ signal }) => client.db.getLastDoc(doctype, args, { signal }),
                ...withoutRealtime(options),
            }),
        exists: <Docs extends object = object>(
            client: FrappeClient<Docs>,
            doctype: DocTypeName<Docs>,
            name: string,
            options?: FrappeQueryOptions<boolean>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.db.exists(doctype, name),
                queryFn: ({ signal }) => client.db.exists(doctype, name, { signal }),
                ...withEnabled(!!name, options),
            }),
        getValue: <Docs extends object = object, T = unknown>(
            client: FrappeClient<Docs>,
            doctype: DocTypeName<Docs>,
            fieldName: FieldName,
            args?: GetValueArgs,
            options?: FrappeQueryOptions<T>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.db.value(doctype, fieldName, args),
                queryFn: ({ signal }) => client.db.getValue<T>(doctype, fieldName, args, { signal }),
                ...withoutRealtime(options),
            }),
        getSingle: <Docs extends object = object, K extends DocTypeName<Docs> = DocTypeName<Docs>>(
            client: FrappeClient<Docs>,
            doctype: K,
            options?: FrappeQueryOptions<DocFromMap<Docs, K>>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.db.single(doctype),
                queryFn: ({ signal }) => client.db.getSingle(doctype, { signal }),
                ...withoutRealtime(options),
            }),
        getSingleValue: <Docs extends object = object, T = unknown>(
            client: FrappeClient<Docs>,
            doctype: DocTypeName<Docs>,
            field: string,
            options?: FrappeQueryOptions<T>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.db.singleValue(doctype, field),
                queryFn: ({ signal }) => client.db.getSingleValue<T>(doctype, field, { signal }),
                ...withoutRealtime(options),
            }),
        getMeta: <T = unknown>(client: AnyFrappeClient, doctype: string, options?: FrappeQueryOptions<T>) =>
            queryOptions({
                queryKey: frappeQueryKeys.db.meta(doctype),
                queryFn: ({ signal }) => client.db.getMeta<T>(doctype, { signal }),
                ...withoutRealtime(options),
            }),
        copyDoc: <T extends FrappeDoc<object>>(
            client: AnyFrappeClient,
            doctype: string,
            name: string,
            ignoreNoCopy = true,
            options?: FrappeQueryOptions<T>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.db.copy(doctype, name, ignoreNoCopy),
                queryFn: ({ signal }) => client.db.copyDoc<T>(doctype, name, ignoreNoCopy, { signal }),
                ...withEnabled(!!name, options),
            }),
        validateLink: <T = Record<string, string>>(
            client: AnyFrappeClient,
            doctype: string,
            name: string,
            fields: string[] = ['name'],
            options?: FrappeQueryOptions<T>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.db.validateLink(doctype, name, fields),
                queryFn: ({ signal }) => client.db.validateLink<T>(doctype, name, fields, { signal }),
                ...withEnabled(!!name, options),
            }),
        validateLinkAndFetch: <T = Record<string, string>>(
            client: AnyFrappeClient,
            doctype: string,
            name: string,
            fieldsToFetch: string[],
            args?: { filters?: unknown },
            options?: FrappeQueryOptions<T>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.db.validateLinkAndFetch(doctype, name, fieldsToFetch, args),
                queryFn: ({ signal }) =>
                    client.db.validateLinkAndFetch<T>(doctype, name, fieldsToFetch, args, { signal }),
                ...withEnabled(!!name && fieldsToFetch.length > 0, options),
            }),
        isDocumentAmended: (
            client: AnyFrappeClient,
            doctype: string,
            name: string | number,
            options?: FrappeQueryOptions<boolean>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.db.amended(doctype, name),
                queryFn: ({ signal }) => client.db.isDocumentAmended(doctype, name, { signal }),
                ...withEnabled(name !== '' && name !== undefined && name !== null, options),
            }),
    },
    auth: {
        loggedUser: (client: AnyFrappeClient, options?: FrappeQueryOptions<string>) =>
            queryOptions({
                queryKey: frappeQueryKeys.auth.loggedUser,
                queryFn: ({ signal }) => client.auth.getLoggedUser({ signal }),
                ...withoutRealtime(options),
            }),
        ping: (client: AnyFrappeClient, options?: FrappeQueryOptions<string>) =>
            queryOptions({
                queryKey: frappeQueryKeys.auth.ping,
                queryFn: ({ signal }) => client.auth.ping({ signal }),
                ...withoutRealtime(options),
            }),
    },
    call: {
        get: <T = unknown>(client: AnyFrappeClient, method: string, args?: ApiArgs, options?: FrappeQueryOptions<T>) =>
            queryOptions({
                queryKey: frappeQueryKeys.call.get(method, args),
                queryFn: ({ signal }) => client.call.get<T>(method, args, { signal }),
                ...withoutRealtime(options),
            }),
    },
    search: {
        searchLink: (
            client: AnyFrappeClient,
            doctype: string,
            txt: string,
            args?: SearchLinkArgs,
            options?: FrappeQueryOptions<import('frappe-js-client').LinkSearchResult[]>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.search.link(doctype, txt, args),
                queryFn: ({ signal }) => client.search.searchLink(doctype, txt, args, { signal }),
                ...withEnabled(txt !== '', options),
            }),
        searchWidget: <T = unknown>(
            client: AnyFrappeClient,
            doctype: string,
            txt: string,
            args?: SearchWidgetArgs,
            options?: FrappeQueryOptions<T>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.search.widget(doctype, txt, args),
                queryFn: ({ signal }) => client.search.searchWidget<T>(doctype, txt, args, { signal }),
                ...withEnabled(txt !== '', options),
            }),
        getLinkTitle: (
            client: AnyFrappeClient,
            doctype: string,
            name: string | number,
            options?: FrappeQueryOptions<string>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.search.title(doctype, name),
                queryFn: ({ signal }) => client.search.getLinkTitle(doctype, name, { signal }),
                ...withEnabled(name !== '' && name !== undefined && name !== null, options),
            }),
    },
}
