import { useFrappeAuth } from '../lib'
import styles from './login.module.css'

export const Login = () => {
    const { authResponse, currentUser, isLoading, login, error } = useFrappeAuth()

    console.log(authResponse)
    console.log(currentUser)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const username = formData.get('username') as string
        const password = formData.get('password') as string
        login({ username, password })
    }

    return (
        <div className={styles.loginContainer}>
            <h1 className={styles.title}>Welcome Back</h1>
            <form
                onSubmit={handleSubmit}
                className={styles.form}
            >
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className={styles.input}
                        disabled={isLoading}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className={styles.input}
                        disabled={isLoading}
                    />
                </div>
                {error && <div className={styles.error}>{error.message}</div>}
                <button
                    type="submit"
                    className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}

export const Logout = () => {
    const { logout } = useFrappeAuth()
    return (
        <button
            onClick={logout}
            className={styles.logoutButton}
        >
            Logout
        </button>
    )
}
