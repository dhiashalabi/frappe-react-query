import { describe, expect, it } from 'vitest'

import { DEFAULT_PAGE_SIZE, frappeQueryKeys } from '../src'

describe('frappeQueryKeys', () => {
    it('nests document keys under a doctype prefix that invalidation can match', () => {
        const doctype = frappeQueryKeys.db.doctype('ToDo')
        const doc = frappeQueryKeys.db.doc('ToDo', 'TD-1')
        const list = frappeQueryKeys.db.list('ToDo', { limit: 20 })

        expect(doctype).toEqual(['frappe', 'db', 'ToDo'])
        expect(doc.slice(0, doctype.length)).toEqual(doctype)
        expect(list.slice(0, doctype.length)).toEqual(doctype)
    })

    it('keeps auth and call keys under the frappe root', () => {
        expect(frappeQueryKeys.auth.loggedUser[0]).toBe('frappe')
        expect(frappeQueryKeys.auth.ping).toEqual(['frappe', 'auth', 'ping'])
        expect(frappeQueryKeys.call.get('frappe.ping')).toEqual(['frappe', 'call', 'get', 'frappe.ping', undefined])
    })

    it('omits trailing args from the document key so prefix invalidation matches every variant', () => {
        expect(frappeQueryKeys.db.doc('ToDo', 'TD-1')).toEqual(['frappe', 'db', 'ToDo', 'doc', 'TD-1'])
        expect(frappeQueryKeys.db.doc('ToDo', 'TD-1', { expandLinks: true })).toEqual([
            'frappe',
            'db',
            'ToDo',
            'doc',
            'TD-1',
            { expandLinks: true },
        ])
    })

    it('keys validateLinkAndFetch and queued reports distinctly', () => {
        expect(frappeQueryKeys.db.validateLinkAndFetch('User', 'Administrator', ['full_name'])).toEqual([
            'frappe',
            'db',
            'User',
            'validateLinkAndFetch',
            'Administrator',
            ['full_name'],
            undefined,
        ])
        expect(frappeQueryKeys.report.queued('Sales Analytics', { from: '2024' })).toEqual([
            'frappe',
            'report',
            'queued',
            'Sales Analytics',
            { from: '2024' },
        ])
    })

    it('exports the same default page size as the client list helper', () => {
        expect(DEFAULT_PAGE_SIZE).toBe(20)
    })
})
