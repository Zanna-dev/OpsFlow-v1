import type { ChildNodeProps, AppButtonProps, EmployeeCardProps, UserCardProps, ButtonProps, RemoveUserProps } from "../../interfaces/AppButton.interfaces";

export function ChildNodes({children}: ChildNodeProps) {
    // const [employee, setEmployee] = useState<EmployeeCardProps[]>([]);
    // const [user, setUser] = useState<Users | null>(null);


    return (
        <>
            {children}
        </>
    )

}
export function AppButton({label, disabled}: AppButtonProps) {
    return (
        <button disabled={disabled}>{label}</button>
    )

}

export function EmployeeCard({name, email, department, activeStatus}: EmployeeCardProps) {
    return (
        <>
            <h3>{name}</h3>
            <p>{email}</p>
            <p>{department}</p>
            <p>{activeStatus ? "Active" : "Inactive"}</p>
        </>
    )
}

export function UserCard({user}: UserCardProps) {
    return (
        <>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
        <p>{user.department}</p>
        </>
    )
}

export function Button({onDelete}: ButtonProps) {
    return (
        <>
        <button onClick={onDelete}>Delete</button>
        </>
    )
}

export function RemoveUser({onDelete} : RemoveUserProps) {
    return (
        <>
        <button onClick={() => onDelete(1)}>Remove</button>
        </>
    )
}

