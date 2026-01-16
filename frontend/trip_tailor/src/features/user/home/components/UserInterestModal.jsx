import { useEffect, useState } from "react";
import { useCreateUserInterests } from "../../profile/hooks/useCreateuserIntersests";
import { getInterests } from "../../../packages/services/packageService";
import toast from "react-hot-toast";

const UserInterestsModal = ({ isOpen, onClose, onSuccess }) => {
  const [interests, setInterests] = useState([]);
  const [selected, setSelected] = useState([]);

  const { submitInterests, loading, error } = useCreateUserInterests();

  useEffect(() => {
    if (!isOpen) return;

    const fetchInterests = async () => {
      try {
        const data = await getInterests();
        setInterests(data || []);
      } catch {
        toast.error("Failed to load interests");
      }
    };

    fetchInterests();
  }, [isOpen]);

  const toggleInterest = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }

    try {
      await submitInterests(selected);
      toast.success("Interests saved successfully");
      onSuccess?.();
      onClose();
    } catch {
      // error already stored in hook
      toast.error("Failed to save interests");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">
          Choose your interests
        </h2>

        {/* Interests Grid */}
        <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
          {interests.map((interest) => (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`rounded-lg border px-3 py-2 text-sm transition
                ${
                  selected.includes(interest.id)
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
            >
              {interest.name}
            </button>
          ))}
        </div>

        {/* Backend error */}
        {error && (
          <p className="mt-3 text-sm text-red-600">
            {typeof error === "string"
              ? error
              : error.detail || "Something went wrong"}
          </p>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInterestsModal;
