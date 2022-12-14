import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function LoggedIn() {
    const user = sessionStorage.getItem("userData")
    if(sessionStorage.getItem("url")){
      sessionStorage.removeItem("url")
    }else{
      const url = window.location.href;
      sessionStorage.setItem("url", url);
    }
  return (
    user ? <Outlet/> :<Navigate to="/login"/>
  )
}
