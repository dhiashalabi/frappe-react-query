import { useValidateLink } from '../lib'
import { FrappeDoc } from '@mussnad/frappe-js-client/dist/frappe/types'

interface UserValidationData extends FrappeDoc<object> {
    name: string
    full_name: string
    email: string
}

export function Validate() {
    const { data } = useValidateLink<UserValidationData>('User', 'Administrator', ['name', 'full_name', 'email'])
    console.log(data)
    return (
        <div>
            <h1>Validate</h1>
            <p>{data?.full_name}</p>
        </div>
    )
}
