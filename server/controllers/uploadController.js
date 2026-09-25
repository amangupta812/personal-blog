import fs from 'fs';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

// @desc    Upload image (Local or Cloudinary)
// @route   POST /api/upload
// @access  Private/Admin
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded.',
      });
    }

    // If Cloudinary credentials are set, upload to Cloudinary
    if (isCloudinaryConfigured) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'personal-blog',
        use_filename: true,
        unique_filename: true,
      });

      // Remove local temp file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(200).json({
        success: true,
        message: 'Image uploaded to Cloudinary successfully',
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
    }

    // Fallback: Local URL
    const localUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    return res.status(200).json({
      success: true,
      message: 'Image uploaded to local storage successfully',
      imageUrl: localUrl,
      fileName: req.file.filename,
    });
  } catch (err) {
    // Clean up local file on error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        // ignore
      }
    }
    next(err);
  }
};
