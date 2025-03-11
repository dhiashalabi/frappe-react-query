import { useCallback, useContext, useEffect, useState } from 'react'
import useSWR, { SWRConfiguration } from 'swr'
import { AuthCredentials, AuthResponse, FrappeError as Error, FrappeConfig } from '../types'
import { FrappeContext } from '../context/FrappeContext'

/**
 * Hook to start listening to user state and provides functions to login/logout
 *
 * @param options - [Optional] SWRConfiguration options for fetching current logged in user
 * @returns Returns an object with the following properties: currentUser, loading, error, and functions to login, logout and updateCurrentUser
 */
export const useFrappeAuth = (
    options?: SWRConfiguration,
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
    const { url, auth, tokenParams } = useContext(FrappeContext) as FrappeConfig

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

    const {
        data: currentUser,
        error,
        isLoading,
        isValidating,
        mutate: updateCurrentUser,
    } = useSWR<string | null, Error>(
        () => {
            if ((tokenParams && tokenParams.useToken) || userID) {
                return `${url}/api/method/frappe.auth.get_logged_user`
            } else {
                return null
            }
        },
        () => auth.getLoggedInUser(),
        {
            onError: () => {
                setUserID(null)
            },
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            ...options,
        },
    )

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
            .then(() => updateCurrentUser(null))
            .then(() => setUserID(null))
    }, [auth, updateCurrentUser])

    return {
        isLoading: userID === undefined || isLoading,
        currentUser,
        isValidating,
        error,
        login,
        logout,
        updateCurrentUser,
        getUserCookie,
    }
}
