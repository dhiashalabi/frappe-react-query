import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
    useFrappeExists,
    useFrappeFileDownload,
    useFrappeFileUpload,
    useFrappeGetCount,
    useFrappeGetDocList,
    useFrappeGetDocListInfinite,
    useFrappeLoggedUser,
    useFrappeLogout,
} from '../src'
import { frappeQueryKeys } from '../src'
import { createQueryClient, createWrapper } from './helpers/render'

describe('core queries', () => {
    it('lists documents', async () => {
        const { wrapper, client } = createWrapper()
        vi.spyOn(client.db, 'getDocList').mockResolvedValue([{ name: 'TD-1', doctype: 'ToDo' }] as never)
        const { result } = renderHook(() => useFrappeGetDocList('ToDo'), { wrapper })
        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data?.[0]?.name).toBe('TD-1')
    })

    it('counts and exists', async () => {
        const { wrapper, client } = createWrapper()
        vi.spyOn(client.db, 'getCount').mockResolvedValue(4)
        vi.spyOn(client.db, 'exists').mockResolvedValue(true)
        const count = renderHook(() => useFrappeGetCount('ToDo'), { wrapper })
        const exists = renderHook(() => useFrappeExists('ToDo', 'TD-1'), { wrapper })
        await waitFor(() => {
            expect(count.result.current.data).toBe(4)
            expect(exists.result.current.data).toBe(true)
        })
    })

    it('pages infinitely from getDocListPage', async () => {
        const { wrapper, client } = createWrapper()
        vi.spyOn(client.db, 'getDocListPage').mockResolvedValue({
            data: [{ name: 'TD-1', doctype: 'ToDo' }] as never,
            hasNextPage: false,
        })
        const { result } = renderHook(() => useFrappeGetDocListInfinite('ToDo', { limit: 20 }), { wrapper })
        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data?.pages[0]?.data[0]?.name).toBe('TD-1')
        expect(result.current.hasNextPage).toBe(false)
    })
})

describe('auth session', () => {
    it('loads the logged user', async () => {
        const { wrapper, client } = createWrapper()
        vi.spyOn(client.auth, 'getLoggedUser').mockResolvedValue('Administrator')
        const { result } = renderHook(() => useFrappeLoggedUser(), { wrapper })
        await waitFor(() => expect(result.current.data).toBe('Administrator'))
    })

    it('clears the frappe cache on logout', async () => {
        const queryClient = createQueryClient()
        const { wrapper, client } = createWrapper({ queryClient })
        vi.spyOn(client.auth, 'logout').mockResolvedValue(undefined)
        queryClient.setQueryData(frappeQueryKeys.auth.loggedUser, 'Administrator')
        const { result } = renderHook(() => useFrappeLogout(), { wrapper })
        await result.current.logout()
        expect(queryClient.getQueryData(frappeQueryKeys.auth.loggedUser)).toBeUndefined()
    })
})

describe('files', () => {
    it('uploads with progress and downloads a blob', async () => {
        const { wrapper, client } = createWrapper()
        vi.spyOn(client.file, 'upload').mockImplementation(async (_file, _args, options) => {
            options?.onProgress?.({ loaded: 50, total: 100 })
            options?.onProgress?.({ loaded: 100, total: 100 })
            return { name: 'file-1', file_name: 'a.png', file_url: '/files/a.png', is_private: 1 }
        })
        vi.spyOn(client.file, 'download').mockResolvedValue(new Blob(['ok']))

        const upload = renderHook(() => useFrappeFileUpload(), { wrapper })
        await upload.result.current.upload({ file: new File(['x'], 'a.png'), args: { isPrivate: true } })
        await waitFor(() => expect(upload.result.current.isSuccess).toBe(true))
        expect(upload.result.current.progress).toBe(100)

        const download = renderHook(() => useFrappeFileDownload(), { wrapper })
        const blob = await download.result.current.download('/files/a.png')
        expect(blob).toBeInstanceOf(Blob)
    })
})
