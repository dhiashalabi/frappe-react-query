import type { UseMutationOptions } from '@tanstack/react-query'
import type { FrappeError } from 'frappe-js-client'

export function mergeMutationOptions<TData, TVariables>(
    defaults: UseMutationOptions<TData, FrappeError, TVariables>,
    user?: Omit<UseMutationOptions<TData, FrappeError, TVariables>, 'mutationFn'>,
): UseMutationOptions<TData, FrappeError, TVariables> {
    return {
        ...defaults,
        ...user,
        onSuccess: async (data, variables, onMutateResult, context) => {
            await defaults.onSuccess?.(data, variables, onMutateResult, context)
            await user?.onSuccess?.(data, variables, onMutateResult, context)
        },
        onError: async (error, variables, onMutateResult, context) => {
            await defaults.onError?.(error, variables, onMutateResult, context)
            await user?.onError?.(error, variables, onMutateResult, context)
        },
        onSettled: async (data, error, variables, onMutateResult, context) => {
            await defaults.onSettled?.(data, error, variables, onMutateResult, context)
            await user?.onSettled?.(data, error, variables, onMutateResult, context)
        },
    }
}

export function withoutRealtime<T extends { realtime?: boolean }>(options?: T): Omit<T, 'realtime'> | undefined {
    if (!options) return undefined
    const { realtime: _realtime, ...rest } = options
    return rest
}
