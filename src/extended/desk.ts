import type {
    AddCommentArgs,
    AssignArgs,
    AssignmentRow,
    AssignMultipleArgs,
    CommentDoc,
    DocShare,
    SetSharePermissionArgs,
    ShareArgs,
} from 'frappe-js-client/extended'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { FrappeMutationOptions, FrappeQueryOptions } from '../types'

import { invalidateCachedDoc } from '../query/invalidation'
import { frappeQueryKeys } from '../query/keys'
import { mergeMutationOptions } from '../query/merge'
import { useExtendedClient } from './assert'
import { frappeExtendedQueryOptions } from './options'

export function useFrappeGetComments(doctype: string, name: string, options?: FrappeQueryOptions<CommentDoc[]>) {
    const client = useExtendedClient()
    return useQuery(frappeExtendedQueryOptions.desk.getComments(client, doctype, name, options))
}

export function useFrappeAddComment(options?: FrappeMutationOptions<CommentDoc, AddCommentArgs>) {
    const client = useExtendedClient()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: (args) => client.desk.addComment(args),
                onSuccess: (_data, args) =>
                    queryClient.invalidateQueries({
                        queryKey: frappeQueryKeys.desk.comments(args.referenceDoctype, args.referenceName),
                    }),
            },
            options,
        ),
    )
    return { ...mutation, addComment: mutation.mutateAsync }
}

export interface UpdateCommentVariables {
    name: string
    content: string
    referenceDoctype?: string
    referenceName?: string
}

export function useFrappeUpdateComment(options?: FrappeMutationOptions<unknown, UpdateCommentVariables>) {
    const client = useExtendedClient()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ name, content }) => client.desk.updateComment(name, content),
                onSuccess: (_data, vars) => {
                    if (vars.referenceDoctype && vars.referenceName) {
                        return queryClient.invalidateQueries({
                            queryKey: frappeQueryKeys.desk.comments(vars.referenceDoctype, vars.referenceName),
                        })
                    }
                },
            },
            options,
        ),
    )
    return { ...mutation, updateComment: mutation.mutateAsync }
}

export function useFrappeAssign(options?: FrappeMutationOptions<AssignmentRow[], AssignArgs>) {
    const client = useExtendedClient()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: (args) => client.desk.assign(args),
                onSuccess: (_data, args) => invalidateCachedDoc(queryClient, args.doctype, args.name),
            },
            options,
        ),
    )
    return { ...mutation, assign: mutation.mutateAsync }
}

export function useFrappeAssignMultiple(options?: FrappeMutationOptions<unknown, AssignMultipleArgs>) {
    const client = useExtendedClient()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: (args) => client.desk.assignMultiple(args),
                onSuccess: (_data, args) =>
                    Promise.all(args.names.map((name) => invalidateCachedDoc(queryClient, args.doctype, name))),
            },
            options,
        ),
    )
    return { ...mutation, assignMultiple: mutation.mutateAsync }
}

export interface UnassignVariables {
    doctype: string
    name: string
    assignTo: string
}

export function useFrappeUnassign(options?: FrappeMutationOptions<AssignmentRow[], UnassignVariables>) {
    const client = useExtendedClient()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ doctype, name, assignTo }) => client.desk.unassign(doctype, name, assignTo),
                onSuccess: (_data, { doctype, name }) => invalidateCachedDoc(queryClient, doctype, name),
            },
            options,
        ),
    )
    return { ...mutation, unassign: mutation.mutateAsync }
}

export function useFrappeCloseAssignment(options?: FrappeMutationOptions<AssignmentRow[], UnassignVariables>) {
    const client = useExtendedClient()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ doctype, name, assignTo }) => client.desk.closeAssignment(doctype, name, assignTo),
                onSuccess: (_data, { doctype, name }) => invalidateCachedDoc(queryClient, doctype, name),
            },
            options,
        ),
    )
    return { ...mutation, closeAssignment: mutation.mutateAsync }
}

export function useFrappeGetTags(doctype: string, txt = '', options?: FrappeQueryOptions<string[]>) {
    const client = useExtendedClient()
    return useQuery(frappeExtendedQueryOptions.desk.getTags(client, doctype, txt, options))
}

export function useFrappeGetTaggedDocs(doctype: string, tag: string, options?: FrappeQueryOptions<unknown>) {
    const client = useExtendedClient()
    return useQuery(frappeExtendedQueryOptions.desk.getTaggedDocs(client, doctype, tag, options))
}

export interface AddTagVariables {
    tag: string
    doctype: string
    name: string
    color?: string
}

export function useFrappeAddTag(options?: FrappeMutationOptions<string, AddTagVariables>) {
    const client = useExtendedClient()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ tag, doctype, name, color }) => client.desk.addTag(tag, doctype, name, color),
                onSuccess: (_data, { doctype }) => {
                    void queryClient.invalidateQueries({ queryKey: frappeQueryKeys.desk.tags(doctype) })
                    return queryClient.invalidateQueries({
                        queryKey: ['frappe', 'desk', 'taggedDocs', doctype],
                    })
                },
            },
            options,
        ),
    )
    return { ...mutation, addTag: mutation.mutateAsync }
}

export interface RemoveTagVariables {
    tag: string
    doctype: string
    name: string
}

export function useFrappeRemoveTag(options?: FrappeMutationOptions<unknown, RemoveTagVariables>) {
    const client = useExtendedClient()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ tag, doctype, name }) => client.desk.removeTag(tag, doctype, name),
                onSuccess: (_data, { doctype }) => {
                    void queryClient.invalidateQueries({ queryKey: frappeQueryKeys.desk.tags(doctype) })
                    return queryClient.invalidateQueries({
                        queryKey: ['frappe', 'desk', 'taggedDocs', doctype],
                    })
                },
            },
            options,
        ),
    )
    return { ...mutation, removeTag: mutation.mutateAsync }
}

export function useFrappeGetShareUsers(doctype: string, name: string, options?: FrappeQueryOptions<DocShare[]>) {
    const client = useExtendedClient()
    return useQuery(frappeExtendedQueryOptions.desk.getShareUsers(client, doctype, name, options))
}

export function useFrappeShareAdd(options?: FrappeMutationOptions<DocShare, ShareArgs>) {
    const client = useExtendedClient()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: (args) => client.desk.share.add(args),
                onSuccess: (_data, args) =>
                    queryClient.invalidateQueries({
                        queryKey: frappeQueryKeys.desk.shares(args.doctype, String(args.name)),
                    }),
            },
            options,
        ),
    )
    return { ...mutation, addShare: mutation.mutateAsync }
}

export function useFrappeShareSetPermission(options?: FrappeMutationOptions<DocShare | null, SetSharePermissionArgs>) {
    const client = useExtendedClient()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: (args) => client.desk.share.setPermission(args),
                onSuccess: (_data, args) =>
                    queryClient.invalidateQueries({
                        queryKey: frappeQueryKeys.desk.shares(args.doctype, String(args.name)),
                    }),
            },
            options,
        ),
    )
    return { ...mutation, setPermission: mutation.mutateAsync }
}
