import { Routes, Route } from "react-router-dom";

import Signup from "../auth/pages/Signup";
import Login from "../auth/pages/Login";
import VerifyOtp from "../auth/pages/VerifyOtp";
import UserLayout from "../../../layouts/user/UserLayout";
import Home from "../home/pages/Home";
import RequireUserAuth from "../../../auth/RequireUserAuth";
import ProfilePage from "../profile/pages/ProfilePage";
import { Navigate } from "react-router-dom";
import EditProfilePage from "../profile/pages/EditProfilePage";
import ProfileLayout from "../profile/components/layouts/ProfileLayout";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/user/login" replace />} />
      <Route path="/user/Home" element = { <Home/> } />
      <Route element= {<RequireUserAuth/> }>
        <Route path="/user" element= {<ProfileLayout/>} >
          <Route path="profile" element= {<ProfilePage/>}/>
          <Route path="profile/edit" element= {<EditProfilePage/>}/>
        </Route>
      </Route>
      <Route path="/user" element={<UserLayout/>}>
        <Route path="signup" element={<Signup/>} />
        <Route path="login" element={<Login/>} />
        <Route path="verify-otp" element={<VerifyOtp/>} />
      </Route>
    </Routes>
  )
}

export default UserRoutes
