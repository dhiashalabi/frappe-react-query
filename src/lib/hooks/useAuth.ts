import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AuthCredentials, AuthResponse, FrappeError as Error, FrappeAuthConfig, FrappeConfig } from '../types'
import { FrappeContext } from '../context/FrappeContext'

interface FrappeAuthReturn {
    currentUser: string | null | undefined
    isLoading: boolean
    isFetching: boolean
    error: Error | null | undefined
    login: (credentials: AuthCredentials) => Promise<AuthResponse>
    logout: () => Promise<void>
    updateCurrentUser: () => void
    getUserCookie: () => void
}

/**
 * Hook to start listening to user state and provides functions to login/logout
 *
 * @param options - [Optional] React Query configuration options for fetching current logged in user
 * @param configs - [Optional] Additional configurations for the auth hook
 *
 * @returns Returns an object with the following properties: currentUser, loading, error, and functions to login, logout and updateCurrentUser
 *
 * @example
 *
 * const { currentUser, isLoading, isFetching, error, login, logout, updateCurrentUser, getUserCookie } = useFrappeAuth()
 * With configs:
 * const { currentUser, isLoading, isFetching, error, login, logout, updateCurrentUser, getUserCookie } = useFrappeAuth(
 *     {},
 *     {
 *         userCheckMethod: 'frappe.auth.get_logged_user',
 *     },
 * )
 */
export const useFrappeAuth = (
    options?: any, // Keeping the options type flexible for backward compatibility
    configs?: FrappeAuthConfig, // Additional configurations for the auth hook
): FrappeAuthReturn => {
    const { auth, tokenParams } = useContext(FrappeContext) as FrappeConfig
    const [userID, setUserID] = useState<string | null | undefined>()
    const queryClient = useQueryClient()

    const getUserCookie = useCallback(() => {
        const userCookie = document.cookie.split(';').find((c) => c.trim().startsWith('user_id='))
        if (userCookie) {
            const userName = userCookie.split('=')[1]
            if (userName && userName !== 'Guest') {
                setUserID(userName)
            } else {
                setUserID(null)
            }
        } else {
            setUserID(null)
        }
    }, [])

    useEffect(() => {
        //Only get user cookie if token is not used and userID is not set
        if (tokenParams && tokenParams.useToken) {
            setUserID(null)
        } else {
            getUserCookie()
        }
    }, [getUserCookie, tokenParams])

    const queryKey = useMemo(() => ['logged-user'], [])

    const {
        data: currentUser,
        error,
        isLoading,
        isFetching,
        refetch: updateCurrentUser,
    } = useQuery({
        queryKey,
        queryFn: () => auth.getLoggedInUser(configs?.userCheckMethod),
        enabled: !!(tokenParams?.useToken || userID || configs?.realtimeUserValidation),
        retry: false,
        refetchOnWindowFocus: false,
        refetchInterval: configs?.realtimeUserValidation ? 10000 : false,
        ...options,
        onError: () => {
            setUserID(null)
            if (options?.onError) {
                options.onError()
            }
        },
    })

    const login = useCallback(
        async (credentials: AuthCredentials) => {
            return auth.loginWithUsernamePassword(credentials).then((m) => {
                getUserCookie()
                return m
            })
        },
        [auth, getUserCookie],
    )

    const logout = useCallback(async () => {
        return auth
            .logout()
            .then(() => queryClient.setQueryData(queryKey, null))
            .then(() => setUserID(null))
    }, [auth, queryClient, queryKey])

    return {
        isLoading: userID === undefined || isLoading,
        currentUser: currentUser as string | null | undefined,
        isFetching: isFetching,
        error: error as Error | null | undefined,
        login,
        logout,
        updateCurrentUser,
        getUserCookie,
    }
}
