import { Route, Routes } from "react-router-dom";
import Home from "../../pages/home";
import Login from "../../pages/login";
import Register from "../../pages/register";
import NotLoggedIn from "./NotLoggedIn";
import LoggedIn from "./LoggedIn";
import ForgetPassword from "../../pages/ForgetPassword";
import NewPassword from "../../pages/ForgetPassword/NewPassword";


export default function UserRoutes() {
    return (
        <div>
            <Routes>
                <Route element={<LoggedIn />}>
                    <Route path="/" element={<Home />} />
                </Route>
                <Route element={<NotLoggedIn />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgetPassword" element={<ForgetPassword />} />
                    <Route path="/newPassword/:id/:token" element={<NewPassword />} />
                </Route>
            </Routes>
        </div>
    )
}
