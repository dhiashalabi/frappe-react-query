# @mussnad/frappe-react-query

A powerful React Query SDK for Frappe Framework, providing seamless integration between React applications and Frappe backend services.

[![npm version](https://badge.fury.io/js/@mussnad%2Ffrappe-react-query.svg)](https://badge.fury.io/js/@mussnad%2Ffrappe-react-query)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔄 Real-time data synchronization with Frappe backend
- 🎣 Custom React hooks for common Frappe operations
- 🔍 Built-in search functionality
- 📝 Document CRUD operations
- 🔐 Authentication management
- 📁 File upload capabilities
- 🌐 Socket.io integration
- 🚀 Built on top of @tanstack/react-query

## Installation

```bash
npm install @mussnad/frappe-react-query
# or
yarn add @mussnad/frappe-react-query
# or
pnpm add @mussnad/frappe-react-query
```

## Dependencies

The package requires the following peer dependencies:

- React ^19.0.0
- React DOM ^19.0.0
- @tanstack/react-query ^5.67.3
- socket.io-client ^4.8.1

## Quick Start

1. Wrap your application with `FrappeProvider`:

```tsx
import { FrappeProvider } from '@mussnad/frappe-react-query'

function App() {
    return (
        <FrappeProvider>
            <YourApp />
        </FrappeProvider>
    )
}
```

2. Start using the hooks in your components:

```tsx
import { useFrappeGetDoc } from '@mussnad/frappe-react-query'

function UserProfile() {
    const { data, isLoading, error } = useFrappeGetDoc('User', 'john.doe@example.com')

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    return <div>Welcome {data?.full_name}</div>
}
```

## Core Hooks

### Document Operations

#### `useFrappeGetDoc`

Fetch a single document from the database.

```tsx
const { data, error, isValidating, mutate } = useFrappeGetDoc<T>(
  doctype: string,
  name?: string,
  queryKey?: readonly any[],
  options?: UseQueryOptions
)
```

#### `useFrappeGetDocList`

Fetch a list of documents with filtering and pagination.

```tsx
const { data, error, isValidating, mutate } = useFrappeGetDocList<T>(
  doctype: string,
  args?: GetDocListArgs<T>,
  queryKey?: readonly any[],
  options?: UseQueryOptions
)
```

#### `useFrappeCreateDoc`

Create a new document.

```tsx
const { createDoc, loading, error, isCompleted, reset } = useFrappeCreateDoc<T>()

// Usage
await createDoc(doctype, documentData)
```

#### `useFrappeUpdateDoc`

Update an existing document.

```tsx
const { updateDoc, loading, error, isCompleted, reset } = useFrappeUpdateDoc<T>()

// Usage
await updateDoc(doctype, docname, updates)
```

#### `useFrappeDeleteDoc`

Delete a document.

```tsx
const { deleteDoc, loading, error, isCompleted, reset } = useFrappeDeleteDoc()

// Usage
await deleteDoc(doctype, docname)
```

### Authentication

#### `useFrappeAuth`

Manage authentication state and operations.

```tsx
const {
  currentUser,
  isLoading,
  isValidating,
  error,
  login,
  logout,
  updateCurrentUser,
  getUserCookie
} = useFrappeAuth(options?)

// Login
await login({ username, password })

// Logout
await logout()
```

### Search

#### `useSearch`

Search for documents in Frappe v15+.

```tsx
const { data, error, isLoading, mutate } = useSearch(
  doctype: string,
  text: string,
  filters?: Filter[],
  limit?: number,
  debounce?: number
)
```

### API Calls

#### `useFrappeGetCall`

Make GET requests to Frappe endpoints.

```tsx
const { data, error, isLoading } = useFrappeGetCall<T>(
  method: string,
  params?: ApiParams,
  queryKey?: QueryKey,
  options?: any,
  type?: 'GET' | 'POST'
)
```

#### Fetching a Single Document

```tsx
import { useFrappeGetDoc } from '@mussnad/frappe-react-query'

// Basic usage
function UserProfile({ userId }) {
    const { data, isLoading, error } = useFrappeGetDoc('User', userId)

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    return (
        <div>
            <h1>{data.full_name}</h1>
            <p>Email: {data.email}</p>
        </div>
    )
}

// With TypeScript
interface User {
    name: string
    full_name: string
    email: string
    user_image?: string
    roles: string[]
}

function TypedUserProfile({ userId }) {
    const { data: user } = useFrappeGetDoc<User>('User', userId)

    return (
        user && (
            <div>
                <h1>{user.full_name}</h1>
                {user.user_image && (
                    <img
                        src={user.user_image}
                        alt={user.full_name}
                    />
                )}
                <ul>
                    {user.roles.map((role) => (
                        <li key={role}>{role}</li>
                    ))}
                </ul>
            </div>
        )
    )
}
```

#### Fetching Document Lists

```tsx
import { useFrappeGetDocList } from '@mussnad/frappe-react-query'

// Basic list with filters
function UserList() {
    const { data: users } = useFrappeGetDocList('User', {
        fields: ['name', 'full_name', 'user_type'],
        filters: [['user_type', '=', 'System User']],
        orderBy: {
            field: 'creation',
            order: 'desc',
        },
        limit: 20,
    })

    return <ul>{users?.map((user) => <li key={user.name}>{user.full_name}</li>)}</ul>
}

// Paginated list with search
function PaginatedUserList() {
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState('')

    const { data, isLoading, hasNextPage } = useFrappeGetDocList('User', {
        fields: ['name', 'full_name', 'email'],
        filters: [
            ['enabled', '=', 1],
            ['full_name', 'like', `%${searchText}%`],
        ],
        limit: 10,
        start: (page - 1) * 10,
    })

    return (
        <div>
            <input
                type="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search users..."
            />

            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <ul>
                        {data?.map((user) => (
                            <li key={user.name}>
                                {user.full_name} ({user.email})
                            </li>
                        ))}
                    </ul>

                    <div>
                        <button
                            onClick={() => setPage((p) => p - 1)}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span>Page {page}</span>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={!hasNextPage}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
```

#### Creating Documents

```tsx
import { useFrappeCreateDoc } from '@mussnad/frappe-react-query'

function CreateTodoForm() {
    const { createDoc, loading, error, isCompleted, reset } = useFrappeCreateDoc()
    const [description, setDescription] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createDoc('ToDo', {
                description,
                priority: 'Medium',
                status: 'Open',
            })
            setDescription('')
            // Optional: Show success message
        } catch (err) {
            // Handle error
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What needs to be done?"
            />
            <button
                type="submit"
                disabled={loading}
            >
                {loading ? 'Creating...' : 'Create Todo'}
            </button>
            {error && <div className="error">{error.message}</div>}
            {isCompleted && <div className="success">Todo created successfully!</div>}
        </form>
    )
}
```

#### Updating Documents

```tsx
import { useFrappeUpdateDoc } from '@mussnad/frappe-react-query'

function TodoItem({ todo }) {
    const { updateDoc, loading } = useFrappeUpdateDoc()

    const toggleStatus = async () => {
        await updateDoc('ToDo', todo.name, {
            status: todo.status === 'Open' ? 'Completed' : 'Open',
        })
    }

    return (
        <div>
            <input
                type="checkbox"
                checked={todo.status === 'Completed'}
                onChange={toggleStatus}
                disabled={loading}
            />
            <span
                style={{
                    textDecoration: todo.status === 'Completed' ? 'line-through' : 'none',
                }}
            >
                {todo.description}
            </span>
        </div>
    )
}
```

### Authentication Examples

#### Login Form

```tsx
import { useFrappeAuth } from '@mussnad/frappe-react-query'

function LoginForm() {
    const { login, error, isLoading } = useFrappeAuth()
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await login(credentials)
            // Handle successful login
            console.log('Logged in as:', response.full_name)
        } catch (err) {
            // Error is handled by the hook
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="email"
                    value={credentials.username}
                    onChange={(e) =>
                        setCredentials((prev) => ({
                            ...prev,
                            username: e.target.value,
                        }))
                    }
                    placeholder="Email"
                />
            </div>
            <div>
                <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) =>
                        setCredentials((prev) => ({
                            ...prev,
                            password: e.target.value,
                        }))
                    }
                    placeholder="Password"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
            {error && <div className="error">{error.message}</div>}
        </form>
    )
}
```

#### User Profile with Auth

```tsx
import { useFrappeAuth } from '@mussnad/frappe-react-query'

function UserProfile() {
    const { currentUser, logout, isLoading } = useFrappeAuth()

    if (isLoading) return <div>Loading...</div>
    if (!currentUser) return <div>Please log in</div>

    return (
        <div>
            <h2>Welcome, {currentUser}</h2>
            <button onClick={logout}>Logout</button>
        </div>
    )
}
```

### Search Implementation

#### Search with Debounce

```tsx
import { useSearch } from '@mussnad/frappe-react-query'

function UserSearch() {
    const [searchText, setSearchText] = useState('')
    const { data, isLoading } = useSearch(
        'User', // doctype
        searchText, // search text
        [['enabled', '=', 1]], // filters
        10, // limit
        300, // debounce in ms
    )

    return (
        <div>
            <input
                type="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search users..."
            />

            {isLoading ? (
                <div>Searching...</div>
            ) : (
                <ul>{data?.map((result) => <li key={result.value}>{result.label}</li>)}</ul>
            )}
        </div>
    )
}
```

### File Upload Example

```tsx
import { useFrappeFileUpload } from '@mussnad/frappe-react-query'

function FileUploader() {
    const { upload, progress, loading, error, isCompleted } = useFrappeFileUpload()

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            const response = await upload(file, {
                doctype: 'User',
                docname: 'current_user@example.com',
                fieldname: 'user_image',
                file_url: '',
                folder: 'Home/User Images',
                is_private: 0,
            })

            console.log('File uploaded:', response.file_url)
        } catch (err) {
            console.error('Upload failed:', err)
        }
    }

    return (
        <div>
            <input
                type="file"
                onChange={handleFileChange}
                disabled={loading}
            />

            {loading && (
                <div>
                    Upload Progress: {progress}%
                    <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {error && <div className="error">{error.message}</div>}
            {isCompleted && <div className="success">File uploaded successfully!</div>}
        </div>
    )
}
```

### API Call Examples

#### Custom API Endpoint

```tsx
import { useFrappeGetCall } from '@mussnad/frappe-react-query'

function CustomReport() {
    const { data, isLoading } = useFrappeGetCall('my_app.api.get_custom_report', {
        start_date: '2024-01-01',
        end_date: '2024-03-31',
    })

    return <div>{isLoading ? <div>Loading report...</div> : <pre>{JSON.stringify(data, null, 2)}</pre>}</div>
}
```

### Real-world Complex Example

Here's a more complex example combining multiple hooks and features:

```tsx
import { useFrappeAuth, useFrappeGetDocList, useFrappeUpdateDoc, useSearch } from '@mussnad/frappe-react-query'

interface Task {
    name: string
    subject: string
    status: 'Open' | 'Working' | 'Completed'
    priority: 'Low' | 'Medium' | 'High'
    assigned_to: string
    description: string
}

function TaskManager() {
    const { currentUser } = useFrappeAuth()
    const [searchText, setSearchText] = useState('')
    const [selectedStatus, setSelectedStatus] = useState<Task['status']>('Open')

    // Get tasks assigned to current user
    const { data: tasks, isLoading } = useFrappeGetDocList<Task>('Task', {
        fields: ['name', 'subject', 'status', 'priority', 'assigned_to', 'description'],
        filters: [
            ['assigned_to', '=', currentUser],
            ['status', '=', selectedStatus],
        ],
        orderBy: {
            field: 'modified',
            order: 'desc',
        },
    })

    // Search functionality
    const { data: searchResults } = useSearch('Task', searchText, [['assigned_to', '=', currentUser]], 5)

    // Update task status
    const { updateDoc, loading: updating } = useFrappeUpdateDoc<Task>()

    const handleStatusChange = async (taskName: string, newStatus: Task['status']) => {
        try {
            await updateDoc('Task', taskName, { status: newStatus })
            // Task list will automatically update due to React Query's cache invalidation
        } catch (err) {
            console.error('Failed to update task:', err)
        }
    }

    return (
        <div className="task-manager">
            <div className="search-bar">
                <input
                    type="search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search tasks..."
                />
                {searchText && (
                    <div className="search-results">
                        {searchResults?.map((result) => (
                            <div
                                key={result.value}
                                className="search-item"
                            >
                                {result.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="status-filter">
                {(['Open', 'Working', 'Completed'] as Task['status'][]).map((status) => (
                    <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={selectedStatus === status ? 'active' : ''}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div>Loading tasks...</div>
            ) : (
                <div className="task-list">
                    {tasks?.map((task) => (
                        <div
                            key={task.name}
                            className="task-item"
                        >
                            <h3>{task.subject}</h3>
                            <p>{task.description}</p>
                            <div className="task-actions">
                                <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.name, e.target.value as Task['status'])}
                                    disabled={updating}
                                >
                                    <option value="Open">Open</option>
                                    <option value="Working">Working</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <span className={`priority priority-${task.priority.toLowerCase()}`}>
                                    {task.priority}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
```

This expanded documentation provides concrete, real-world examples that demonstrate how to:

- Combine multiple hooks
- Handle loading and error states
- Implement TypeScript interfaces
- Create reusable components
- Manage complex state
- Implement search and filtering
- Handle file uploads
- Manage authentication
- Make custom API calls

Each example includes proper error handling, loading states, and TypeScript support where applicable.

### File Operations

#### `useFrappeFileUpload`

Handle file uploads to Frappe.

```tsx
const { upload, progress, loading, error, isCompleted, reset } = useFrappeFileUpload<T>()

// Usage
await upload(file, {
    doctype: 'User',
    docname: 'john.doe@example.com',
    fieldname: 'avatar',
})
```

## Advanced Features

### Prefetching

The package provides prefetching capabilities for optimal performance:

```tsx
const prefetchDoc = useFrappePrefetchDoc(doctype, name)
const prefetchList = useFrappePrefetchDocList(doctype, args)
const prefetchCall = useFrappePrefetchCall(method, params)

// Usage
await prefetchDoc()
```

### Document Count

```tsx
const { data: count } = useFrappeGetDocCount(
  doctype,
  filters?,
  cache?,
  debug?
)
```

### Link Validation

```tsx
const { data } = useValidateLink(doctype, docname, fields)
```

## TypeScript Support

The package is written in TypeScript and provides full type support. You can extend the base types for your custom doctypes:

```tsx
interface CustomDoc {
    name: string
    custom_field: string
}

const { data } = useFrappeGetDoc<CustomDoc>('Custom_Doctype', 'DOC-001')
```

## Best Practices

1. **Error Handling**: Always handle error states in your components:

```tsx
if (error) {
    return <ErrorComponent message={error.message} />
}
```

2. **Loading States**: Show loading indicators:

```tsx
if (isLoading) {
    return <LoadingSpinner />
}
```

3. **Type Safety**: Utilize TypeScript interfaces for your doctypes:

```tsx
interface User {
    name: string
    email: string
    roles: string[]
}

const { data: user } = useFrappeGetDoc<User>('User', 'john@example.com')
```

4. **Optimistic Updates**: Use React Query's optimistic update features:

```tsx
const queryClient = useQueryClient()
queryClient.setQueryData(['user', id], updatedData)
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Mussnad](https://github.com/mussnad)
