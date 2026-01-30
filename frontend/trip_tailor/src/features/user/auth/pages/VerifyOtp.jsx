import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useOtpVerification } from '../hooks/useOtpVerification'
import { useResetVerifyOtp } from '../hooks/useResetVerifyOtp'
import { useOtpResend } from '../hooks/useOtpResend'
import toast from 'react-hot-toast'
import logo from '../../../../assets/authentication/logo.png'

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { flow } = state;

  const otpHook = 
    flow === "reset"
      ? useResetVerifyOtp()
      : useOtpVerification();

  const { verifyOtp, isLoading: isVerifying } = otpHook;

  // Get email from navigation state (passed from signup/login)
  const email = state?.email;
  if (!email) {
    navigate('/signup'); // safety redirect
    return null;
  }

  const [otp, setOtp] = useState('');

  // Resend hook with 30-second cooldown
  const {
    formatTime,
    canResend,
    isResending,
    resendOtp,
  } = useOtpResend(email, 30); // ← 30 seconds!

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    const result = await verifyOtp(email, otp);
    if (result.success) {
      if (flow === "reset") {
        navigate("/user/reset-password", {
          state: { email },
        });
      } else {
        navigate("/user/login");
      }
    } else {
      toast.error(result.message);
    }
  };

  const handleResend = async () => {
    await resendOtp();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-[Lexend] px-4">
      {/* Logo + Tagline */}
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
        <p className="text-gray-600 mt-4 text-sm">
          We've sent a 6-digit OTP to <br />
          <span className="font-medium text-green-700">{email}</span>
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-1 flex-col items-center justify-start mt-10">
        <form onSubmit={handleVerify} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">Verify OTP</h2>

          <div>
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // only numbers
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying || otp.length !== 6}
            className={`w-full py-3 rounded-lg font-medium transition ${
              isVerifying || otp.length !== 6
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {isVerifying ? 'Verifying...' : 'Verify OTP'}
          </button>

          {/* Resend Section */}
          <div className="text-center pt-4">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-green-600 hover:text-green-700 font-medium underline disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend OTP'}
              </button>
            ) : (
              <p className="text-gray-600">
                Resend available in{' '}
                <span className="font-bold text-green-600">{formatTime()}</span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;