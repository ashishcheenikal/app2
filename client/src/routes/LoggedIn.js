import React from 'react'
import { Outlet } from 'react-router-dom'
import Login from '../pages/login'

export default function LoggedIn() {
    const user = sessionStorage.getItem("userData")
    console.log(user,"loggedIn");
  return (
    user ? <Outlet/> :<Login/>
  )
}
