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
// const fileDeleteOnCloudinary = async (publicIds) => {
//   console.log(publicIds);
//   try {
//     if (typeof publicIds === "string") {
//       const result = await cloudinary.api.delete_resources(publicIds, {
//         folder: "e-comm",
//         resource_type: "image",
//       });
//       console.log("Deleted image from Cloudinary:", result);
//       return result;
//     } else if (Array.isArray(publicIds)) {
//       const results = await Promise.all(
//         publicIds.map(
//           async (id) =>
//             await cloudinary.api.delete_resources(id, {
//               folder: "e-comm",
//               resource_type: "image",
//             })
//         )
//       );
//       console.log("Deleted images from Cloudinary:", results);
//       return results;
//     } else {
//       throw new Error(
//         "Invalid publicIds argument. Must be a string or an array of strings."
//       );
//     }
//   } catch (error) {
//     console.log("Error deleting images from Cloudinary:", error);
//     throw error;
//   }
// };

export { fileUploadOnCloudinary, fileDeleteOnCloudinary };
