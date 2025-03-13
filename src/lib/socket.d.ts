import { TokenParams } from '@mussnad/frappe-js-client/dist/frappe/types'
import { Socket } from 'socket.io-client'

declare module 'socket.io-client/dist/socket.io' {
    export class SocketIO {
        private socket_port: string | undefined
        private host: string
        private port: string
        private protocol: string
        private url: string
        socket: Socket
        constructor(url?: string, site_name?: string, socket_port?: string, tokenParams?: TokenParams)
    }
}
