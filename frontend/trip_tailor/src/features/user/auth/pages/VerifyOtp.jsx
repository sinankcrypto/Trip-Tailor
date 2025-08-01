import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useOtpVerification } from '../hooks/useOTPVerification'

const VerifyOtp = () => {
    const navigate = useNavigate()
    const { state } = useLocation()
    const [ otp, setOtp] = useState('')
    const { verifyOtp } = useOtpVerification()

    const  handleSubmit = async (e) => {
        e.preventDefault()
        const result = await verifyOtp(state.email, otp)
        if (result.success){
            alert(result.message)
            navigate('/user/login')
        } else {
            alert(result.message)
        }
    }

  return (
    <form onSubmit={handleSubmit} className='p-4 max-w-sm mx-auto space-y-4'>
        <h2 className="text-xl font-semibold">Verify OTP</h2>
        <input 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder='Enter OTP'
            className='border p-2 w-full' 
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Verify</button>
    </form>
  )
}

export default VerifyOtp
