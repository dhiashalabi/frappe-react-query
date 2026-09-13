# frappe-react-query

TanStack Query SDK for the Frappe Framework. This package owns query keys, `queryOptions`, cache invalidation, and thin React hooks. HTTP and sockets stay in [`frappe-js-client`](https://github.com/dhiashalabi/frappe-js-client) ^3.4.0. Your app owns the `QueryClient`.

## Install

```bash
pnpm add frappe-react-query frappe-js-client @tanstack/react-query
```

`socket.io-client` is optional. Install it only if you use `frappe-react-query/realtime`.

## Provider

Create the client yourself. Do not nest a second `QueryClientProvider` inside `FrappeProvider`.

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cookieAuth, createFrappeClient } from 'frappe-js-client'
import { withExtended } from 'frappe-js-client/extended'
import { createRealtime } from 'frappe-js-client/realtime'
import { FrappeProvider } from 'frappe-react-query'

const queryClient = new QueryClient()
const frappe = withExtended(
    createFrappeClient({
        url: 'https://frappe.example.com',
        auth: cookieAuth(),
    }),
)
const realtime = createRealtime(frappe)

export function App({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <FrappeProvider
                client={frappe}
                realtime={realtime}
            >
                {children}
            </FrappeProvider>
        </QueryClientProvider>
    )
}
```

`realtime` is optional. Omit it when you do not need live invalidation.

## Query keys and queryOptions

These are the public primitive. Hooks are convenience wrappers.

```ts
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { frappeQueryKeys, frappeQueryOptions, useFrappe } from 'frappe-react-query'

const { client } = useFrappe()

useQuery(frappeQueryOptions.db.getDoc(client, 'ToDo', 'TD-0001'))
useSuspenseQuery(frappeQueryOptions.db.getDocList(client, 'ToDo', { fields: ['name', 'status'] }))

await queryClient.prefetchQuery(frappeQueryOptions.auth.loggedUser(client))
await queryClient.invalidateQueries({ queryKey: frappeQueryKeys.db.doctype('ToDo') })
```

Every `queryFn` forwards TanStack Query's `AbortSignal` as `RequestOptions.signal`.

This package does not set a global `staleTime`. Configure that on your `QueryClient`.

## Hooks

```tsx
import {
    useFrappeGetDoc,
    useFrappeGetDocList,
    useFrappeGetDocListInfinite,
    useFrappeCreateDoc,
    useFrappeUpdateDoc,
    useFrappeDeleteDoc,
    useFrappeAuth,
} from 'frappe-react-query'

const { data } = useFrappeGetDoc('ToDo', name)
const list = useFrappeGetDocList('ToDo', { fields: ['name', 'status'], limit: 20 })
const infinite = useFrappeGetDocListInfinite('ToDo', { limit: 20 })

const { createDoc, isPending } = useFrappeCreateDoc()
await createDoc({ doctype: 'ToDo', doc: { description: 'Ship it' } })

const { currentUser, login, logout } = useFrappeAuth()
```

Pass `{ realtime: true }` on document and list hooks to subscribe and invalidate those keys. Requires `realtime` on `FrappeProvider`.

Mutations return the full TanStack Query result plus a named `mutateAsync` alias (`createDoc`, `updateDoc`, `login`, …). Default `onSuccess` invalidates the matching doctype prefix; your `onSuccess` runs after that, it does not replace it.

Password fetches are mutations and are never written to the query cache.

## Entries

| Import                        | What it covers                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| `frappe-react-query`          | Provider, keys, options, db / auth / call / file / search hooks                             |
| `frappe-react-query/extended` | permission, site, workflow, report, desk — requires `withExtended(client)`                  |
| `frappe-react-query/realtime` | `useFrappeDocLive`, `useFrappeDocTypeLive`, `useFrappeDocViewers`, `useFrappeRealtimeEvent` |

```ts
import { useFrappeHasPermission, useFrappeGetQueuedReport, useFrappeGetTimeZone } from 'frappe-react-query/extended'
import { useFrappeDocLive } from 'frappe-react-query/realtime'
```

`db.paginate()` is an async generator on the client. Use `useFrappeGetDocListInfinite` (backed by `getDocListPage`) instead.

`auth.ping` is available as `frappeQueryOptions.auth.ping` for a cached health query. `useFrappePing` remains a mutation.

`useFrappeValidateLink` works on Frappe 14/15/16 when the client’s `frappeVersion` matches the site (on 16 it routes to `validate_link_and_fetch`). `useFrappeValidateLinkAndFetch` is the v16-only filtered variant and requires `frappeVersion: 16`; otherwise it fails with `FeatureNotSupportedError`.

`useFrappeGetQueuedReport` does not poll on its own. Pass `refetchInterval` when you want to watch prepared-report queues.

## Coverage

| Module | Client methods | Hook / `queryOptions` |
| --- | --- | --- |
| `db` | `getDoc`, `getDocList`, `getDocListPage`, `getCount`, `getLastDoc`, `exists`, `getValue`, `getSingle`, `getSingleValue`, `getMeta`, `copyDoc`, `validateLink`, `validateLinkAndFetch`, `isDocumentAmended` | queries (`getDocListPage` → infinite) |
| `db` | `createDoc`, `updateDoc`, `deleteDoc`, `setValue`, `setSingle`, `renameDoc`, `submit`, `cancel`, `runMethod`, `insertMany`, `updateMany`, `getPassword` | mutations (`getPassword` is never cached) |
| `auth` | `getLoggedUser`, `login`, `logout`, `forgetPassword`, `ping` | query + mutations; ping also has `queryOptions` |
| `call` | `get`, `post`, `put`, `delete`, `doctypeMethod`, `runDocMethod` | `get` is a query; the rest are mutations |
| `file` | `upload`, `download` | mutations |
| `search` | `searchLink`, `searchWidget`, `getLinkTitle` | queries |
| `permission` | `has`, `getForDoc` | queries (`./extended`) |
| `site` | `getTimeZone` | query (`./extended`) |
| `workflow` | `getTransitions`, `canCancelDocument`, `getCommonTransitionActions`, `apply`, `bulkApproval` | queries + mutations (`./extended`) |
| `report` | `get`, `getList`, `countRows`, `run`, `getScript`, `getQueued`, `prepare`, `stop`, `download` | queries + mutations (`./extended`) |
| `desk` | comments, tags, assignments, share | queries + mutations (`./extended`) |
| realtime | `subscribeDoc`, `subscribeDocType`, `subscribeDocViewers`, `on` | `./realtime` |

Left on the client: `db.paginate`, middleware, errors, testing, codegen, `formatFrappeDate` / `formatFrappeDatetime`, `withAuth` / `withMiddleware` / `withHeaders`, and realtime `connect` / `close`.

## Codegen types

Augment `Register` so hooks and `queryOptions` infer DocTypes from codegen output. After augmentation, `useFrappeGetDoc('ToDo', name)` resolves to your generated `ToDo` document type. Without it, `doctype` stays a `string` and you can still pass an explicit document generic.

```ts
import type { Docs } from './frappe.generated'

declare module 'frappe-react-query' {
    interface Register {
        docs: Docs
    }
}
```

## Testing

```ts
import { createTestClient } from 'frappe-js-client/testing'
import { FrappeProvider } from 'frappe-react-query'

const { client } = createTestClient()
```

Wrap tests in `QueryClientProvider` + `FrappeProvider`. Spy on `client.db.*` (or mock `MemoryTransport` routes) rather than replacing the client shape.

## License

MIT
