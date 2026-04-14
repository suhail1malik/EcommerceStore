import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

/**
 * Extracts a cropped image from a source image using the provided pixel coordinates.
 */
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Output dimensions
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      // create a File object from the blob
      const file = new File([blob], "cropped-image.jpeg", { type: "image/jpeg" });
      resolve(file);
    }, "image/jpeg");
  });
}

/**
 * ImageCropper component overlays a full-screen modal allowing 4:5 aspect ratio cropping.
 * 
 * @param {string} imageSrc - Object URL of the image selected by the input
 * @param {Function} onCropDone - Callback with the final Cropped File Blob
 * @param {Function} onCropCancel - Callback to close the modal
 */
export default function ImageCropper({ imageSrc, onCropDone, onCropCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropDone(croppedFile);
    } catch (e) {
      console.error(e);
    }
  };

  if (!imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-12">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <h3 className="text-xl font-bold text-white">Adjust Image Frame</h3>
          <button
            onClick={onCropCancel}
            className="text-slate-400 hover:text-white transition-colors text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative flex-1 w-full bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 5} // Lock aspect ratio to 4:5
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* Footer Controls */}
        <div className="p-4 sm:p-6 bg-slate-800 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-1/2 flex items-center gap-4">
            <span className="text-slate-400 font-medium">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="flex w-full sm:w-auto gap-3">
            <button
              onClick={onCropCancel}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold tracking-wide shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              Save Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
