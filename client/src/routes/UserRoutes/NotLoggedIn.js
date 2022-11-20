import { Navigate, Outlet } from 'react-router-dom'

export default function     NotLoggedIn() {
    const user = sessionStorage.getItem('userData')
  return (
    user ? <Navigate to="/"/> : <Outlet/>
  )
}
