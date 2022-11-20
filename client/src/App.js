import "./App.css";
import AdminRoutes from "./routes/AdminRoutes/AdminRoutes";
// import { Route, Routes } from "react-router-dom";
// import Home from "./pages/home";
// import Login from "./pages/login";
// import Register from "./pages/register";
// import NotLoggedIn from "./routes/UserRoutes/NotLoggedIn";
// import LoggedIn from "./routes/UserRoutes/LoggedIn";
// import ForgetPassword from "./pages/ForgetPassword";
// import NewPassword from "./pages/ForgetPassword/NewPassword";
// import AdLogin from "./AdminPages/AdLogin";
// import AdHome from "./AdminPages/AdHome";
import UserRoutes from "./routes/UserRoutes/userRoutes";

function App() {
  return (
    <div>
      <AdminRoutes />
      <UserRoutes />
      {/* <Routes> */}
        {/* <Route element={<UserRoutes />} /> */}
        {/* <Route path="/admin/" element={<AdHome />} />
        <Route path="/admin/login" element={<AdLogin />} /> */}
      {/* </Routes> */}
    </div>
  );
}

export default App;
