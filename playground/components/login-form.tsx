import type { ComponentProps, FormEvent } from 'react'

import { FrappeError } from 'frappe-js-client'
import { useFrappeAuth } from 'frappe-react-query'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { bootstrapCsrfToken } from '@/csrf'
import { cn, getErrorMessage } from '@/utils'

export function LoginForm({ className, ...props }: ComponentProps<'div'>) {
    const { login, currentUser } = useFrappeAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)

    if (currentUser) {
        return (
            <Navigate
                to="/todos"
                replace
            />
        )
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFormError(null)
        setIsSubmitting(true)

        const formData = new FormData(event.currentTarget)
        const username = String(formData.get('username') ?? '')
        const password = String(formData.get('password') ?? '')

        try {
            await login({ username, password })
            bootstrapCsrfToken()
        } catch (error) {
            setFormError(error instanceof FrappeError || error instanceof Error ? getErrorMessage(error) : 'Login failed')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div
            className={cn('flex flex-col gap-6', className)}
            {...props}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>Enter your Frappe username and password to continue.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="username">Username</FieldLabel>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Administrator"
                                    autoComplete="username"
                                    required
                                    disabled={isSubmitting}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    disabled={isSubmitting}
                                />
                            </Field>
                            {formError ? (
                                <Alert variant="destructive">
                                    <AlertDescription>{formError}</AlertDescription>
                                </Alert>
                            ) : null}
                            <Field>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2Icon className="animate-spin" />
                                            Logging in...
                                        </>
                                    ) : (
                                        'Login'
                                    )}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
