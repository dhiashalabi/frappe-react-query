import type { TimeZoneResponse } from 'frappe-js-client/extended'
import type {
    CommentDoc,
    ExtendedFrappeClient,
    HasPermissionResponse,
    Permissions,
    PermissionType,
    QueryReportResult,
    QueryReportRunArgs,
    QueryReportScript,
    ReportViewArgs,
    ReportViewCompressed,
    WorkflowDoc,
    WorkflowTransition,
} from 'frappe-js-client/extended'

import { queryOptions } from '@tanstack/react-query'

import type { FrappeQueryOptions } from '../types'

import { frappeQueryKeys } from '../query/keys'
import { withoutRealtime } from '../query/merge'

function withEnabled<TData>(baseEnabled: boolean, options?: FrappeQueryOptions<TData>) {
    const rest = withoutRealtime(options)
    const enabled = rest?.enabled
    return {
        ...rest,
        enabled: typeof enabled === 'function' ? enabled : baseEnabled && (enabled ?? true),
    }
}

export const frappeExtendedQueryOptions = {
    permission: {
        has: (
            client: ExtendedFrappeClient,
            doctype: string,
            name: string,
            permType: PermissionType = 'read',
            options?: FrappeQueryOptions<HasPermissionResponse>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.permission.has(doctype, name, permType),
                queryFn: ({ signal }) => client.permission.has(doctype, name, permType, { signal }),
                ...withEnabled(!!name, options),
            }),
        getForDoc: (
            client: ExtendedFrappeClient,
            doctype: string,
            name: string,
            options?: FrappeQueryOptions<Permissions>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.permission.forDoc(doctype, name),
                queryFn: ({ signal }) => client.permission.getForDoc(doctype, name, { signal }),
                ...withEnabled(!!name, options),
            }),
    },
    site: {
        getTimeZone: (client: ExtendedFrappeClient, options?: FrappeQueryOptions<TimeZoneResponse>) =>
            queryOptions({
                queryKey: frappeQueryKeys.site.timeZone,
                queryFn: ({ signal }) => client.site.getTimeZone({ signal }),
                ...withoutRealtime(options),
            }),
    },
    workflow: {
        getTransitions: (
            client: ExtendedFrappeClient,
            doc: WorkflowDoc,
            options?: FrappeQueryOptions<WorkflowTransition[]>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.workflow.transitions(doc),
                queryFn: ({ signal }) => client.workflow.getTransitions(doc, { signal }),
                ...withoutRealtime(options),
            }),
        canCancelDocument: (client: ExtendedFrappeClient, doctype: string, options?: FrappeQueryOptions<boolean>) =>
            queryOptions({
                queryKey: frappeQueryKeys.workflow.canCancel(doctype),
                queryFn: ({ signal }) => client.workflow.canCancelDocument(doctype, { signal }),
                ...withoutRealtime(options),
            }),
        getCommonTransitionActions: (
            client: ExtendedFrappeClient,
            docs: WorkflowDoc[],
            doctype: string,
            options?: FrappeQueryOptions<string[]>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.workflow.commonActions(docs, doctype),
                queryFn: ({ signal }) => client.workflow.getCommonTransitionActions(docs, doctype, { signal }),
                ...withoutRealtime(options),
            }),
    },
    report: {
        get: (client: ExtendedFrappeClient, args: ReportViewArgs, options?: FrappeQueryOptions<ReportViewCompressed>) =>
            queryOptions({
                queryKey: frappeQueryKeys.report.get(args),
                queryFn: ({ signal }) => client.report.get(args, { signal }),
                ...withoutRealtime(options),
            }),
        getList: <T = object>(
            client: ExtendedFrappeClient,
            args: ReportViewArgs<T>,
            options?: FrappeQueryOptions<T[]>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.report.list(args),
                queryFn: ({ signal }) => client.report.getList<T>(args, { signal }),
                ...withoutRealtime(options),
            }),
        countRows: <T = object>(
            client: ExtendedFrappeClient,
            args: ReportViewArgs<T>,
            options?: FrappeQueryOptions<number | null>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.report.count(args),
                queryFn: ({ signal }) => client.report.countRows<T>(args, { signal }),
                ...withoutRealtime(options),
            }),
        run: (
            client: ExtendedFrappeClient,
            reportName: string,
            filters?: Record<string, unknown> | string,
            args?: QueryReportRunArgs,
            options?: FrappeQueryOptions<QueryReportResult>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.report.run(reportName, filters, args),
                queryFn: ({ signal }) => client.report.run(reportName, filters, args, { signal }),
                ...withoutRealtime(options),
            }),
        getScript: (
            client: ExtendedFrappeClient,
            reportName: string,
            options?: FrappeQueryOptions<QueryReportScript>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.report.script(reportName),
                queryFn: ({ signal }) => client.report.getScript(reportName, { signal }),
                ...withoutRealtime(options),
            }),
        getQueued: (
            client: ExtendedFrappeClient,
            reportName: string,
            filters: Record<string, unknown> | string,
            options?: FrappeQueryOptions<unknown[]>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.report.queued(reportName, filters),
                queryFn: ({ signal }) => client.report.getQueued(reportName, filters, { signal }),
                ...withoutRealtime(options),
            }),
    },
    desk: {
        getComments: (
            client: ExtendedFrappeClient,
            doctype: string,
            name: string,
            options?: FrappeQueryOptions<CommentDoc[]>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.desk.comments(doctype, name),
                queryFn: ({ signal }) => client.desk.getComments(doctype, name, { signal }),
                ...withEnabled(!!name, options),
            }),
        getTags: (client: ExtendedFrappeClient, doctype: string, txt = '', options?: FrappeQueryOptions<string[]>) =>
            queryOptions({
                queryKey: frappeQueryKeys.desk.tags(doctype, txt),
                queryFn: ({ signal }) => client.desk.getTags(doctype, txt, { signal }),
                ...withoutRealtime(options),
            }),
        getTaggedDocs: (
            client: ExtendedFrappeClient,
            doctype: string,
            tag: string,
            options?: FrappeQueryOptions<unknown>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.desk.taggedDocs(doctype, tag),
                queryFn: ({ signal }) => client.desk.getTaggedDocs(doctype, tag, { signal }),
                ...withoutRealtime(options),
            }),
        getShareUsers: (
            client: ExtendedFrappeClient,
            doctype: string,
            name: string,
            options?: FrappeQueryOptions<import('frappe-js-client/extended').DocShare[]>,
        ) =>
            queryOptions({
                queryKey: frappeQueryKeys.desk.shares(doctype, name),
                queryFn: ({ signal }) => client.desk.share.getUsers(doctype, name, { signal }),
                ...withEnabled(!!name, options),
            }),
    },
}
