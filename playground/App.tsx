import { useFrappeAuth } from 'frappe-react-query'
import { useEffect } from 'react'
import { BrowserRouter, Link, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { bootstrapCsrfToken } from '@/csrf'
import { LoginPage } from '@/pages/Login'
import { TodoDetail } from '@/pages/TodoDetail'
import { Todos } from '@/pages/Todos'

function HomeRedirect() {
    const { currentUser, isLoading } = useFrappeAuth()

    if (isLoading) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <Skeleton className="h-8 w-40" />
            </div>
        )
    }

    return (
        <Navigate
            to={currentUser ? '/todos' : '/login'}
            replace
        />
    )
}

function AppShell() {
    const { currentUser, isLoading, logout } = useFrappeAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (currentUser) bootstrapCsrfToken()
    }, [currentUser])

    if (isLoading) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <Skeleton className="h-8 w-40" />
            </div>
        )
    }

    if (!currentUser) {
        return (
            <Navigate
                to="/login"
                replace
            />
        )
    }

    const handleLogout = async () => {
        await logout()
        navigate('/login', { replace: true })
    }

    return (
        <div className="min-h-svh bg-background">
            <header className="border-b">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
                    <div className="flex items-center gap-4">
                        <span className="font-heading text-sm font-medium">Frappe React Query</span>
                        <Separator
                            orientation="vertical"
                            className="h-4 self-auto"
                        />
                        <Link
                            to="/todos"
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            ToDos
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{currentUser}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => void handleLogout()}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={<LoginPage />}
                />
                <Route element={<AppShell />}>
                    <Route
                        path="/todos"
                        element={<Todos />}
                    />
                    <Route
                        path="/todos/:name"
                        element={<TodoDetail />}
                    />
                </Route>
                <Route
                    path="/"
                    element={<HomeRedirect />}
                />
                <Route
                    path="*"
                    element={<HomeRedirect />}
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App
