import { Route, Routes } from "react-router-dom";
import AdLogin from "../../pages/AdminPages/AdLogin" ;
import AdHome from "../../pages/AdminPages/AdHome/index";
import AdLoggedIn from "./AdLoggedIn"
import AdNotLoggedIn from "./AdNotLoggedIn"
import AddMeeting from "../../pages/AdminPages/AddMeeting";

export default function AdminRoutes() {
  return (
    <div>
        <Routes>
          <Route element={<AdLoggedIn/>}>
            <Route path="/admin/" element={<AdHome/>}/>
            <Route path="/admin/AddMeeting" element={<AddMeeting />} />
          </Route>
          <Route element={<AdNotLoggedIn/>}>
            <Route path="/admin/login" element={<AdLogin/>}/>
          </Route>
        </Routes>
    </div>
  )
}
