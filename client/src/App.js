import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import NotLoggedIn from "./routes/NotLoggedIn";
import LoggedIn from "./routes/LoggedIn";
import ForgetPassword from "./pages/ForgetPassword";
import NewPassword from "./pages/ForgetPassword/NewPassword";
import AdLogin from "./AdminPages/AdLogin";
import AdHome from "./AdminPages/AdHome";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<LoggedIn/>}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<NotLoggedIn />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/newPassword/:id/:token" element={<NewPassword />} />
        </Route>
        <Route path="/admin/" element={<AdHome />} />
        <Route path="/admin/login" element={<AdLogin />} />
      </Routes>
    </div>
  );
}

export default App;
