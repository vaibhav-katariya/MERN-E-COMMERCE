import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dlvceyyrc',
  api_key: process.env.CLOUDINARY_API_KEY || '371261487771458',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'QjZSGj0kKDnN5ZCGCEkjU8SfmQQ',
});


const fileUploadOnCloudinary = async (LoacalFilePath) => {
  try {
    if (!LoacalFilePath) return null;
    
    const responce = await cloudinary.uploader.upload(LoacalFilePath, {
      resource_type: "image",
    });
    fs.unlinkSync(LoacalFilePath);
    
    return responce;

  } catch (error) {
    fs.unlinkSync(LoacalFilePath);
    console.log("error while upload image on cloudinary", error);
    return null;
  }
};

const fileDeleteOnCloudinary = async (public_id) => {
  try {
    if (!public_id) return null;
    const response = await cloudinary.api.delete_resources(public_id, {
      resource_type: "image",
    });
    return response;
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

export { fileUploadOnCloudinary, fileDeleteOnCloudinary };
