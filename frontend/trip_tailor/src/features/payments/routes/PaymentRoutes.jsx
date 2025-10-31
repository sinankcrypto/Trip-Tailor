import { Route, Routes } from "react-router-dom"
import PaymentCancelPage from "../pages/PaymentCancelPage"

export const PaymentRoutes = () => {
    return (
        <Routes>
            <Route path="/payment/cancel" element={<PaymentCancelPage/>} />
        </Routes>
    )
}