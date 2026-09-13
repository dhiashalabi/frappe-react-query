import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
    useFrappeCancelDoc,
    useFrappeCopyDoc,
    useFrappeGetLastDoc,
    useFrappeGetMeta,
    useFrappeGetPassword,
    useFrappeGetSingle,
    useFrappeGetSingleValue,
    useFrappeGetValue,
    useFrappeInsertMany,
    useFrappeIsDocumentAmended,
    useFrappeRenameDoc,
    useFrappeRunMethod,
    useFrappeSetSingle,
    useFrappeSetValue,
    useFrappeSubmitDoc,
    useFrappeUpdateMany,
    useFrappeValidateLink,
    useFrappeValidateLinkAndFetch,
} from '../src'
import { createWrapper } from './helpers/render'

function doc(name = 'TD-1') {
    return {
        name,
        doctype: 'ToDo',
        owner: 'Administrator',
        creation: '',
        modified: '',
        modified_by: '',
        idx: 0,
        docstatus: 0 as const,
    }
}

describe('remaining db hooks', () => {
    it('covers query helpers', async () => {
        const { wrapper, client } = createWrapper()
        vi.spyOn(client.db, 'getLastDoc').mockResolvedValue(doc())
        vi.spyOn(client.db, 'getValue').mockResolvedValue('v')
        vi.spyOn(client.db, 'getSingle').mockResolvedValue(doc('System Settings'))
        vi.spyOn(client.db, 'getSingleValue').mockResolvedValue('UTC')
        vi.spyOn(client.db, 'getMeta').mockResolvedValue({ name: 'ToDo' })
        vi.spyOn(client.db, 'copyDoc').mockResolvedValue(doc())
        vi.spyOn(client.db, 'validateLink').mockResolvedValue({ name: 'TD-1' })
        vi.spyOn(client.db, 'validateLinkAndFetch').mockResolvedValue({ full_name: 'Admin' })
        vi.spyOn(client.db, 'isDocumentAmended').mockResolvedValue(false)

        const hooks = {
            last: renderHook(() => useFrappeGetLastDoc('ToDo'), { wrapper }),
            value: renderHook(() => useFrappeGetValue('ToDo', 'status'), { wrapper }),
            single: renderHook(() => useFrappeGetSingle('System Settings'), { wrapper }),
            singleValue: renderHook(() => useFrappeGetSingleValue('System Settings', 'time_zone'), { wrapper }),
            meta: renderHook(() => useFrappeGetMeta('ToDo'), { wrapper }),
            copy: renderHook(() => useFrappeCopyDoc('ToDo', 'TD-1'), { wrapper }),
            validate: renderHook(() => useFrappeValidateLink('ToDo', 'TD-1'), { wrapper }),
            validateFetch: renderHook(
                () => useFrappeValidateLinkAndFetch('User', 'Administrator', ['full_name']),
                { wrapper },
            ),
            amended: renderHook(() => useFrappeIsDocumentAmended('ToDo', 'TD-1'), { wrapper }),
        }

        await waitFor(() => {
            expect(hooks.last.result.current.isSuccess).toBe(true)
            expect(hooks.value.result.current.data).toBe('v')
            expect(hooks.validateFetch.result.current.data).toEqual({ full_name: 'Admin' })
            expect(hooks.amended.result.current.data).toBe(false)
        })
        expect(client.db.validateLinkAndFetch).toHaveBeenCalled()
    })

    it('covers remaining mutations', async () => {
        const { wrapper, client } = createWrapper()
        vi.spyOn(client.db, 'setValue').mockResolvedValue(doc())
        vi.spyOn(client.db, 'setSingle').mockResolvedValue(doc('System Settings'))
        vi.spyOn(client.db, 'renameDoc').mockResolvedValue('TD-2')
        vi.spyOn(client.db, 'submit').mockResolvedValue({ ...doc(), docstatus: 1 })
        vi.spyOn(client.db, 'cancel').mockResolvedValue({ ...doc(), docstatus: 2 })
        vi.spyOn(client.db, 'runMethod').mockResolvedValue({ ok: true })
        vi.spyOn(client.db, 'insertMany').mockResolvedValue(['a'])
        vi.spyOn(client.db, 'updateMany').mockResolvedValue({ failed_docs: [] })
        vi.spyOn(client.db, 'getPassword').mockResolvedValue('secret')

        const setValue = renderHook(() => useFrappeSetValue(), { wrapper })
        const setSingle = renderHook(() => useFrappeSetSingle(), { wrapper })
        const rename = renderHook(() => useFrappeRenameDoc(), { wrapper })
        const submit = renderHook(() => useFrappeSubmitDoc(), { wrapper })
        const cancel = renderHook(() => useFrappeCancelDoc(), { wrapper })
        const run = renderHook(() => useFrappeRunMethod(), { wrapper })
        const insert = renderHook(() => useFrappeInsertMany(), { wrapper })
        const update = renderHook(() => useFrappeUpdateMany(), { wrapper })
        const password = renderHook(() => useFrappeGetPassword(), { wrapper })

        await setValue.result.current.setValue({ doctype: 'ToDo', name: 'TD-1', fieldName: 'status', value: 'Open' })
        await setSingle.result.current.setSingle({ doctype: 'System Settings', values: { time_zone: 'UTC' } })
        await rename.result.current.renameDoc({ doctype: 'ToDo', oldName: 'TD-1', newName: 'TD-2' })
        await submit.result.current.submit(doc())
        await cancel.result.current.cancel({ doctype: 'ToDo', name: 'TD-1' })
        await run.result.current.runMethod({ doctype: 'ToDo', name: 'TD-1', method: 'x' })
        await insert.result.current.insertMany([doc()])
        await update.result.current.updateMany([doc()])
        await password.result.current.getPassword({ doctype: 'User', name: 'Administrator', fieldName: 'pwd' })

        expect(client.db.getPassword).toHaveBeenCalled()
    })
})
