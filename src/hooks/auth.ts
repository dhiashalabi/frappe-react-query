import type { AuthCredentials, AuthResponse } from 'frappe-js-client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { FrappeMutationOptions, FrappeQueryOptions } from '../types'

import { frappeQueryKeys } from '../query/keys'
import { mergeMutationOptions } from '../query/merge'
import { frappeQueryOptions } from '../query/options'
import { useFrappe } from './useFrappe'

export function useFrappeLoggedUser(options?: FrappeQueryOptions<string>) {
    const { client } = useFrappe()
    return useQuery(frappeQueryOptions.auth.loggedUser(client, options))
}

export function useFrappeLogin(options?: FrappeMutationOptions<AuthResponse, AuthCredentials>) {
    const { client } = useFrappe()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: (credentials) => client.auth.login(credentials),
                onSuccess: async () => {
                    const user = await client.auth.getLoggedUser()
                    queryClient.setQueryData(frappeQueryKeys.auth.loggedUser, user)
                    await queryClient.invalidateQueries({ queryKey: frappeQueryKeys.auth.all })
                    await queryClient.invalidateQueries({ queryKey: frappeQueryKeys.permission.all })
                },
            },
            options,
        ),
    )
    return { ...mutation, login: mutation.mutateAsync }
}

export function useFrappeLogout(options?: FrappeMutationOptions<void, void>) {
    const { client } = useFrappe()
    const queryClient = useQueryClient()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: () => client.auth.logout(),
                onSuccess: () => queryClient.removeQueries({ queryKey: frappeQueryKeys.all }),
            },
            options,
        ),
    )
    return { ...mutation, logout: mutation.mutateAsync }
}

export function useFrappePing(options?: FrappeMutationOptions<string, void>) {
    const { client } = useFrappe()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: () => client.auth.ping(),
            },
            options,
        ),
    )
    return { ...mutation, ping: mutation.mutateAsync }
}

export function useFrappeForgetPassword(options?: FrappeMutationOptions<void, string>) {
    const { client } = useFrappe()
    const mutation = useMutation(
        mergeMutationOptions(
            {
                mutationFn: (user) => client.auth.forgetPassword(user),
            },
            options,
        ),
    )
    return { ...mutation, forgetPassword: mutation.mutateAsync }
}

export function useFrappeAuth(options?: FrappeQueryOptions<string>) {
    const logged = useFrappeLoggedUser(options)
    const loginMutation = useFrappeLogin()
    const logoutMutation = useFrappeLogout()

    return {
        currentUser: logged.error ? null : (logged.data ?? null),
        error: logged.error,
        isLoading: logged.isLoading,
        isFetching: logged.isFetching,
        refetch: logged.refetch,
        login: loginMutation.login,
        logout: logoutMutation.logout,
        loginMutation,
        logoutMutation,
    }
}
