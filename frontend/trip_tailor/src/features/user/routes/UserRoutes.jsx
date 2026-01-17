import { Route, Routes } from "react-router-dom";

import Signup from "../auth/pages/Signup";
import Login from "../auth/pages/Login";
import VerifyOtp from "../auth/pages/VerifyOtp";
import UserLoginLayout from "../../../layouts/user/UserLoginLayout";
import Home from "../home/pages/Home";
import RequireUserAuth from "../../../auth/RequireUserAuth";
import ProfilePage from "../profile/pages/ProfilePage";
import { Navigate } from "react-router-dom";
import EditProfilePage from "../profile/pages/EditProfilePage";
import ProfileLayout from "../profile/components/layouts/ProfileLayout";
import PackagesPage from "../../packages/pages/PackagesPage";
import UserLayout from "../../../layouts/user/UserLayout";
import PackageDetailPage from "../../packages/pages/PackageDetailsPage";
import UserBookingsPage from "../../bookings/pages/UserBookings";
import UserBookingDetailsPage from "../../bookings/pages/UserBookingDetails";
import UserTransactionsPage from "../../payments/pages/UserTransactions";
import UserChatListPage from "../../chat/pages/UserMessagesPage";
import UserChatPage from "../../chat/pages/UserChatPage"
import ForgotPassword from "../auth/pages/ForgotPassword";
import ResetPassword from "../auth/pages/ResetPassword";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/user/login" replace />} />
      <Route path="/user/Home" element = { <Home/> } />
      <Route element={<UserLayout/>}>
        <Route path="/packages/" element={<PackagesPage/>} /> 
        <Route path='/packages/:id' element= {<PackageDetailPage/>} />
        
      </Route>    
      <Route element= {<RequireUserAuth/> }>
        <Route path="/user" element= {<ProfileLayout/>} >
          <Route path="profile" element= {<ProfilePage/>}/>
          <Route path="profile/edit" element= {<EditProfilePage/>}/>
          <Route path="bookings" element= {<UserBookingsPage/>} />
          <Route path="bookings/:id" element= {<UserBookingDetailsPage/>}/>
          <Route path="transactions" element= {<UserTransactionsPage/>}/>
          <Route path="messages" element={<UserChatListPage />} />
          <Route path="chat/:chatId" element={<UserChatPage/>} />
        </Route>
      </Route>
      <Route path="/user" element={<UserLoginLayout/>}>
        <Route path="signup" element={<Signup/>} />
        <Route path="login" element={<Login/>} />
        <Route path="verify-otp" element={<VerifyOtp/>} />
        <Route path="forgot-password" element={<ForgotPassword/>}/>
        <Route path="reset-password" element={<ResetPassword/>}/> 
      </Route>
    </Routes>
      
  )
}

export default UserRoutes
