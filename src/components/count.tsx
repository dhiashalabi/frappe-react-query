import { useGetDoc } from '../lib'
import { FrappeDoc } from 'frappe-js-client/dist/frappe/types'

type User = FrappeDoc<object> & {
    enabled: number
}

export function Count() {
    const { data, isFetching, error } = useGetDoc<User>('User', 'Administrator')
    if (isFetching) return <div>Loading...</div>
    if (error) return <div>Error: {error._server_messages?.[0]?.message}</div>
    return <div>Count: {data?.enabled}</div>
}
