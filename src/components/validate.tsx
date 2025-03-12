import { useValidateLink } from '../lib'

export function Validate() {
    const { data } = useValidateLink('User', 'Administrator', ['name', 'full_name', 'email'])
    return (
        <div>
            <h1>Validate</h1>
            <p>{data?.message.name}</p>
        </div>
    )
}
