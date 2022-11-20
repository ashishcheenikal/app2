import { Navigate, Outlet } from "react-router-dom";

export default function AdNotLoggedIn() {
  const user = sessionStorage.getItem("userData");
  return user.admin ? <Navigate to="/" /> : <Outlet />;
}
