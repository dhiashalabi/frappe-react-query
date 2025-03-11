import { useContext } from 'react'
import { FrappeContext } from '../context/FrappeContext'

export const useFrappe = () => {
    const context = useContext(FrappeContext)
    if (!context) {
        throw new Error('useFrappe must be used within a FrappeProvider')
    }
    return context
}

export const useFrappeAuth = () => useFrappe().auth
export const useFrappeDB = () => useFrappe().db
export const useFrappeCall = () => useFrappe().call
export const useFrappeFile = () => useFrappe().file
export const useFrappeSocket = () => useFrappe().socket
export const useFrappeApp = () => useFrappe().app
export const useFrappeConfig = () => useFrappe()
