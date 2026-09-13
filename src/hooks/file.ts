import type { FileArgs, FileDoc, FrappeUploadInput, UploadOptions } from 'frappe-js-client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import type { FrappeMutationOptions } from '../types'

import { invalidateDoctype } from '../query/invalidation'
import { mergeMutationOptions } from '../query/merge'
import { useFrappe } from './useFrappe'

export interface FileUploadVariables {
    file: FrappeUploadInput
    args: FileArgs
    options?: UploadOptions
}

export function useFrappeFileUpload<T = FileDoc>(options?: FrappeMutationOptions<T, FileUploadVariables>) {
    const { client } = useFrappe()
    const queryClient = useQueryClient()
    const [progress, setProgress] = useState(0)

    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: async ({ file, args, options: uploadOptions }) => {
                    setProgress(0)
                    return client.file.upload<T>(file, args, {
                        ...uploadOptions,
                        onProgress: (event) => {
                            if (event.total) {
                                setProgress(Math.round((event.loaded / event.total) * 100))
                            }
                            uploadOptions?.onProgress?.(event)
                        },
                    })
                },
                onSuccess: (_data, { args }) => {
                    if (args.doctype) return invalidateDoctype(queryClient, args.doctype)
                },
            },
            options,
        ),
    )

    return {
        ...mutation,
        progress: mutation.isSuccess ? 100 : progress,
        upload: mutation.mutateAsync,
    }
}

export function useFrappeFileDownload(options?: FrappeMutationOptions<Blob, string>) {
    const { client } = useFrappe()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: (fileURL) => client.file.download(fileURL),
            },
            options,
        ),
    )
    return { ...mutation, download: mutation.mutateAsync }
}
