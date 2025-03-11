import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AuthCredentials, AuthResponse, FrappeError as Error, FrappeConfig } from '../types'
import { FrappeContext } from '../context/FrappeContext'

/**
 * Hook to start listening to user state and provides functions to login/logout
 *
 * @param options - [Optional] React Query configuration options for fetching current logged in user
 * @returns Returns an object with the following properties: currentUser, loading, error, and functions to login, logout and updateCurrentUser
 */
export const useFrappeAuth = (
    options?: any, // Keeping the options type flexible for backward compatibility
): {
    /** The current logged in user. Will be null/undefined if user is not logged in */
    currentUser: string | null | undefined
    /** Will be true when the hook is fetching user data  */
    isLoading: boolean
    /** Will be true when the hook is fetching (or revalidating) the user state. (Refer to isValidating in useSWR)  */
    isValidating: boolean
    /** Error object returned from API call */
    error: Error | null | undefined
    /** Function to login the user with email and password */
    // login: ({username, password,otp,tmp_id}:AuthCredentials) => Promise<AuthResponse>,
    login: (credentials: AuthCredentials) => Promise<AuthResponse>
    /** Function to log the user out */
    logout: () => Promise<void>
    /** Function to fetch updated user state */
    updateCurrentUser: () => void
    /** Function to get the user cookie and */
    getUserCookie: () => void
} => {
    const { auth, tokenParams } = useContext(FrappeContext) as FrappeConfig
    const queryClient = useQueryClient()
    const [userID, setUserID] = useState<string | null | undefined>()

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
        //Only get user cookie if token is not used
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
        isFetching: isValidating,
        refetch: updateCurrentUser,
    } = useQuery({
        queryKey,
        queryFn: () => auth.getLoggedInUser(),
        enabled: !!(tokenParams?.useToken || userID),
        retry: false,
        refetchOnWindowFocus: false,
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
        isValidating,
        error: error as Error | null | undefined,
        login,
        logout,
        updateCurrentUser,
        getUserCookie,
    }
}
