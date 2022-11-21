import { Navigate, Outlet } from "react-router-dom";

export default function AdLoggedIn() {
  const admin = sessionStorage.getItem("adminData");
  console.log(admin, "AdminloggedIn");
  return admin ? <Outlet /> : <Navigate to="/admin/login" />;
}
