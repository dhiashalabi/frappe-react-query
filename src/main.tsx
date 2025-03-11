import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { FrappeProvider } from './lib'
import './index.css'
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

createRoot(rootElement).render(
    <StrictMode>
        <FrappeProvider
            url="http://dev.localhost:8000"
            enableSocket={false}
        >
            <App />
        </FrappeProvider>
    </StrictMode>,
)
