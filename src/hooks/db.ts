import type { UseQueryResult } from '@tanstack/react-query'
import type {
    DocFromMap,
    FieldName,
    FieldsArg,
    FrappeDoc,
    FrappeError,
    FrappeInsert,
    GetCountArgs,
    GetDocArgs,
    GetDocListArgs,
    GetDocListPage,
    GetLastDocArgs,
    GetValueArgs,
    RowFor,
    RunMethodArgs,
} from 'frappe-js-client'

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
    DocTypeName,
    FrappeInfiniteQueryOptions,
    FrappeMutationOptions,
    FrappeQueryOptions,
    RegisteredDocs,
} from '../types'

import { useFrappeDocLive, useFrappeDocTypeLive } from '../live'
import { invalidateDoctype, removeCachedDoc, setCachedDoc } from '../query/invalidation'
import { mergeMutationOptions } from '../query/merge'
import { frappeQueryOptions } from '../query/options'
import { useFrappe } from './useFrappe'

export function useFrappeGetDoc<K extends DocTypeName<RegisteredDocs>>(
    doctype: K,
    name: string,
    args?: GetDocArgs,
    options?: FrappeQueryOptions<DocFromMap<RegisteredDocs, K>>,
): UseQueryResult<DocFromMap<RegisteredDocs, K>, FrappeError>
export function useFrappeGetDoc<T extends FrappeDoc<object>>(
    doctype: string,
    name: string,
    args?: GetDocArgs,
    options?: FrappeQueryOptions<T>,
): UseQueryResult<T, FrappeError>
export function useFrappeGetDoc(
    doctype: string,
    name: string,
    args?: GetDocArgs,
    options?: FrappeQueryOptions<FrappeDoc<object>>,
) {
    const { client } = useFrappe()
    useFrappeDocLive(doctype, name, !!options?.realtime)
    return useQuery(
        frappeQueryOptions.db.getDoc(client, doctype as DocTypeName<RegisteredDocs>, name, args, options as never),
    )
}

export function useFrappeGetDocList<
    K extends DocTypeName<RegisteredDocs>,
    T extends DocFromMap<RegisteredDocs, K> = DocFromMap<RegisteredDocs, K>,
    F extends FieldsArg<T> = '*',
>(
    doctype: K,
    args?: GetDocListArgs<T, F>,
    options?: FrappeQueryOptions<RowFor<T, F>[]>,
): UseQueryResult<RowFor<T, F>[], FrappeError>
export function useFrappeGetDocList<T extends FrappeDoc<object>, F extends FieldsArg<T> = '*'>(
    doctype: string,
    args?: GetDocListArgs<T, F>,
    options?: FrappeQueryOptions<RowFor<T, F>[]>,
): UseQueryResult<RowFor<T, F>[], FrappeError>
export function useFrappeGetDocList(
    doctype: string,
    args?: GetDocListArgs,
    options?: FrappeQueryOptions<FrappeDoc<object>[]>,
) {
    const { client } = useFrappe()
    useFrappeDocTypeLive(doctype, !!options?.realtime)
    return useQuery(
        frappeQueryOptions.db.getDocList(client, doctype as DocTypeName<RegisteredDocs>, args as never, options as never),
    )
}

export function useFrappeGetDocListInfinite<
    K extends DocTypeName<RegisteredDocs>,
    T extends DocFromMap<RegisteredDocs, K> = DocFromMap<RegisteredDocs, K>,
    F extends FieldsArg<T> = '*',
>(doctype: K, args?: GetDocListArgs<T, F>, options?: FrappeInfiniteQueryOptions<GetDocListPage<RowFor<T, F>>>) {
    const { client } = useFrappe()
    useFrappeDocTypeLive(doctype, !!options?.realtime)
    return useInfiniteQuery(
        frappeQueryOptions.db.getDocListInfinite(
            client,
            doctype as DocTypeName<RegisteredDocs>,
            args as never,
            options as never,
        ),
    )
}

export function useFrappeGetCount<T extends object = object>(
    doctype: DocTypeName<RegisteredDocs>,
    args?: GetCountArgs<T>,
    options?: FrappeQueryOptions<number>,
) {
    const { client } = useFrappe()
    return useQuery(frappeQueryOptions.db.getCount(client, doctype, args, options))
}

export function useFrappeGetLastDoc<K extends DocTypeName<RegisteredDocs>>(
    doctype: K,
    args?: GetLastDocArgs<DocFromMap<RegisteredDocs, K>>,
    options?: FrappeQueryOptions<DocFromMap<RegisteredDocs, K> | null>,
) {
    const { client } = useFrappe()
    return useQuery(frappeQueryOptions.db.getLastDoc(client, doctype, args, options))
}

export function useFrappeExists(
    doctype: DocTypeName<RegisteredDocs>,
    name: string,
    options?: FrappeQueryOptions<boolean>,
) {
    const { client } = useFrappe()
    return useQuery(frappeQueryOptions.db.exists(client, doctype, name, options))
}

export function useFrappeGetValue<T = unknown>(
    doctype: DocTypeName<RegisteredDocs>,
    fieldName: FieldName,
    args?: GetValueArgs,
    options?: FrappeQueryOptions<T>,
) {
    const { client } = useFrappe()
    return useQuery(frappeQueryOptions.db.getValue(client, doctype, fieldName, args, options))
}

export function useFrappeGetSingle<K extends DocTypeName<RegisteredDocs>>(
    doctype: K,
    options?: FrappeQueryOptions<DocFromMap<RegisteredDocs, K>>,
) {
    const { client } = useFrappe()
    return useQuery(frappeQueryOptions.db.getSingle(client, doctype, options))
}

export function useFrappeGetSingleValue<T = unknown>(
    doctype: DocTypeName<RegisteredDocs>,
    field: string,
    options?: FrappeQueryOptions<T>,
) {
    const { client } = useFrappe()
    return useQuery(frappeQueryOptions.db.getSingleValue(client, doctype, field, options))
}

export function useFrappeGetMeta<T = unknown>(doctype: string, options?: FrappeQueryOptions<T>) {
    const { client } = useFrappe()
    return useQuery(frappeQueryOptions.db.getMeta<T>(client, doctype, options))
}

export function useFrappeCopyDoc<T extends FrappeDoc<object>>(
    doctype: string,
    name: string,
    ignoreNoCopy = true,
    options?: FrappeQueryOptions<T>,
) {
    const { client } = useFrappe()
    return useQuery(frappeQueryOptions.db.copyDoc<T>(client, doctype, name, ignoreNoCopy, options))
}

export function useFrappeValidateLink<T = Record<string, string>>(
    doctype: string,
    name: string,
    fields: string[] = ['name'],
    options?: FrappeQueryOptions<T>,
) {
    const { client } = useFrappe()
    return useQuery(frappeQueryOptions.db.validateLink<T>(client, doctype, name, fields, options))
}

export function useFrappeValidateLinkAndFetch<T = Record<string, string>>(
    doctype: string,
    name: string,
    fieldsToFetch: string[],
    args?: { filters?: unknown },
    options?: FrappeQueryOptions<T>,
) {
    const { client } = useFrappe()
    return useQuery(frappeQueryOptions.db.validateLinkAndFetch<T>(client, doctype, name, fieldsToFetch, args, options))
}

export function useFrappeIsDocumentAmended(
    doctype: string,
    name: string | number,
    options?: FrappeQueryOptions<boolean>,
) {
    const { client } = useFrappe()
    return useQuery(frappeQueryOptions.db.isDocumentAmended(client, doctype, name, options))
}

export interface CreateDocVariables<K extends DocTypeName<RegisteredDocs> = DocTypeName<RegisteredDocs>> {
    doctype: K
    doc: FrappeInsert<DocFromMap<RegisteredDocs, K>> | Record<string, unknown>
}

export function useFrappeCreateDoc<K extends DocTypeName<RegisteredDocs> = DocTypeName<RegisteredDocs>>(
    options?: FrappeMutationOptions<DocFromMap<RegisteredDocs, K>, CreateDocVariables<K>>,
) {
    const { client } = useFrappe()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ doctype, doc }) =>
                    client.db.createDoc(doctype, doc as Record<string, unknown>) as Promise<
                        DocFromMap<RegisteredDocs, K>
                    >,
                onSuccess: (data, { doctype }) => {
                    if (data?.name) setCachedDoc(queryClient, doctype, data.name, data)
                    return invalidateDoctype(queryClient, doctype)
                },
            },
            options,
        ),
    )
    return { ...mutation, createDoc: mutation.mutateAsync }
}

export interface UpdateDocVariables<K extends DocTypeName<RegisteredDocs> = DocTypeName<RegisteredDocs>> {
    doctype: K
    name: string
    doc: Partial<DocFromMap<RegisteredDocs, K>> | Record<string, unknown>
}

export function useFrappeUpdateDoc<K extends DocTypeName<RegisteredDocs> = DocTypeName<RegisteredDocs>>(
    options?: FrappeMutationOptions<DocFromMap<RegisteredDocs, K>, UpdateDocVariables<K>>,
) {
    const { client } = useFrappe()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ doctype, name, doc }) =>
                    client.db.updateDoc(doctype, name, doc) as Promise<DocFromMap<RegisteredDocs, K>>,
                onSuccess: (data, { doctype, name }) => {
                    if (data?.name) setCachedDoc(queryClient, doctype, data.name, data)
                    else removeCachedDoc(queryClient, doctype, name)
                    return invalidateDoctype(queryClient, doctype)
                },
            },
            options,
        ),
    )
    return { ...mutation, updateDoc: mutation.mutateAsync }
}

export interface DeleteDocVariables<K extends DocTypeName<RegisteredDocs> = DocTypeName<RegisteredDocs>> {
    doctype: K
    name: string
}

export function useFrappeDeleteDoc(options?: FrappeMutationOptions<void, DeleteDocVariables>) {
    const { client } = useFrappe()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ doctype, name }) => client.db.deleteDoc(doctype, name),
                onSuccess: (_data, { doctype, name }) => {
                    removeCachedDoc(queryClient, doctype, name)
                    return invalidateDoctype(queryClient, doctype)
                },
            },
            options,
        ),
    )
    return { ...mutation, deleteDoc: mutation.mutateAsync }
}

export interface SetValueVariables {
    doctype: string
    name: string
    fieldName: string | Record<string, unknown>
    value?: unknown
}

export function useFrappeSetValue<T extends FrappeDoc<object> = FrappeDoc<object>>(
    options?: FrappeMutationOptions<T, SetValueVariables>,
) {
    const { client } = useFrappe()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ doctype, name, fieldName, value }) =>
                    client.db.setValue<T>(doctype, name, fieldName, value),
                onSuccess: (data, { doctype, name }) => {
                    if (data?.name) setCachedDoc(queryClient, doctype, data.name, data)
                    else setCachedDoc(queryClient, doctype, name, data)
                    return invalidateDoctype(queryClient, doctype)
                },
            },
            options,
        ),
    )
    return { ...mutation, setValue: mutation.mutateAsync }
}

export interface SetSingleVariables {
    doctype: string
    values: Record<string, unknown>
}

export function useFrappeSetSingle<T extends FrappeDoc<object> = FrappeDoc<object>>(
    options?: FrappeMutationOptions<T, SetSingleVariables>,
) {
    const { client } = useFrappe()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ doctype, values }) => client.db.setSingle<T>(doctype, values),
                onSuccess: (data, { doctype }) => {
                    if (data?.name) setCachedDoc(queryClient, doctype, data.name, data)
                    return invalidateDoctype(queryClient, doctype)
                },
            },
            options,
        ),
    )
    return { ...mutation, setSingle: mutation.mutateAsync }
}

export interface RenameDocVariables {
    doctype: string
    oldName: string
    newName: string
    merge?: boolean
}

export function useFrappeRenameDoc(options?: FrappeMutationOptions<string, RenameDocVariables>) {
    const { client } = useFrappe()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ doctype, oldName, newName, merge }) =>
                    client.db.renameDoc(doctype, oldName, newName, merge),
                onSuccess: (_data, { doctype, oldName }) => {
                    removeCachedDoc(queryClient, doctype, oldName)
                    return invalidateDoctype(queryClient, doctype)
                },
            },
            options,
        ),
    )
    return { ...mutation, renameDoc: mutation.mutateAsync }
}

export function useFrappeSubmitDoc<T extends FrappeDoc<object> = FrappeDoc<object>>(
    options?: FrappeMutationOptions<T, T>,
) {
    const { client } = useFrappe()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: (doc) => client.db.submit<T>(doc),
                onSuccess: (data) => {
                    if (data?.doctype && data.name) setCachedDoc(queryClient, data.doctype, data.name, data)
                    if (data?.doctype) return invalidateDoctype(queryClient, data.doctype)
                },
            },
            options,
        ),
    )
    return { ...mutation, submit: mutation.mutateAsync }
}

export interface CancelDocVariables {
    doctype: string
    name: string
}

export function useFrappeCancelDoc<T extends FrappeDoc<object> = FrappeDoc<object>>(
    options?: FrappeMutationOptions<T, CancelDocVariables>,
) {
    const { client } = useFrappe()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ doctype, name }) => client.db.cancel<T>(doctype, name),
                onSuccess: (data, { doctype, name }) => {
                    if (data?.name) setCachedDoc(queryClient, doctype, data.name, data)
                    else removeCachedDoc(queryClient, doctype, name)
                    return invalidateDoctype(queryClient, doctype)
                },
            },
            options,
        ),
    )
    return { ...mutation, cancel: mutation.mutateAsync }
}

export interface RunMethodVariables {
    doctype: string
    name: string
    method: string
    args?: RunMethodArgs
}

export function useFrappeRunMethod<T = unknown>(options?: FrappeMutationOptions<T, RunMethodVariables>) {
    const { client } = useFrappe()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ doctype, name, method, args }) => client.db.runMethod<T>(doctype, name, method, args),
                onSuccess: (_data, { doctype }) => invalidateDoctype(queryClient, doctype),
            },
            options,
        ),
    )
    return { ...mutation, runMethod: mutation.mutateAsync }
}

export function useFrappeInsertMany<T extends FrappeDoc<object> = FrappeDoc<object>>(
    options?: FrappeMutationOptions<string[], Array<FrappeInsert<T> & { doctype: string }>>,
) {
    const { client } = useFrappe()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: (docs) => client.db.insertMany<T>(docs),
                onSuccess: (_data, docs) => {
                    const doctypes = new Set(docs.map((row) => row.doctype).filter(Boolean))
                    return Promise.all([...doctypes].map((doctype) => invalidateDoctype(queryClient, doctype)))
                },
            },
            options,
        ),
    )
    return { ...mutation, insertMany: mutation.mutateAsync }
}

export function useFrappeUpdateMany<T extends FrappeDoc<object> = FrappeDoc<object>>(
    options?: FrappeMutationOptions<import('frappe-js-client').BulkUpdateResponse, T[]>,
) {
    const { client } = useFrappe()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: (docs) => client.db.updateMany<T>(docs),
                onSuccess: (_data, docs) => {
                    const doctypes = new Set(docs.map((doc) => doc.doctype).filter(Boolean))
                    return Promise.all([...doctypes].map((doctype) => invalidateDoctype(queryClient, doctype)))
                },
            },
            options,
        ),
    )
    return { ...mutation, updateMany: mutation.mutateAsync }
}

export interface GetPasswordVariables {
    doctype: string
    name: string | number
    fieldName: string
}

export function useFrappeGetPassword(options?: FrappeMutationOptions<string, GetPasswordVariables>) {
    const { client } = useFrappe()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ doctype, name, fieldName }) => client.db.getPassword(doctype, name, fieldName),
            },
            options,
        ),
    )
    return { ...mutation, getPassword: mutation.mutateAsync }
}
