# Frappe React Query 📦

A powerful React Query package for Frappe Framework, providing seamless integration between React applications and Frappe backend services with real-time capabilities.

[![npm version](https://badge.fury.io/js/frappe-react-query.svg)](https://badge.fury.io/js/frappe-react-query)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## ✨ Features

- 🔄 **Real-time data synchronization** with Frappe backend via Socket.io
- 🎣 **Comprehensive React hooks** for all Frappe operations
- 🔍 **Built-in search functionality** with debouncing
- 📝 **Full CRUD operations** for documents
- 🔐 **Authentication management** with session handling
- 📁 **File upload capabilities** with progress tracking
- 🌐 **Socket.io integration** for live updates
- 🚀 **Built on @tanstack/react-query** for optimal caching and performance
- 📱 **TypeScript support** with full type definitions
- ⚡ **Prefetching capabilities** for better UX

## 📦 Installation

```bash
npm install frappe-react-query
# or
yarn add frappe-react-query
# or
pnpm add frappe-react-query
```

## 🔧 Dependencies

The package requires the following peer dependencies:

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@tanstack/react-query": "^5.67.3",
  "socket.io-client": "^4.8.1"
}
```

## 🚀 Quick Start

### 1. Setup Provider

Wrap your application with `FrappeProvider`:

```tsx
import { FrappeProvider } from 'frappe-react-query'

function App() {
  return (
    <FrappeProvider
      url="https://your-frappe-site.com"
      enableSocket={true} // Enable real-time features
    >
      <YourApp />
    </FrappeProvider>
  )
}
```

### 2. Use Hooks

Start using the hooks in your components:

```tsx
import { useFrappeGetDoc } from 'frappe-react-query'

function UserProfile() {
  const { data, isLoading, error } = useFrappeGetDoc('User', 'john.doe@example.com')

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>Welcome {data?.full_name}</div>
}
```

## 📚 API Reference

### 🔐 Authentication Hooks

#### `useFrappeAuth`

Manage authentication state and operations.

```tsx
const {
  currentUser,
  isLoading,
  isFetching,
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

**Parameters:**
- `options` (optional): Configuration options for the hook

**Returns:**
- `currentUser`: Current authenticated user
- `isLoading`: Loading state
- `isFetching`: Fetching state
- `error`: Error object
- `login`: Login function
- `logout`: Logout function
- `updateCurrentUser`: Update current user function
- `getUserCookie`: Get user cookie function

### 📄 Document Operations

#### `useFrappeGetDoc`

Fetch a single document from the database.

```tsx
const { data, error, isFetching, mutate } = useFrappeGetDoc<T>(
  doctype: string,
  name?: string,
  queryKey?: readonly any[],
  options?: UseQueryOptions
)
```

**Parameters:**
- `doctype`: The doctype to fetch
- `name`: The name of the document to fetch
- `queryKey` (optional): Custom query key for caching
- `options` (optional): React Query options

**Returns:**
- `data`: The document data
- `error`: Error object
- `isFetching`: Fetching state
- `mutate`: Refetch function

#### `useFrappeGetDocList`

Fetch a list of documents with filtering and pagination.

```tsx
const { data, error, isFetching, mutate } = useFrappeGetDocList<T>(
  doctype: string,
  args?: GetDocListArgs<T>,
  queryKey?: readonly any[],
  options?: UseQueryOptions
)
```

**Parameters:**
- `doctype`: Name of the doctype to fetch
- `args` (optional): Arguments for filtering, pagination, etc.
- `queryKey` (optional): Custom query key for caching
- `options` (optional): React Query options

**Returns:**
- `data`: Array of documents
- `error`: Error object
- `isFetching`: Fetching state
- `mutate`: Refetch function

#### `useFrappeCreateDoc`

Create a new document.

```tsx
const { createDoc, loading, error, isCompleted, reset } = useFrappeCreateDoc<T>()

// Usage
await createDoc(doctype, documentData)
```

**Returns:**
- `createDoc`: Function to create a document
- `loading`: Loading state
- `error`: Error object
- `isCompleted`: Success state
- `reset`: Reset function

#### `useFrappeUpdateDoc`

Update an existing document.

```tsx
const { updateDoc, loading, error, isCompleted, reset } = useFrappeUpdateDoc<T>()

// Usage
await updateDoc(doctype, docname, updates)
```

**Returns:**
- `updateDoc`: Function to update a document
- `loading`: Loading state
- `error`: Error object
- `isCompleted`: Success state
- `reset`: Reset function

#### `useFrappeDeleteDoc`

Delete a document.

```tsx
const { deleteDoc, loading, error, isCompleted, reset } = useFrappeDeleteDoc()

// Usage
await deleteDoc(doctype, docname)
```

**Returns:**
- `deleteDoc`: Function to delete a document
- `loading`: Loading state
- `error`: Error object
- `isCompleted`: Success state
- `reset`: Reset function

### 🔍 Search Hooks

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

**Parameters:**
- `doctype`: The doctype to search in
- `text`: Search text
- `filters` (optional): Additional filters
- `limit` (optional): Maximum results (default: 10)
- `debounce` (optional): Debounce delay in ms (default: 300)

**Returns:**
- `data`: Search results
- `error`: Error object
- `isLoading`: Loading state
- `mutate`: Refetch function

### 🌐 API Call Hooks

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

**Parameters:**
- `method`: Method name (e.g., "frappe.client.get_list")
- `params` (optional): Parameters to pass
- `queryKey` (optional): Custom query key
- `options` (optional): React Query options
- `type` (optional): Request type ('GET' or 'POST')

**Returns:**
- `data`: Response data
- `error`: Error object
- `isLoading`: Loading state

#### `useFrappePostCall`

Make POST requests to Frappe endpoints.

```tsx
const { call, result, loading, error, isCompleted, reset } = useFrappePostCall<T>(method)
```

#### `useFrappePutCall`

Make PUT requests to Frappe endpoints.

```tsx
const { call, result, loading, error, isCompleted, reset } = useFrappePutCall<T>(method)
```

#### `useFrappeDeleteCall`

Make DELETE requests to Frappe endpoints.

```tsx
const { call, result, loading, error, isCompleted, reset } = useFrappeDeleteCall<T>(method)
```

### 📁 File Operations

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

**Returns:**
- `upload`: Upload function
- `progress`: Upload progress (0-100)
- `loading`: Loading state
- `error`: Error object
- `isCompleted`: Success state
- `reset`: Reset function

### 🔌 Socket/Real-time Hooks

#### `useFrappeEventListener`

Listen to custom events from the server.

```tsx
useFrappeEventListener('my_event', (data) => {
  console.log('Event received:', data)
})
```

#### `useFrappeDocumentEventListener`

Listen to document-specific events (updates, viewers).

```tsx
const { viewers, emitDocOpen, emitDocClose } = useFrappeDocumentEventListener(
  'User',
  'john.doe@example.com',
  (data) => {
    console.log('Document updated:', data)
  }
)
```

**Returns:**
- `viewers`: Array of user IDs viewing the document
- `emitDocOpen`: Function to emit doc_open event
- `emitDocClose`: Function to emit doc_close event

#### `useFrappeDocTypeEventListener`

Listen to doctype-level events.

```tsx
useFrappeDocTypeEventListener('User', (data) => {
  console.log('Doctype updated:', data)
})
```

### 🔧 Utility Hooks

#### `useFrappePrefetchDoc`

Prefetch a document for better performance.

```tsx
const prefetchDoc = useFrappePrefetchDoc(doctype, name)
await prefetchDoc()
```

#### `useFrappePrefetchDocList`

Prefetch a list of documents.

```tsx
const prefetchList = useFrappePrefetchDocList(doctype, args)
await prefetchList()
```

#### `useFrappePrefetchCall`

Prefetch API call data.

```tsx
const prefetchCall = useFrappePrefetchCall(method, params)
await prefetchCall()
```

#### `useGetCount`

Get document count with filters.

```tsx
const { data: count } = useGetCount(doctype, filters)
```

#### `useValidateLink`

Validate document links.

```tsx
const { data } = useValidateLink(doctype, docname, fields)
```

## 💡 Usage Examples

### Basic Document Operations

```tsx
import { useFrappeGetDoc, useFrappeCreateDoc, useFrappeUpdateDoc } from 'frappe-react-query'

// Fetch a document
function UserProfile({ userId }) {
  const { data: user, isLoading, error } = useFrappeGetDoc('User', userId)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>{user.full_name}</h1>
      <p>Email: {user.email}</p>
    </div>
  )
}

// Create a document
function CreateTodo() {
  const { createDoc, loading, error } = useFrappeCreateDoc()
  const [description, setDescription] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await createDoc('ToDo', { description, status: 'Open' })
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What needs to be done?"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Todo'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  )
}
```

### Real-time Updates

```tsx
import { useFrappeDocumentEventListener, useFrappeGetDoc } from 'frappe-react-query'

function LiveDocument({ doctype, docname }) {
  const { data, isLoading } = useFrappeGetDoc(doctype, docname)
  
  // Listen for real-time updates
  useFrappeDocumentEventListener(doctype, docname, (updateData) => {
    console.log('Document updated:', updateData)
    // The document will automatically refetch due to React Query cache invalidation
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h2>{data.subject}</h2>
      <p>{data.description}</p>
    </div>
  )
}
```

### Search with Debouncing

```tsx
import { useSearch } from 'frappe-react-query'

function UserSearch() {
  const [searchText, setSearchText] = useState('')
  const { data, isLoading } = useSearch(
    'User',
    searchText,
    [['enabled', '=', 1]], // Additional filters
    10, // Limit
    300 // Debounce 300ms
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
        <ul>
          {data?.map((result) => (
            <li key={result.value}>{result.label}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

### File Upload with Progress

```tsx
import { useFrappeFileUpload } from 'frappe-react-query'

function FileUploader() {
  const { upload, progress, loading, error } = useFrappeFileUpload()

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const response = await upload(file, {
        doctype: 'User',
        docname: 'current_user@example.com',
        fieldname: 'user_image',
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
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}
      
      {error && <div>Error: {error.message}</div>}
    </div>
  )
}
```

## 🔧 Configuration

### FrappeProvider Options

```tsx
<FrappeProvider
  url="https://your-frappe-site.com"
  enableSocket={true}
  socketOptions={{
    transports: ['websocket'],
    autoConnect: true
  }}
  queryClient={customQueryClient} // Optional custom React Query client
>
  <YourApp />
</FrappeProvider>
```

## 🎯 TypeScript Support

The package is written in TypeScript and provides full type support. You can extend the base types for your custom doctypes:

```tsx
interface CustomDoc {
  name: string
  custom_field: string
  created_by: string
  creation: string
  modified_by: string
  modified: string
}

const { data } = useFrappeGetDoc<CustomDoc>('Custom_Doctype', 'DOC-001')
```

## 🚀 Best Practices

### 1. Error Handling

Always handle error states in your components:

```tsx
if (error) {
  return <ErrorComponent message={error.message} />
}
```

### 2. Loading States

Show loading indicators for better UX:

```tsx
if (isLoading) {
  return <LoadingSpinner />
}
```

### 3. Type Safety

Utilize TypeScript interfaces for your doctypes:

```tsx
interface User {
  name: string
  email: string
  full_name: string
  roles: string[]
}

const { data: user } = useFrappeGetDoc<User>('User', 'john@example.com')
```

### 4. Optimistic Updates

Use React Query's optimistic update features:

```tsx
const queryClient = useQueryClient()
queryClient.setQueryData(['user', id], updatedData)
```

### 5. Real-time Updates

Enable socket connections for live data:

```tsx
<FrappeProvider enableSocket={true}>
  <YourApp />
</FrappeProvider>
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/dhiashalabi/frappe-react-query.git

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build the package
npm run build
```

## 📄 License

MIT © [DHia A. SHalabi](https://github.com/dhiashalabi)

## 🔗 Links

- [GitHub Repository](https://github.com/dhiashalabi/frappe-react-query)
- [NPM Package](https://www.npmjs.com/package/frappe-react-query)
- [Issues](https://github.com/dhiashalabi/frappe-react-query/issues)
- [Frappe Framework](https://frappeframework.com/)
