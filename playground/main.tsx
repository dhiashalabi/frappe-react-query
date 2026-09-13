import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cookieAuth, createFrappeClient } from 'frappe-js-client'
import { createRealtime } from 'frappe-js-client/realtime'
import { FrappeProvider } from 'frappe-react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { bootstrapCsrfToken } from './csrf'
import './frappe.generated'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

bootstrapCsrfToken()

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5000,
        },
    },
})

const frappe = createFrappeClient({
    url: window.location.origin,
    auth: cookieAuth(),
    siteName: 'frappe16.localhost',
    apiVersion: 2,
    frappeVersion: 16,
})
const realtime = createRealtime(frappe)

createRoot(rootElement).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <FrappeProvider
                client={frappe}
                realtime={realtime}
            >
                <App />
            </FrappeProvider>
        </QueryClientProvider>
    </StrictMode>,
)
