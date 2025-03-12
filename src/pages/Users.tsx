import { useFrappeGetDocList } from '../lib'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Validate } from '../components/validate'
interface User {
    name: string
    full_name: string
    email: string
    enabled: number
    user_type: string
}

const columnHelper = createColumnHelper<User>()

const columns = [
    columnHelper.accessor('name', {
        header: 'Username',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('full_name', {
        header: 'Full Name',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('user_type', {
        header: 'User Type',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('enabled', {
        header: 'Status',
        cell: (info) => (info.getValue() === 1 ? 'Enabled' : 'Disabled'),
    }),
]

export function Users() {
    const { data, error, isLoading } = useFrappeGetDocList('User', {
        fields: ['name', 'full_name', 'email', 'enabled', 'user_type'],
    })

    const table = useReactTable({
        data: data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    return (
        <div className="users-page">
            <Validate />
            <h1>Users</h1>
            <div className="table-container">
                <table>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
