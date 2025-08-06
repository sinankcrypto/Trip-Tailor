import { Routes, Route } from "react-router-dom";

import Signup from "../auth/pages/Signup";
import Login from "../auth/pages/Login";
import VerifyOtp from "../auth/pages/VerifyOtp";
import UserLayout from "../../../layouts/user/UserLayout";
import Home from "../home/pages/Home";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/user/Home" element = { <Home/> } />
      <Route path="/user" element={<UserLayout/>}>
        <Route path="signup" element={<Signup/>} />
        <Route path="login" element={<Login/>} />
        <Route path="verify-otp" element={<VerifyOtp/>} />
      </Route>
    </Routes>
  )
}

export default UserRoutes
