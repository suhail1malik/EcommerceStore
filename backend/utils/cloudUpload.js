// backend/utils/cloudUpload.js
import { uploader } from "../config/cloudinary";

const streamUpload = (buffer, folder = "ecommerce_products") =>
  new Promise((resolve, reject) => {
    const stream = uploader.upload_stream({ folder }, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    stream.end(buffer);
  });

export default { streamUpload };
