// backend/middlewares/upload.js
import multer from "multer";

const storage = multer.memoryStorage();
const limits = { fileSize: 5 * 1024 * 1024 }; // 5 MB

const fileFilter = (req, file, cb) => {
  const allowed = /jpe?g|png|webp/;
  const ext = file.originalname.split(".").pop().toLowerCase();
  const mimetype = file.mimetype;
  if (allowed.test(ext) && /image\/(jpeg|png|webp)/.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only (jpg, png, webp)"), false);
  }
};

const upload = multer({ storage, limits, fileFilter });

export default upload;
