/**
 * Upload Controller
 *
 * Handles image uploads for complaints and other modules.
 * Uses Cloudinary if CLOUDINARY_* env vars are set,
 * otherwise falls back to base64 data URLs (useful for local dev/demo without cloud setup).
 */

let cloudinary = null;

// Dynamically load Cloudinary only if configured
const initCloudinary = () => {
  if (cloudinary) return cloudinary;
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    try {
      const { v2 } = require('cloudinary');
      v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      cloudinary = v2;
      console.log('[Upload] Cloudinary configured successfully');
    } catch (err) {
      console.warn('[Upload] Cloudinary SDK not installed, falling back to base64 mode');
    }
  }
  return cloudinary;
};

/**
 * Upload a single image buffer to Cloudinary.
 * Returns the secure URL.
 */
const uploadToCloudinary = (buffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    const cld = initCloudinary();
    const uploadStream = cld.uploader.upload_stream(
      {
        folder: folder || 'jalrakshak/complaints',
        public_id: publicId,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * POST /api/v1/upload/image
 * Accepts multipart/form-data with field name "images" (up to 5 files)
 * Returns array of image URLs
 */
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const cld = initCloudinary();
    const urls = [];

    for (const file of req.files) {
      if (cld) {
        // Upload to Cloudinary
        const publicId = `complaint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const url = await uploadToCloudinary(file.buffer, 'jalrakshak/complaints', publicId);
        urls.push(url);
      } else {
        // Fallback: return base64 data URL (for demo/local without Cloudinary)
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        urls.push(base64);
      }
    }

    return res.status(200).json({
      success: true,
      message: `${urls.length} image(s) uploaded successfully`,
      data: { urls },
    });
  } catch (error) {
    console.error('[Upload] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message,
    });
  }
};

module.exports = { uploadImages };
