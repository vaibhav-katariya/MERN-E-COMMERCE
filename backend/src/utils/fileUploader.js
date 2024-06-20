import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import fs from "fs";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileUploadOnCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "e-comm",
      resource_type: "image",
    });
    fs.unlinkSync(filePath);
    return { url: result.url };
  } catch (error) {
    console.log("Error uploading to Cloudinary", error);
    fs.unlinkSync(filePath);
    return null;
  }
};
const fileDeleteOnCloudinary = async (publicIds) => {
  console.log("Received publicIds:", publicIds);
  try {
    // Ensure publicIds is an array
    if (typeof publicIds === "string") {
      publicIds = [publicIds];
    } else if (!Array.isArray(publicIds)) {
      throw new Error("Invalid publicIds argument. Must be a string or an array of strings.");
    }

    // Log the publicIds to be deleted
    console.log("publicIds to be deleted:", publicIds);

    // Perform the deletion
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: "image",
    });

    // Log the result from Cloudinary
    console.log("Deleted images from Cloudinary:", result);
    return result;
  } catch (error) {
    // Log the error details
    console.error("Error deleting images from Cloudinary:", error);
    throw error;
  }
};
export { fileUploadOnCloudinary, fileDeleteOnCloudinary };
