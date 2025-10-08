import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import toast from "react-hot-toast";
import apiClient from "../../../../api/apiClient";

export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const googleLogin = async (idToken, role) => {
    try {
      const res = await apiClient.post("/user/google-login/", { token: idToken, role });
      
      toast.success("Login successful!");

      const user = res.data.user;
      setUser(user); 

      if (user.is_agency) {
        navigate("/agency/dashboard");
      } else {
        navigate("/user/Home");
      }

    } catch (err) {
      const error = err?.response?.data?.detail || "Google login failed";
      toast.error(error);
      console.error("Google login error:", err);
    }
  };

  return { googleLogin };
};