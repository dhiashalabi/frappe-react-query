import { renderHook, waitFor } from '@testing-library/react'
import { createExtendedTestClient } from 'frappe-js-client/testing'
import { describe, expect, it, vi } from 'vitest'

import { frappeQueryKeys } from '../src'
import {
    useFrappeAddComment,
    useFrappeAddTag,
    useFrappeApplyWorkflow,
    useFrappeAssign,
    useFrappeAssignMultiple,
    useFrappeBulkWorkflowApproval,
    useFrappeCanCancelDocument,
    useFrappeCloseAssignment,
    useFrappeDownloadReport,
    useFrappeGetComments,
    useFrappeGetCommonTransitionActions,
    useFrappeGetQueuedReport,
    useFrappeGetReportCount,
    useFrappeGetReportList,
    useFrappeGetReportScript,
    useFrappeGetShareUsers,
    useFrappeGetTaggedDocs,
    useFrappeGetTimeZone,
    useFrappeGetTransitions,
    useFrappePrepareReport,
    useFrappeRemoveTag,
    useFrappeRunReport,
    useFrappeShareSetPermission,
    useFrappeStopReport,
    useFrappeUnassign,
    useFrappeUpdateComment,
} from '../src/extended'
import { createQueryClient, createWrapper } from './helpers/render'

describe('extended modules', () => {
    it('reads site timezone, comments, and workflow transitions', async () => {
        const { client } = createExtendedTestClient()
        vi.spyOn(client.site, 'getTimeZone').mockResolvedValue({ time_zone: 'UTC' })
        vi.spyOn(client.desk, 'getComments').mockResolvedValue([])
        vi.spyOn(client.workflow, 'getTransitions').mockResolvedValue([])

        const { wrapper } = createWrapper({ client })
        const tz = renderHook(() => useFrappeGetTimeZone(), { wrapper })
        const comments = renderHook(() => useFrappeGetComments('ToDo', 'TD-1'), { wrapper })
        const transitions = renderHook(() => useFrappeGetTransitions({ doctype: 'ToDo', name: 'TD-1' }), { wrapper })

        await waitFor(() => {
            expect(tz.result.current.data?.time_zone).toBe('UTC')
            expect(comments.result.current.data).toEqual([])
            expect(transitions.result.current.data).toEqual([])
        })
    })

    it('applies workflow and adds a comment', async () => {
        const { client } = createExtendedTestClient()
        vi.spyOn(client.workflow, 'apply').mockResolvedValue({ ok: true })
        vi.spyOn(client.desk, 'addComment').mockResolvedValue({
            name: 'c-1',
            doctype: 'Comment',
            owner: 'Administrator',
            creation: '',
            modified: '',
            modified_by: '',
            idx: 0,
            docstatus: 0,
            content: 'hi',
        })

        const { wrapper } = createWrapper({ client })
        const workflow = renderHook(() => useFrappeApplyWorkflow(), { wrapper })
        const comment = renderHook(() => useFrappeAddComment(), { wrapper })

        await workflow.result.current.apply({ doc: { doctype: 'ToDo', name: 'TD-1' }, action: 'Approve' })
        await comment.result.current.addComment({
            referenceDoctype: 'ToDo',
            referenceName: 'TD-1',
            content: 'hi',
            commentEmail: 'a@b.c',
            commentBy: 'A',
        })

        expect(client.workflow.apply).toHaveBeenCalled()
        expect(client.desk.addComment).toHaveBeenCalled()
    })

    it('reads queued prepared reports', async () => {
        const { client } = createExtendedTestClient()
        vi.spyOn(client.report, 'getQueued').mockResolvedValue([{ name: 'PR-1' }])

        const { wrapper } = createWrapper({ client })
        const queued = renderHook(() => useFrappeGetQueuedReport('Sales Analytics', {}), { wrapper })

        await waitFor(() => {
            expect(queued.result.current.data).toEqual([{ name: 'PR-1' }])
        })
        expect(client.report.getQueued).toHaveBeenCalled()
    })

    it('invalidates queued report keys after prepare and stop', async () => {
        const queryClient = createQueryClient()
        const { client } = createExtendedTestClient()
        vi.spyOn(client.report, 'prepare').mockResolvedValue({ name: 'PR-1' } as never)
        vi.spyOn(client.report, 'stop').mockResolvedValue(undefined)

        const queuedKey = frappeQueryKeys.report.queued('Sales Analytics', {})
        queryClient.setQueryData(queuedKey, [])

        const { wrapper } = createWrapper({ client, queryClient })
        const prepare = renderHook(() => useFrappePrepareReport(), { wrapper })
        const stop = renderHook(() => useFrappeStopReport(), { wrapper })

        await prepare.result.current.prepare({ reportName: 'Sales Analytics', filters: {} })
        await waitFor(() => {
            expect(queryClient.getQueryState(queuedKey)?.isInvalidated).toBe(true)
        })

        queryClient.setQueryData(queuedKey, [])
        await stop.result.current.stop('PR-1')
        await waitFor(() => {
            expect(queryClient.getQueryState(queuedKey)?.isInvalidated).toBe(true)
        })
    })

    it('covers remaining workflow, report, and desk hooks', async () => {
        const { client } = createExtendedTestClient()
        vi.spyOn(client.workflow, 'canCancelDocument').mockResolvedValue(true)
        vi.spyOn(client.workflow, 'getCommonTransitionActions').mockResolvedValue(['Approve'])
        vi.spyOn(client.workflow, 'bulkApproval').mockResolvedValue({ ok: true })
        vi.spyOn(client.report, 'getList').mockResolvedValue([])
        vi.spyOn(client.report, 'countRows').mockResolvedValue(2)
        vi.spyOn(client.report, 'getScript').mockResolvedValue({ script: '' } as never)
        vi.spyOn(client.report, 'run').mockResolvedValue({ result: [] } as never)
        vi.spyOn(client.report, 'download').mockResolvedValue(new Blob(['ok']))
        vi.spyOn(client.desk, 'assign').mockResolvedValue([])
        vi.spyOn(client.desk, 'assignMultiple').mockResolvedValue(undefined)
        vi.spyOn(client.desk, 'unassign').mockResolvedValue([])
        vi.spyOn(client.desk, 'closeAssignment').mockResolvedValue([])
        vi.spyOn(client.desk, 'addTag').mockResolvedValue('urgent')
        vi.spyOn(client.desk, 'removeTag').mockResolvedValue(undefined)
        vi.spyOn(client.desk, 'getTaggedDocs').mockResolvedValue(['TD-1'])
        vi.spyOn(client.desk, 'updateComment').mockResolvedValue(undefined)
        vi.spyOn(client.desk.share, 'setPermission').mockResolvedValue(null)
        vi.spyOn(client.desk.share, 'getUsers').mockResolvedValue([])

        const { wrapper } = createWrapper({ client })
        const canCancel = renderHook(() => useFrappeCanCancelDocument('ToDo'), { wrapper })
        const common = renderHook(
            () => useFrappeGetCommonTransitionActions([{ doctype: 'ToDo', name: 'TD-1' }], 'ToDo'),
            { wrapper },
        )
        const list = renderHook(() => useFrappeGetReportList({ doctype: 'ToDo' }), { wrapper })
        const count = renderHook(() => useFrappeGetReportCount({ doctype: 'ToDo' }), { wrapper })
        const script = renderHook(() => useFrappeGetReportScript('Sales Analytics'), { wrapper })
        const run = renderHook(() => useFrappeRunReport('Sales Analytics', {}), { wrapper })
        const tagged = renderHook(() => useFrappeGetTaggedDocs('ToDo', 'urgent'), { wrapper })
        const shares = renderHook(() => useFrappeGetShareUsers('ToDo', 'TD-1'), { wrapper })

        await waitFor(() => {
            expect(canCancel.result.current.data).toBe(true)
            expect(common.result.current.data).toEqual(['Approve'])
            expect(list.result.current.data).toEqual([])
            expect(count.result.current.data).toBe(2)
            expect(script.result.current.isSuccess).toBe(true)
            expect(run.result.current.isSuccess).toBe(true)
            expect(tagged.result.current.data).toEqual(['TD-1'])
            expect(shares.result.current.data).toEqual([])
        })

        const bulk = renderHook(() => useFrappeBulkWorkflowApproval(), { wrapper })
        const download = renderHook(() => useFrappeDownloadReport(), { wrapper })
        const assign = renderHook(() => useFrappeAssign(), { wrapper })
        const assignMany = renderHook(() => useFrappeAssignMultiple(), { wrapper })
        const unassign = renderHook(() => useFrappeUnassign(), { wrapper })
        const close = renderHook(() => useFrappeCloseAssignment(), { wrapper })
        const addTag = renderHook(() => useFrappeAddTag(), { wrapper })
        const removeTag = renderHook(() => useFrappeRemoveTag(), { wrapper })
        const updateComment = renderHook(() => useFrappeUpdateComment(), { wrapper })
        const setShare = renderHook(() => useFrappeShareSetPermission(), { wrapper })

        await bulk.result.current.bulkApproval({ names: ['TD-1'], doctype: 'ToDo', action: 'Approve' })
        await download.result.current.download('PR-1')
        await assign.result.current.assign({ doctype: 'ToDo', name: 'TD-1', assignTo: ['x'] })
        await assignMany.result.current.assignMultiple({ doctype: 'ToDo', names: ['TD-1'], assignTo: ['x'] })
        await unassign.result.current.unassign({ doctype: 'ToDo', name: 'TD-1', assignTo: 'x' })
        await close.result.current.closeAssignment({ doctype: 'ToDo', name: 'TD-1', assignTo: 'x' })
        await addTag.result.current.addTag({ tag: 'urgent', doctype: 'ToDo', name: 'TD-1' })
        await removeTag.result.current.removeTag({ tag: 'urgent', doctype: 'ToDo', name: 'TD-1' })
        await updateComment.result.current.updateComment({
            name: 'c-1',
            content: 'updated',
            referenceDoctype: 'ToDo',
            referenceName: 'TD-1',
        })
        await setShare.result.current.setPermission({
            doctype: 'ToDo',
            name: 'TD-1',
            user: 'x',
            permissionTo: 'read',
        })

        expect(client.workflow.bulkApproval).toHaveBeenCalled()
        expect(client.report.download).toHaveBeenCalled()
        expect(client.desk.assign).toHaveBeenCalled()
        expect(client.desk.share.setPermission).toHaveBeenCalled()
    })
})
