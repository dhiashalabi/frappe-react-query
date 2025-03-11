import { useState } from 'react'
import { useFrappeGetCall, useFrappePrefetchCall } from './lib'
import './App.css'
import { Login, Logout } from './components/login'

function App() {
    const [mounted, setMounted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const preload = useFrappePrefetchCall('ping')

    const onClick = () => {
        setIsLoading(true)
        preload()

        setTimeout(() => {
            setMounted(true)
            setIsLoading(false)
        }, 3000)
    }

    return (
        <div className="App">
            <h1>Frappe Query SDK</h1>
            <div className="card">
                <button
                    onClick={onClick}
                    className={`prefetch-button ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Prefetching...' : 'Start Query'}
                </button>
                {mounted && <FetchingComponent />}
                <Login />
                <Logout />
            </div>
        </div>
    )
}

const FetchingComponent = () => {
    const { data, error } = useFrappeGetCall('ping')

    return (
        <div className="response-container">
            {error ? (
                <div className="error-message">Error: {error.message}</div>
            ) : (
                <div className="success-message">{data?.message || 'Waiting for response...'}</div>
            )}
        </div>
    )
}

export default App
