import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center"
      >
        <div className="flex justify-center mb-4">
          <XCircle className="text-red-500 w-16 h-16" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-6">
          It looks like your payment was cancelled or not completed.  
          Don’t worry — your booking hasn’t been confirmed yet.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/User/Home")}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCancelPage;
