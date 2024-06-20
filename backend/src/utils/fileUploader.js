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

const fileDeleteOnCloudinary = async (public_ids) => {
  if (!public_ids) return null;

  try {
    const response = await cloudinary.api.delete_resources(public_ids, {
      folder: "e-comm",
      resource_type: "image",
    });

    console.log(response);
    return response;
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, error: error.message };
  }
};
export { fileUploadOnCloudinary, fileDeleteOnCloudinary };
