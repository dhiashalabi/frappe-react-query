import type {
    InfiniteData,
    QueryKey,
    UseInfiniteQueryOptions,
    UseMutationOptions,
    UseQueryOptions,
} from '@tanstack/react-query'
import type { DocFromMap, FrappeClient, FrappeError } from 'frappe-js-client'

/**
 * Augment this interface in the consuming app so hooks infer DocType maps from codegen:
 *
 * ```ts
 * declare module 'frappe-react-query' {
 *     interface Register {
 *         docs: import('./frappe.generated').Docs
 *     }
 * }
 * ```
 */
// Module-augmentation target — consumers add `docs`.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Register {
    // consumers augment `docs`
}

export type RegisteredDocs = Register extends { docs: infer D extends object } ? D : object

/** Any string when no codegen map is registered; otherwise a key of that map. */
export type DocTypeName<Docs extends object> = [keyof Docs] extends [never] ? string : string & keyof Docs

export type RegisteredDoc<Docs extends object, K extends string> = DocFromMap<Docs, K>

export type FrappeQueryOptions<TData> = Omit<
    UseQueryOptions<TData, FrappeError, TData, QueryKey>,
    'queryKey' | 'queryFn'
> & {
    /** Subscribe via `FrappeProvider`'s `realtime` instance and invalidate this query on updates. */
    realtime?: boolean
}

export type FrappeInfiniteQueryOptions<TPage> = Omit<
    UseInfiniteQueryOptions<TPage, FrappeError, InfiniteData<TPage, number>, QueryKey, number>,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
> & {
    realtime?: boolean
}

export type FrappeMutationOptions<TData, TVariables> = Omit<
    UseMutationOptions<TData, FrappeError, TVariables>,
    'mutationFn'
>

/** `FrappeClient` is invariant in its DocType map; query helpers accept any client instance. */
export type AnyFrappeClient = FrappeClient<any>
