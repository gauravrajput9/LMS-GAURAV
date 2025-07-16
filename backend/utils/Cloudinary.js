import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Upload file to cloudinary
const uploadFile = async (localFilePath) => {
  try {
    if (!fs.existsSync(localFilePath)) {
      throw new Error("File not found at path: " + localFilePath);
    }

    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    try {
      fs.unlinkSync(localFilePath);
    } catch (unlinkErr) {
      console.error("Error deleting local file:", unlinkErr.message);
    }

    return res;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
  }
};

const deleteOldImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error.message);
    return { result: "error", error: error.message };
  }
};

const deleteVideoFromCloudinary = async (publicId, localPath = null) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });

    if (localPath) {
      deleteLocalFile(localPath);
    }

    return result;
  } catch (error) {
    console.error("Error deleting video from Cloudinary:", error);
    return { result: "error", error };
  }
};

const deleteLocalFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting local file:", err);
    } else {
      console.log("Local file deleted:", filePath);
    }
  });
};

export { uploadFile, deleteOldImage, deleteVideoFromCloudinary };
