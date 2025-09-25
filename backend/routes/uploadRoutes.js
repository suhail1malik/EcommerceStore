// backend/routes/uploadRoutes.js
import express from "express";
import upload from "../middlewares/upload.js"; // memory storage multer
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// helper to upload buffer via upload_stream
const streamUpload = (buffer, folder = "ecommerce_products") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });

// POST /api/upload (single image)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const uploadResult = await streamUpload(req.file.buffer);
    // uploadResult contains secure_url, public_id, etc.
    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      raw: uploadResult,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res
      .status(500)
      .json({ message: "Upload failed", error: err.message });
  }
});

export default router;
