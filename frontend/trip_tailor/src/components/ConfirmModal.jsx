import React from 'react'

const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  showInput = false,
  inputValue = "",
  onInputChange = () => {},
  maxWords = 50,
  confirmDisabled = false,
}) => {
  if (!isOpen) return null;

  const words = inputValue.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const isOverLimit = wordCount > maxWords;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          {title}
        </h2>

        <p className="text-gray-600 mb-4">{message}</p>

        {showInput && (
          <div className="mb-4">
            <textarea
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              rows={3}
              placeholder="Optional: tell us why you're cancelling (max 50 words)"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />

            <div
              className={`text-xs mt-1 text-right ${
                isOverLimit ? "text-red-500" : "text-gray-500"
              }`}
            >
              {wordCount}/{maxWords} words
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={confirmDisabled || isOverLimit}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;