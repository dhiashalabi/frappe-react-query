import { useCallback, useContext, useEffect, useState } from 'react'
import { FrappeContext } from '../context/FrappeContext'
import { DocumentUpdateEventData, DocTypeListUpdateEventData, ViewerEventData, FrappeConfig } from '../types'

/** useFrappeEventListener hook for listening to events from the server
 * @param eventName - name of the event to listen to
 * @param callback - callback function to be called when the event is triggered. The callback function will receive the data sent from the server. It is recommended to memoize this function.
 *
 * @example
 * ```typescript
 * useFrappeEventListener('my_event', (data) => {
 *      if(data.status === 'success') {
 *          console.log('success')
 *      }
 * })
 * ```
 */
export const useFrappeEventListener = <T = any>(eventName: string, callback: (eventData: T) => void) => {
    const { socket } = useContext(FrappeContext) as FrappeConfig

    useEffect(() => {
        if (socket === undefined) {
            console.warn('Socket is not enabled. Please enable socket in FrappeProvider.')
        }
        const listener = socket?.on(eventName, callback)

        return () => {
            listener?.off(eventName)
        }
    }, [eventName, callback, socket])
}

/**
 * Hook for listening to document events.
 * The hook will automatically subscribe to the document room, and unsubscribe when the component unmounts.
 * The hook listens to the following events:
 * - doc_update: This is triggered when the document is updated. The callback function will receive the updated document.
 * - doc_viewers: This is triggered when the list of viewers of the document changes. The hook will update the viewers state with the list of viewers.
 *
 * @param doctype Name of the doctype
 * @param docname Name of the document
 * @param emitOpenCloseEventsOnMount [Optional] If true, the hook will emit doc_open and doc_close events on mount and unmount respectively. Defaults to true.
 * @param onUpdateCallback Function to be called when the document is updated. It is recommended to memoize this function.
 * @returns viewers - array of userID's, emitDocOpen - function to emit doc_open event, emitDocClose - function to emit doc_close event
 */
export const useFrappeDocumentEventListener = (
    doctype: string,
    docname: string,
    onUpdateCallback: (eventData: DocumentUpdateEventData) => void,
    emitOpenCloseEventsOnMount: boolean = true,
) => {
    const { socket } = useContext(FrappeContext) as FrappeConfig

    /** Array of user IDs of users currently viewing the document. This is updated when "doc_viewers" event is published */
    const [viewers, setViewers] = useState<string[]>([])

    useEffect(() => {
        if (socket === undefined) {
            console.warn('Socket is not enabled. Please enable socket in FrappeProvider.')
        }
        socket?.emit('doc_subscribe', doctype, docname)

        // Re-subscribe on reconnect
        socket?.io.on('reconnect', () => {
            socket?.emit('doc_subscribe', doctype, docname)
        })

        if (emitOpenCloseEventsOnMount) {
            socket?.emit('doc_open', doctype, docname)
        }

        return () => {
            socket?.emit('doc_unsubscribe', doctype, docname)
            if (emitOpenCloseEventsOnMount) {
                socket?.emit('doc_close', doctype, docname)
            }
        }
    }, [doctype, docname, emitOpenCloseEventsOnMount, socket])

    useFrappeEventListener('doc_update', onUpdateCallback)

    /**
     * Emit doc_open event - this will explicitly send a doc_open event to the server.
     */
    const emitDocOpen = useCallback(() => {
        socket?.emit('doc_open', doctype, docname)
    }, [doctype, docname, socket])

    /**
     * Emit doc_close event - this will explicitly send a doc_close event to the server.
     */
    const emitDocClose = useCallback(() => {
        socket?.emit('doc_close', doctype, docname)
    }, [doctype, docname, socket])

    const onViewerEvent = useCallback(
        (data: ViewerEventData) => {
            if (data.doctype === doctype && data.docname === docname) {
                setViewers(data.users)
            }
        },
        [doctype, docname],
    )

    useFrappeEventListener('doc_viewers', onViewerEvent)

    return {
        /** Array of user IDs of users currently viewing the document. This is updated when "doc_viewers" event is published */
        viewers,
        /** Emit doc_open event - this will explicitly send a doc_open event to the server. */
        emitDocOpen,
        /** Emit doc_close event - this will explicitly send a doc_close event to the server. */
        emitDocClose,
    }
}

/**
 * Hook for listening to doctype events.
 * The hook will automatically subscribe to the doctype room, and unsubscribe when the component unmounts.
 * The hook listens to the following event:
 * - list_update: This is triggered when a document of the doctype is updated (created, modified or deleted). The callback function will receive the updated document.
 *
 * @param doctype Name of the doctype
 * @param onListUpdateCallback Function to be called when the document is updated. It is recommended to memoize this function.
 */
export const useFrappeDocTypeEventListener = (
    doctype: string,
    onListUpdateCallback: (eventData: DocTypeListUpdateEventData) => void,
) => {
    const { socket } = useContext(FrappeContext) as FrappeConfig

    useEffect(() => {
        if (socket === undefined) {
            console.warn('Socket is not enabled. Please enable socket in FrappeProvider.')
        }
        socket?.emit('doctype_subscribe', doctype)

        // Re-subscribe on reconnect
        socket?.io.on('reconnect', () => {
            socket?.emit('doctype_subscribe', doctype)
        })
        return () => {
            socket?.emit('doctype_unsubscribe', doctype)
        }
    }, [doctype, socket])

    useFrappeEventListener('list_update', onListUpdateCallback)
}
