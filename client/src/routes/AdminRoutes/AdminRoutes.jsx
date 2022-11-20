import { Route, Routes } from "react-router-dom";
import AdLogin from "../../pages/AdminPages/AdLogin" ;
import AdHome from "../../pages/AdminPages/AdHome";
// import AdLoggedIn from "./AdLoggedIn"
// import AdNotLoggedIn from "./AdNotLoggedIn"

export default function AdminRoutes() {
  return (
    <div>
        <Routes>
          {/* <Route element={<AdLoggedIn/>}> */}
            <Route path="/admin/" element={<AdHome/>}/>
          {/* </Route> */}
          {/* <Route element={<AdNotLoggedIn/>}> */}
            <Route path="/admin/login" element={<AdLogin/>}/>
          {/* </Route> */}
        </Routes>
    </div>
  )
}
