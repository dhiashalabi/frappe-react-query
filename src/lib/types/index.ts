import { FrappeApp, FrappeAuth, FrappeCall, FrappeClient } from '@mussnad/frappe-js-client'
import { FrappeDB } from '@mussnad/frappe-js-client/dist/db'
import { FrappeFileUpload } from '@mussnad/frappe-js-client/dist/file'
import { FrappeError } from '@mussnad/frappe-js-client/dist/frappe/types'
import { Filter, FrappeDoc, GetDocListArgs } from '@mussnad/frappe-js-client/dist/db/types'
import { FileArgs } from '@mussnad/frappe-js-client/dist/file/types'
import { Socket } from 'socket.io-client'
import {
    AuthCredentials,
    AuthResponse,
    OTPCredentials,
    UserPassCredentials,
} from '@mussnad/frappe-js-client/dist/auth/types'

export type {
    OTPCredentials,
    UserPassCredentials,
    AuthCredentials,
    AuthResponse,
    FrappeDoc,
    GetDocListArgs,
    Filter,
    FileArgs,
    FrappeError,
}

export interface FrappeConfig {
    /** The URL of your Frappe server */
    url: string
    tokenParams?: TokenParams
    app: FrappeApp
    auth: FrappeAuth
    db: FrappeDB
    call: FrappeCall
    client: FrappeClient
    file: FrappeFileUpload
    socket?: Socket
    /** Whether to sync user authentication in realtime */
    realtimeUserAuthSync?: boolean
}

export interface FrappeAuthConfig {
    /** Whether to sync user authentication in realtime */
    realtimeUserValidation?: boolean
    /** Method to check if user is authenticated */
    userCheckMethod?: string
}

export interface TokenParams {
    /** Whether to use token for API calls */
    useToken: boolean
    /** Function that returns the token as a string - this could be fetched from LocalStorage or auth providers like Firebase, Auth0 etc. */
    token?: () => string
    /** Type of token to be used for authentication */
    type: 'Bearer' | 'token'
}

export interface SearchResult {
    value: string
    label: string
    description: string
}

export interface ValidateLinkResponse<T extends readonly string[]> {
    message: {
        [K in T[number]]: string
    }
}

export interface ViewerEventData {
    doctype: string
    docname: string
    users: string[]
}

export interface DocumentUpdateEventData {
    doctype: string
    name: string
    modified: string
}

export interface DocTypeListUpdateEventData {
    doctype: string
    name: string
    user: string
}

export interface FrappeFileUploadResponse {
    /** Name of the file document in the database */
    name: string
    owner: string
    creation: string
    modified: string
    modified_by: string
    docstatus: 0 | 1 | 2
    idx: number
    /** Name of the uploaded file */
    file_name: string
    /** File is not accessible by guest users */
    is_private: 1 | 0
    is_home_folder: 0 | 1
    is_attachments_folder: 0 | 1
    /** File size in bytes */
    file_size: number
    /** Path of the file ex: /private/files/file_name.jpg  */
    file_url: string
    folder: string
    is_folder: 0 | 1
    /** Doctype the file is linked to */
    attached_to_doctype: string
    /** Document the file is linked to */
    attached_to_name: string
    content_hash: string
    uploaded_to_dropbox: 0 | 1
    uploaded_to_google_drive: 0 | 1
    doctype: 'File'
}

/**
 * Response type for the getCount method
 * @typeParam T - The type definition of the document object
 * @typeParam K - The type of the document for args
 *
 * @example
 * const { data, error, isFetching } = useGetCount('User')
 */
export interface GetCountResponse {
    /** The number of documents in the database */
    count: number
}
