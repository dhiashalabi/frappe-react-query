import { type ClassValue, clsx } from 'clsx'
import { FrappeError } from 'frappe-js-client'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown) {
    if (error instanceof FrappeError) {
        return error.serverMessages?.[0]?.message ?? error.message
    }
    if (error instanceof Error) {
        return error.message
    }
    return 'Something went wrong'
}
