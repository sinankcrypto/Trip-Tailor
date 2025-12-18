import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";

const ImageCropModal = ({
  imageSrc,
  onConfirm,
  onCancel,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-[90%] max-w-md">
        <div className="relative w-full h-64 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            disabled={!croppedArea}
            onClick={() => onConfirm(croppedArea)}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
