import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import { X } from "lucide-react"; // For close icon

const AgencyDetails = () => {
  const { id } = useParams();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [previewImage, setPreviewImage] = useState(null); // For full image view

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgency = async () => {
      try {
        const res = await apiClient.get(`admin-panel/agencies/${id}/`);
        setAgency(res.data);
      } catch (err) {
        console.error("Failed to fetch agency:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgency();
  }, [id]);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      await apiClient.post(`admin-panel/agencies/${id}/verify/`);
      setAgency((prev) => ({ ...prev, status: "VERIFIED" }));
      toast.success("Agency verified successfully!");
      navigate("/admin-panel/agencies");
    } catch (err) {
      console.error("Verification failed:", err);
      toast.error("Failed to verify agency. Please try again.");
    } finally {
      setVerifying(false);
      setIsVerifyModalOpen(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setRejecting(true);
    try {
      await apiClient.post(`admin-panel/agencies/${id}/reject/`, {
        reason: rejectReason,
      });
      setAgency((prev) => ({ ...prev, status: "REJECTED" }));
      toast.success("Agency rejected successfully!");
      navigate("/admin-panel/agencies");
    } catch (err) {
      console.error("Rejection failed:", err);
      toast.error("Failed to reject agency. Please try again.");
    } finally {
      setRejecting(false);
      setIsRejectModalOpen(false);
      setRejectReason("");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 font-[Lexend]">
      <h1 className="text-2xl font-semibold text-green-700 mb-4">
        Agency Details
      </h1>

      <div className="bg-white rounded shadow p-4 border border-gray-200 space-y-2">
        <p>
          <strong>ID:</strong> {agency.agency_id}
        </p>
        <p>
          <strong>Username:</strong> {agency.username}
        </p>
        <p>
          <strong>Email:</strong> {agency.email}
        </p>
        <p>
          <strong>Active:</strong> {agency.is_active ? "✅" : "❌"}
        </p>
        <p>
          <strong>Status:</strong> {agency.status}
        </p>
        <p>
          <strong>Profile Completed:</strong>{" "}
          {agency.profile_completed ? "✅" : "❌"}
        </p>
        <p>
          <strong>Phone:</strong> {agency.phone_number || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {agency.address || "N/A"}
        </p>
        <p>
          <strong>Description:</strong> {agency.description || "N/A"}
        </p>

        {agency.profile_pic && (
          <div>
            <strong>Profile Picture:</strong>
            <img
              src={agency.profile_pic}
              alt="Profile"
              className="h-24 mt-1 cursor-pointer hover:opacity-80 transition border rounded"
              onClick={() => setPreviewImage(agency.profile_pic)}
            />
          </div>
        )}

        {agency.license_document && (
          <div>
            <strong>License Document:</strong>
            <img
              src={agency.license_document}
              alt="License"
              className="h-24 mt-1 cursor-pointer hover:opacity-80 transition border rounded"
              onClick={() => setPreviewImage(agency.license_document)}
            />
          </div>
        )}

        {/* Action Buttons */}
        {!["verified", "rejected"].includes(agency.status) &&
          agency.profile_completed && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setIsVerifyModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve Agency
              </button>
              <button
                onClick={() => setIsRejectModalOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject Agency
              </button>
            </div>
          )}
      </div>

      {/* ✅ Verify Confirmation Modal */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Verification</h2>
            <p className="mb-6">
              Are you sure you want to verify this agency?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                disabled={verifying}
                className={`px-4 py-2 rounded text-white ${
                  verifying
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {verifying ? "Verifying..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ❌ Reject Modal with Reason */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Reject Agency</h2>
            <textarea
              placeholder="Enter rejection reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border rounded p-2 mb-4"
              rows={3}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejecting}
                className={`px-4 py-2 rounded text-white ${
                  rejecting
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {rejecting ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🖼️ Fullscreen Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-6xl w-full flex justify-center items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-5 right-5 text-white hover:text-gray-300 transition"
              onClick={() => setPreviewImage(null)}
            >
              <X size={32} />
            </button>
            <img
              src={previewImage}
              alt="Full Preview"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyDetails;
