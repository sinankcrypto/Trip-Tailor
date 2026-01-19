import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useResetPassword } from "../hooks/useResetPassword";
import toast from "react-hot-toast";
import logo from '../../../../assets/authentication/logo.png'

const ResetPassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  if (!email) {
    navigate("/auth/forgot-password");
    return null;
  }

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { resetPassword, loading } = useResetPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword(email, newPassword, confirmPassword);
      toast.success("Password reset successfully");

      navigate("/user/login");
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
          Reset your password
        </h2>
        <p className="text-gray-600 mt-2 text-sm">
          Create a new password for <br />
          <span className="font-medium text-green-700">{email}</span>
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-xl shadow-lg"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
