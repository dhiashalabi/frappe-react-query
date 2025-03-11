import { useCallback, useContext, useState } from 'react'
import { FrappeContext } from '../context/FrappeProvider'
import { FileArgs, FrappeError as Error, FrappeFileUploadResponse, FrappeConfig } from '../types'

interface UseFrappeFileUploadReturnType {
    /** Function to upload the file */
    upload: (file: File, args: FileArgs, apiPath?: string) => Promise<FrappeFileUploadResponse>
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
    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [isCompleted, setIsCompleted] = useState(false)

    const upload = useCallback(async (f: File, args: FileArgs, apiPath?: string) => {
        reset()
        setLoading(true)
        return file
            .uploadFile(
                f,
                args,
                (c, t) => {
                    if (t) {
                        setProgress(Math.round((c / t) * 100))
                    }
                },
                apiPath,
            )
            .then((r) => {
                setIsCompleted(true)
                setProgress(100)
                setLoading(false)
                return r.data.message
            })
            .catch((e) => {
                console.error(e)
                setError(e)
                setLoading(false)
                throw e
            })
    }, [])

    const reset = useCallback(() => {
        setProgress(0)
        setLoading(false)
        setError(null)
        setIsCompleted(false)
    }, [])

    return {
        upload,
        progress,
        loading,
        isCompleted,
        error,
        reset,
    }
}
