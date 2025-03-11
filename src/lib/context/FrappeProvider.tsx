import { PropsWithChildren, createContext, useContext, useMemo } from 'react'
import { FrappeApp } from '@mussnad/frappe-js-client'
import { SWRConfig, SWRConfiguration } from 'swr'
import { FrappeConfig, TokenParams } from '../types'
import { SocketIO } from '../socket'

export const FrappeContext = createContext<null | FrappeConfig>(null)

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
    /** SWR Configuration options - these will be applied globally unless overridden */
    swrConfig?: SWRConfiguration
    /** Custom Headers to be passed in each request */
    customHeaders?: object
}>

export const FrappeProvider = ({
    url = '',
    tokenParams,
    socketPort,
    swrConfig,
    siteName,
    enableSocket = true,
    children,
    customHeaders,
}: FrappeProviderProps) => {
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
    }, [url, tokenParams, socketPort, enableSocket, customHeaders])

    return (
        <FrappeContext.Provider value={frappeConfig}>
            <SWRConfig value={swrConfig}>{children}</SWRConfig>
        </FrappeContext.Provider>
    )
}

export const useFrappe = () => {
    const context = useContext(FrappeContext)
    if (!context) {
        throw new Error('useFrappe must be used within a FrappeProvider')
    }
    return context
}

export const useFrappeAuth = () => {
    const context = useFrappe()
    return context.auth
}

export const useFrappeDB = () => {
    const context = useFrappe()
    return context.db
}

export const useFrappeCall = () => {
    const context = useFrappe()
    return context.call
}

export const useFrappeFile = () => {
    const context = useFrappe()
    return context.file
}

export const useFrappeSocket = () => {
    const context = useFrappe()
    return context.socket
}

export const useFrappeApp = () => {
    const context = useFrappe()
    return context.app
}

export const useFrappeConfig = () => {
    const context = useFrappe()
    return context
}
