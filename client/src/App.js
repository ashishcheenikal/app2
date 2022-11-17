import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import NotLoggedIn from "./routes/NotLoggedIn";
import LoggedIn from "./routes/LoggedIn";
import ForgetPassword from "./pages/ForgetPassword";

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
        </Route>
      </Routes>
    </div>
  );
}

export default App;
