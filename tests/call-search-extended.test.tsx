import { renderHook, waitFor } from '@testing-library/react'
import { createExtendedTestClient } from 'frappe-js-client/testing'
import { describe, expect, it, vi } from 'vitest'

import {
    useFrappeDeleteCall,
    useFrappeDoctypeMethod,
    useFrappeForgetPassword,
    useFrappeGetLinkTitle,
    useFrappePing,
    useFrappePostCall,
    useFrappePutCall,
    useFrappeRunDocMethod,
    useFrappeSearchWidget,
} from '../src'
import { useFrappeGetDocPermissions, useFrappeGetReport, useFrappeGetTags, useFrappeShareAdd } from '../src/extended'
import { createWrapper } from './helpers/render'

describe('call, search, and extra extended hooks', () => {
    it('posts a method, pings, and loads a link title', async () => {
        const { wrapper, client } = createWrapper()
        vi.spyOn(client.call, 'post').mockResolvedValue({ ok: true })
        vi.spyOn(client.auth, 'ping').mockResolvedValue('pong')
        vi.spyOn(client.auth, 'forgetPassword').mockResolvedValue(undefined)
        vi.spyOn(client.search, 'getLinkTitle').mockResolvedValue('Admin')
        vi.spyOn(client.search, 'searchWidget').mockResolvedValue({ results: [] })

        const post = renderHook(() => useFrappePostCall('x.y'), { wrapper })
        const ping = renderHook(() => useFrappePing(), { wrapper })
        const forget = renderHook(() => useFrappeForgetPassword(), { wrapper })
        const title = renderHook(() => useFrappeGetLinkTitle('User', 'Administrator'), { wrapper })
        const widget = renderHook(() => useFrappeSearchWidget('User', 'a', undefined, { debounce: 0 }), { wrapper })

        await post.result.current.call({ a: 1 })
        await ping.result.current.ping()
        await forget.result.current.forgetPassword('Administrator')
        await waitFor(() => {
            expect(title.result.current.data).toBe('Admin')
            expect(widget.result.current.isSuccess).toBe(true)
        })
    })

    it('covers put, delete, doctype, and run-doc method calls', async () => {
        const { wrapper, client } = createWrapper()
        vi.spyOn(client.call, 'put').mockResolvedValue({ ok: 'put' })
        vi.spyOn(client.call, 'delete').mockResolvedValue({ ok: 'delete' })
        vi.spyOn(client.call, 'doctypeMethod').mockResolvedValue({ ok: 'doctype' })
        vi.spyOn(client.call, 'runDocMethod').mockResolvedValue({ ok: 'run' })

        const put = renderHook(() => useFrappePutCall('x.y'), { wrapper })
        const del = renderHook(() => useFrappeDeleteCall('x.y'), { wrapper })
        const doctype = renderHook(() => useFrappeDoctypeMethod('ToDo', 'custom'), { wrapper })
        const run = renderHook(() => useFrappeRunDocMethod(), { wrapper })

        await expect(put.result.current.call({ a: 1 })).resolves.toEqual({ ok: 'put' })
        await expect(del.result.current.call({ a: 1 })).resolves.toEqual({ ok: 'delete' })
        await expect(doctype.result.current.call({ a: 1 })).resolves.toEqual({ ok: 'doctype' })
        await expect(
            run.result.current.runDocMethod({ method: 'custom', document: { doctype: 'ToDo', name: 'TD-1' } }),
        ).resolves.toEqual({ ok: 'run' })

        expect(client.call.put).toHaveBeenCalled()
        expect(client.call.delete).toHaveBeenCalled()
        expect(client.call.doctypeMethod).toHaveBeenCalledWith('ToDo', 'custom', { a: 1 })
        expect(client.call.runDocMethod).toHaveBeenCalled()
    })

    it('covers permission, report, tags, and share', async () => {
        const { client } = createExtendedTestClient()
        vi.spyOn(client.permission, 'getForDoc').mockResolvedValue({
            select: 1,
            read: 1,
            write: 1,
            create: 1,
            delete: 1,
            submit: 0,
            cancel: 0,
            amend: 0,
            print: 1,
            email: 1,
            report: 1,
            import: 0,
            export: 1,
            share: 1,
        })
        vi.spyOn(client.report, 'get').mockResolvedValue({ keys: [], values: [] })
        vi.spyOn(client.desk, 'getTags').mockResolvedValue(['open'])
        vi.spyOn(client.desk.share, 'add').mockResolvedValue({
            name: 's-1',
            doctype: 'DocShare',
            owner: 'Administrator',
            creation: '',
            modified: '',
            modified_by: '',
            idx: 0,
            docstatus: 0,
        })

        const { wrapper } = createWrapper({ client })
        const perms = renderHook(() => useFrappeGetDocPermissions('ToDo', 'TD-1'), { wrapper })
        const report = renderHook(() => useFrappeGetReport({ doctype: 'ToDo' }), { wrapper })
        const tags = renderHook(() => useFrappeGetTags('ToDo'), { wrapper })
        const share = renderHook(() => useFrappeShareAdd(), { wrapper })

        await waitFor(() => {
            expect(perms.result.current.data?.read).toBe(1)
            expect(report.result.current.data?.keys).toEqual([])
            expect(tags.result.current.data).toEqual(['open'])
        })
        await share.result.current.addShare({ doctype: 'ToDo', name: 'TD-1', user: 'x' })
        expect(client.desk.share.add).toHaveBeenCalled()
    })
})
