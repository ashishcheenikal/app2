import { Navigate, Outlet } from "react-router-dom";

export default function AdNotLoggedIn() {
  const admin = sessionStorage.getItem("adminData");
  console.log(admin,"AdNotLoggedIn");
  return admin ?<Navigate to="/admin/" /> : <Outlet />;
}
  