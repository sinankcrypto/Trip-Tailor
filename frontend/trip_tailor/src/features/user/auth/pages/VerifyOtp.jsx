import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useOtpVerification } from '../hooks/useOTPVerification'
import toast from 'react-hot-toast'
import logo from '../../../../assets/authentication/logo.png'

const VerifyOtp = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [otp, setOtp] = useState('')
  const { verifyOtp } = useOtpVerification()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await verifyOtp(state.email, otp)
    if (result.success) {
      toast.success(result.message)
      navigate('/user/login')
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-[Lexend] px-4">
    {/* Top Section: Logo + Tagline */}
    <div className="mt-12 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
        <img src={logo} alt="Trip Tailor Logo" className="h-8" />
        <span className="text-2xl font-semibold text-green-800 tracking-wide">
            Trip <span className="text-green-600">Tailor</span>
        </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
        Don't just imagine paradise, <br className="hidden md:block" /> 
        Experience it!
        </h2>
    </div>

    {/* Form Section */}
    <div className="flex flex-1 flex-col items-center justify-start mt-12">
        <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4"
        >
        <h2 className="text-xl font-semibold text-center">Verify OTP</h2>
        <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full transition"
        >
            Verify
        </button>
        </form>
    </div>
    </div>


  )
}

export default VerifyOtp
