import { Navigate, Outlet } from 'react-router-dom'

export default function AdLoggedIn() {
    const user = sessionStorage.getItem("userData")
    console.log(user,"AdminloggedIn");
    return (
        user.admin ? <Outlet /> : <Navigate to="/admin/login" />
    )
}
