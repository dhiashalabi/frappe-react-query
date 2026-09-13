import type {
    PreparedReportRef,
    QueryReportResult,
    QueryReportRunArgs,
    QueryReportScript,
    ReportViewArgs,
    ReportViewCompressed,
} from 'frappe-js-client/extended'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { FrappeMutationOptions, FrappeQueryOptions } from '../types'

import { mergeMutationOptions } from '../query/merge'
import { useExtendedClient } from './assert'
import { frappeExtendedQueryOptions } from './options'

export function useFrappeGetReport(args: ReportViewArgs, options?: FrappeQueryOptions<ReportViewCompressed>) {
    const client = useExtendedClient()
    return useQuery(frappeExtendedQueryOptions.report.get(client, args, options))
}

export function useFrappeGetReportList<T = object>(args: ReportViewArgs<T>, options?: FrappeQueryOptions<T[]>) {
    const client = useExtendedClient()
    return useQuery(frappeExtendedQueryOptions.report.getList<T>(client, args, options))
}

export function useFrappeGetReportCount<T = object>(
    args: ReportViewArgs<T>,
    options?: FrappeQueryOptions<number | null>,
) {
    const client = useExtendedClient()
    return useQuery(frappeExtendedQueryOptions.report.countRows<T>(client, args, options))
}

export function useFrappeRunReport(
    reportName: string,
    filters?: Record<string, unknown> | string,
    args?: QueryReportRunArgs,
    options?: FrappeQueryOptions<QueryReportResult>,
) {
    const client = useExtendedClient()
    return useQuery(frappeExtendedQueryOptions.report.run(client, reportName, filters, args, options))
}

export function useFrappeGetReportScript(reportName: string, options?: FrappeQueryOptions<QueryReportScript>) {
    const client = useExtendedClient()
    return useQuery(frappeExtendedQueryOptions.report.getScript(client, reportName, options))
}

export function useFrappeGetQueuedReport(
    reportName: string,
    filters: Record<string, unknown> | string,
    options?: FrappeQueryOptions<unknown[]>,
) {
    const client = useExtendedClient()
    return useQuery(frappeExtendedQueryOptions.report.getQueued(client, reportName, filters, options))
}

export interface PrepareReportVariables {
    reportName: string
    filters?: Record<string, unknown> | string
}

export function useFrappePrepareReport(options?: FrappeMutationOptions<PreparedReportRef, PrepareReportVariables>) {
    const client = useExtendedClient()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: ({ reportName, filters }) => client.report.prepare(reportName, filters),
                onSuccess: (_data, { reportName }) =>
                    queryClient.invalidateQueries({
                        queryKey: ['frappe', 'report', 'queued', reportName],
                    }),
            },
            options,
        ),
    )
    return { ...mutation, prepare: mutation.mutateAsync }
}

export function useFrappeStopReport(options?: FrappeMutationOptions<unknown, string>) {
    const client = useExtendedClient()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: (preparedReportName) => client.report.stop(preparedReportName),
                onSuccess: () => queryClient.invalidateQueries({ queryKey: ['frappe', 'report', 'queued'] }),
            },
            options,
        ),
    )
    return { ...mutation, stop: mutation.mutateAsync }
}

export function useFrappeDownloadReport(options?: FrappeMutationOptions<Blob, string>) {
    const client = useExtendedClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: (preparedReportName) => client.report.download(preparedReportName),
            },
            options,
        ),
    )
    return { ...mutation, download: mutation.mutateAsync }
}
