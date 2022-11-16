import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  return <div>
    <Routes>
        <Route path="/" element={<Home />} exact/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
    </Routes>
  </div>;
}

export default App;
