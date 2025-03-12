import { useCallback, useContext, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { FrappeContext } from '../context/FrappeContext'
import { FileArgs, FrappeError as Error, FrappeFileUploadResponse, FrappeConfig } from '../types'

interface UseFrappeFileUploadReturnType<T = FrappeFileUploadResponse> {
    /** Function to upload the file */
    upload: (file: File, args: FileArgs, apiPath?: string) => Promise<T>
    /** Upload Progress in % - rounded off */
    progress: number
    /** Will be true when the file is being uploaded  */
    loading: boolean
    /** Error object returned from API call */
    error: Error | null
    /** Will be true if file upload is successful. Else false */
    isCompleted: boolean
    /** Function to reset the state of the hook */
    reset: () => void
}

/**
 * Hook to upload files to the server
 *
 * @returns an object with the following properties: loading, error, isCompleted , result, and call and reset functions
 *
 * @example
 *
 * const { upload, progress, loading, error, isCompleted, reset } = useFrappeFileUpload()
 *
 * const onSubmit = async () => {
 *      const message = await upload(myFile, { doctype: "User", docname: "test@example.com", fieldname: "profile_pic", is_private: 1 })
 * }
 */
export const useFrappeFileUpload = (): UseFrappeFileUploadReturnType => {
    const { file } = useContext(FrappeContext) as FrappeConfig
    const [uploadProgress, setUploadProgress] = useState(0)

    const mutation = useMutation<
        FrappeFileUploadResponse,
        Error,
        {
            f: File
            args: FileArgs
            apiPath?: string
            onProgress?: (
                bytesUploaded: number,
                totalBytes?: number,
                progress?: import('axios').AxiosProgressEvent,
            ) => void
        }
    >({
        mutationFn: async ({ f, args, apiPath, onProgress }) => {
            return file.uploadFile(f, args, onProgress, apiPath).then((r) => r.data.message)
        },
    })

    const upload = useCallback(
        async (f: File, args: FileArgs, apiPath?: string) => {
            setUploadProgress(0)
            return mutation.mutateAsync({
                f,
                args,
                apiPath,
                onProgress: (bytesUploaded: number, totalBytes?: number) => {
                    if (totalBytes) {
                        setUploadProgress(Math.round((bytesUploaded / totalBytes) * 100))
                    }
                },
            })
        },
        [mutation],
    )

    const reset = useCallback(() => {
        setUploadProgress(0)
        mutation.reset()
    }, [mutation])

    return {
        upload,
        progress: mutation.isSuccess ? 100 : uploadProgress,
        loading: mutation.isPending,
        error: mutation.error as Error | null,
        isCompleted: mutation.isSuccess,
        reset,
    }
}
