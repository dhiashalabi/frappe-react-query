import type { WorkflowDoc, WorkflowTransition } from 'frappe-js-client/extended'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { FrappeMutationOptions, FrappeQueryOptions } from '../types'

import { invalidateDoctype } from '../query/invalidation'
import { frappeQueryKeys } from '../query/keys'
import { mergeMutationOptions } from '../query/merge'
import { useExtendedClient } from './assert'
import { frappeExtendedQueryOptions } from './options'

export function useFrappeGetTransitions(doc: WorkflowDoc, options?: FrappeQueryOptions<WorkflowTransition[]>) {
    const client = useExtendedClient()
    return useQuery(frappeExtendedQueryOptions.workflow.getTransitions(client, doc, options))
}

export function useFrappeCanCancelDocument(doctype: string, options?: FrappeQueryOptions<boolean>) {
    const client = useExtendedClient()
    return useQuery(frappeExtendedQueryOptions.workflow.canCancelDocument(client, doctype, options))
}

export function useFrappeGetCommonTransitionActions(
    docs: WorkflowDoc[],
    doctype: string,
    options?: FrappeQueryOptions<string[]>,
) {
    const client = useExtendedClient()
    return useQuery(frappeExtendedQueryOptions.workflow.getCommonTransitionActions(client, docs, doctype, options))
}

export interface ApplyWorkflowVariables {
    doc: WorkflowDoc
    action: string
}

export function useFrappeApplyWorkflow<T = unknown>(options?: FrappeMutationOptions<T, ApplyWorkflowVariables>) {
    const client = useExtendedClient()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ doc, action }) => client.workflow.apply<T>(doc, action),
                onSuccess: (_data, { doc }) => {
                    void invalidateDoctype(queryClient, doc.doctype)
                    return queryClient.invalidateQueries({ queryKey: frappeQueryKeys.workflow.all })
                },
            },
            options,
        ),
    )
    return { ...mutation, apply: mutation.mutateAsync }
}

export interface BulkApprovalVariables {
    names: string[]
    doctype: string
    action: string
}

export function useFrappeBulkWorkflowApproval(options?: FrappeMutationOptions<unknown, BulkApprovalVariables>) {
    const client = useExtendedClient()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ names, doctype, action }) => client.workflow.bulkApproval(names, doctype, action),
                onSuccess: (_data, { doctype }) => {
                    void invalidateDoctype(queryClient, doctype)
                    return queryClient.invalidateQueries({ queryKey: frappeQueryKeys.workflow.all })
                },
            },
            options,
        ),
    )
    return { ...mutation, bulkApproval: mutation.mutateAsync }
}
