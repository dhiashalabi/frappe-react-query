export const frappeQueryKeys = {
    all: ['frappe'] as const,
    db: {
        all: ['frappe', 'db'] as const,
        doctype: (doctype: string) => ['frappe', 'db', doctype] as const,
        doc: (doctype: string, name: string, args?: unknown) =>
            args === undefined
                ? (['frappe', 'db', doctype, 'doc', name] as const)
                : (['frappe', 'db', doctype, 'doc', name, args] as const),
        list: (doctype: string, args?: unknown) => ['frappe', 'db', doctype, 'list', args] as const,
        listInfinite: (doctype: string, args?: unknown) => ['frappe', 'db', doctype, 'listInfinite', args] as const,
        count: (doctype: string, args?: unknown) => ['frappe', 'db', doctype, 'count', args] as const,
        last: (doctype: string, args?: unknown) => ['frappe', 'db', doctype, 'last', args] as const,
        exists: (doctype: string, name: string) => ['frappe', 'db', doctype, 'exists', name] as const,
        value: (doctype: string, fieldName: unknown, args?: unknown) =>
            ['frappe', 'db', doctype, 'value', fieldName, args] as const,
        single: (doctype: string) => ['frappe', 'db', doctype, 'single'] as const,
        singleValue: (doctype: string, field: string) => ['frappe', 'db', doctype, 'singleValue', field] as const,
        meta: (doctype: string) => ['frappe', 'db', doctype, 'meta'] as const,
        copy: (doctype: string, name: string, ignoreNoCopy?: boolean) =>
            ['frappe', 'db', doctype, 'copy', name, ignoreNoCopy] as const,
        validateLink: (doctype: string, name: string, fields?: unknown) =>
            ['frappe', 'db', doctype, 'validateLink', name, fields] as const,
        validateLinkAndFetch: (doctype: string, name: string, fieldsToFetch?: unknown, args?: unknown) =>
            ['frappe', 'db', doctype, 'validateLinkAndFetch', name, fieldsToFetch, args] as const,
        amended: (doctype: string, name: string | number) => ['frappe', 'db', doctype, 'amended', name] as const,
    },
    auth: {
        all: ['frappe', 'auth'] as const,
        loggedUser: ['frappe', 'auth', 'loggedUser'] as const,
        ping: ['frappe', 'auth', 'ping'] as const,
    },
    call: {
        all: ['frappe', 'call'] as const,
        get: (method: string, args?: unknown) => ['frappe', 'call', 'get', method, args] as const,
    },
    search: {
        all: ['frappe', 'search'] as const,
        link: (doctype: string, text: string, args?: unknown) =>
            ['frappe', 'search', 'link', doctype, text, args] as const,
        widget: (doctype: string, text: string, args?: unknown) =>
            ['frappe', 'search', 'widget', doctype, text, args] as const,
        title: (doctype: string, name: string | number) => ['frappe', 'search', 'title', doctype, name] as const,
    },
    permission: {
        all: ['frappe', 'permission'] as const,
        has: (doctype: string, name: string, permType?: string) =>
            ['frappe', 'permission', 'has', doctype, name, permType] as const,
        forDoc: (doctype: string, name: string) => ['frappe', 'permission', 'forDoc', doctype, name] as const,
    },
    site: {
        all: ['frappe', 'site'] as const,
        timeZone: ['frappe', 'site', 'timeZone'] as const,
    },
    workflow: {
        all: ['frappe', 'workflow'] as const,
        transitions: (doc: unknown) => ['frappe', 'workflow', 'transitions', doc] as const,
        canCancel: (doctype: string) => ['frappe', 'workflow', 'canCancel', doctype] as const,
        commonActions: (docs: unknown, doctype: string) =>
            ['frappe', 'workflow', 'commonActions', docs, doctype] as const,
    },
    report: {
        all: ['frappe', 'report'] as const,
        get: (args: unknown) => ['frappe', 'report', 'get', args] as const,
        list: (args: unknown) => ['frappe', 'report', 'list', args] as const,
        count: (args: unknown) => ['frappe', 'report', 'count', args] as const,
        run: (reportName: string, filters?: unknown, args?: unknown) =>
            ['frappe', 'report', 'run', reportName, filters, args] as const,
        script: (reportName: string) => ['frappe', 'report', 'script', reportName] as const,
        queued: (reportName: string, filters?: unknown) => ['frappe', 'report', 'queued', reportName, filters] as const,
    },
    desk: {
        all: ['frappe', 'desk'] as const,
        comments: (doctype: string, name: string) => ['frappe', 'desk', 'comments', doctype, name] as const,
        tags: (doctype: string, txt?: string) => ['frappe', 'desk', 'tags', doctype, txt] as const,
        taggedDocs: (doctype: string, tag: string) => ['frappe', 'desk', 'taggedDocs', doctype, tag] as const,
        shares: (doctype: string, name: string) => ['frappe', 'desk', 'shares', doctype, name] as const,
    },
}
