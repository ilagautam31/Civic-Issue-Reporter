import cloudinary from "../config/cloudinary.js";

/**
 * Uploads a file buffer (from multer's memoryStorage) to Cloudinary and
 * returns the resulting secure URL. Wrapped in a Promise because
 * Cloudinary's upload_stream API is callback-based.
 */
export const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "civic-reporter",
        transformation: [{ width: 1200, height: 1200, crop: "limit" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};
