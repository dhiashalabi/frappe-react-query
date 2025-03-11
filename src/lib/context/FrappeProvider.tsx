import { PropsWithChildren, useMemo } from 'react'
import { FrappeApp } from '@mussnad/frappe-js-client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FrappeConfig, TokenParams } from '../types'
import { SocketIO } from '../socket'
import { FrappeContext } from './FrappeContext'

type FrappeProviderProps = PropsWithChildren<{
    /** URL of the Frappe server
     *
     * Only needed if the URL of the window is not the same as the Frappe server URL */
    url?: string
    /** Token parameters to be used for authentication
     *
     * Only needed for token based authentication */
    tokenParams?: TokenParams
    /** Port on which Socket is running. Only meant for local development. Set to undefined on production. */
    socketPort?: string
    /** Get this from frappe.local.site on the server, or frappe.boot.sitename on the window.
     * Required for Socket connection to work in Frappe v15+
     */
    siteName?: string
    /** Flag to disable socket, if needed. This defaults to true. */
    enableSocket?: boolean
    /** QueryClient options - these will be applied globally unless overridden */
    queryClient?: QueryClient
    /** Custom Headers to be passed in each request */
    customHeaders?: object
}>

export const FrappeProvider = ({
    url = '',
    tokenParams,
    socketPort,
    queryClient,
    siteName,
    enableSocket = true,
    children,
    customHeaders,
}: FrappeProviderProps) => {
    // Create a default QueryClient if none is provided
    const defaultQueryClient = useMemo(() => new QueryClient(), [])
    const client = queryClient || defaultQueryClient

    const frappeConfig: FrappeConfig = useMemo(() => {
        //Add your Frappe backend's URL
        const frappe = new FrappeApp(url, tokenParams, undefined, customHeaders)

        return {
            url,
            tokenParams,
            app: frappe,
            auth: frappe.auth(),
            db: frappe.db(),
            call: frappe.call(),
            file: frappe.file(),
            socket: enableSocket ? new SocketIO(url, siteName, socketPort, tokenParams).socket : undefined,
            enableSocket,
            socketPort,
        }
    }, [url, tokenParams, socketPort, enableSocket, customHeaders, siteName])

    return (
        <FrappeContext.Provider value={frappeConfig}>
            <QueryClientProvider client={client}>{children}</QueryClientProvider>
        </FrappeContext.Provider>
    )
}
