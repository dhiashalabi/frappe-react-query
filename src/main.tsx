import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { FrappeProvider } from './lib'
import './index.css'
import { QueryClient } from '@tanstack/react-query'
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5000,
        },
    },
})

createRoot(rootElement).render(
    <StrictMode>
        <FrappeProvider
            url="http://dev.localhost:8000"
            enableSocket={false}
            queryClient={queryClient}
        >
            <App />
        </FrappeProvider>
    </StrictMode>,
)
