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
      resource_type: "auto",
    });
    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    console.log("Error uploading to Cloudinary", error);
    fs.unlinkSync(filePath);
    return null;
  }
};

const fileDeleteOnCloudinary = async (public_ids) => {
  if (!public_ids) return null;

  if (typeof public_ids === "string") {
    public_ids = [public_ids];
  }

  const newPublicIds = public_ids.map((public_id) => "e-comm/" + public_id);

  try {
    const response = await cloudinary.api.delete_resources(newPublicIds, {
      folder: "e-comm",
      resource_type: "image",
    });

    return response;
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, error: error.message };
  }
};
export { fileUploadOnCloudinary, fileDeleteOnCloudinary };
