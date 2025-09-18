import React from 'react'
import UserLayout from '../../../layouts/user/UserLayout'
import { Routes, Route } from 'react-router-dom'
import BookingPage from '../pages/BookingPage'
import BookingSuccessPage from '../pages/BookingSuccessPage'


const BookingRoutes = () => {
  return (
    <Routes>
        <Route element={<UserLayout/>}>
          <Route path="/book/:id" element={<BookingPage />} />
          <Route path="/booking-success/:id" element={<BookingSuccessPage />} />
        </Route>
    </Routes>
    )
}

export default BookingRoutes
