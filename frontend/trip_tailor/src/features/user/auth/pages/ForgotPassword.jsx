import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPassword } from "../hooks/useForgotPassword";
import toast from "react-hot-toast";
import logo from '../../../../assets/authentication/logo.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { sendOtp, loading } = useForgotPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      await sendOtp(email);
      toast.success("OTP sent to your email");

      navigate("/user/verify-otp", {
        state: {
          email,
          flow: "reset",
        },
      });
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="font-[Lexend]">
      {/* Logo */}
      <div className="text-center mb-6">
        <div className="flex justify-center items-center gap-2 mb-3">
          <img src={logo} alt="Trip Tailor Logo" className="h-8" />
          <span className="text-2xl font-semibold text-green-800">
            Trip <span className="text-green-600">Tailor</span>
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          Forgot your password?
        </h2>
        <p className="text-gray-600 mt-2 text-sm">
          Enter your email and we’ll send you an OTP to reset it.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-xl shadow-lg"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white shadow-md"
          }`}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
