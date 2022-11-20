import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function LoggedIn() {
    const user = sessionStorage.getItem("userData")
    console.log(user,"loggedIn");
  return (
    user ? <Outlet/> :<Navigate to="/login"/>
  )
}
