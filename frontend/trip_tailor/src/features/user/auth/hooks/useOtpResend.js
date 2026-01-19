// src/hooks/useOtpResend.js

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { sendOtp } from '../services/authService';

export const useOtpResend = (email, initialDelay = 30) => { 

  const [secondsLeft, setSecondsLeft] = useState(initialDelay);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Format seconds → "01:23"
  const formatTime = useCallback(() => {
    const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const secs = (secondsLeft % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }, [secondsLeft]);

  // Resend OTP function
  const resendOtp = useCallback(async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    const result = await sendOtp(email);

    if (result.success) {
      toast.success('OTP resent successfully!');
      setSecondsLeft(initialDelay); // reset timer
      setCanResend(false);
    } else {
      toast.error(result.message || 'Failed to resend OTP');
      // Don't reset timer on failure – let user try again after current cooldown
    }
    setIsResending(false);
  }, [email, canResend, isResending, initialDelay]);

  return {
    secondsLeft,
    formatTime,
    canResend,
    isResending,
    resendOtp,
  };
};