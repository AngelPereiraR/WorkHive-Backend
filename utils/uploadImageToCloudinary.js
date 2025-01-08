import { cloudinary } from "./cloudinaryConfig.js";

export async function uploadImage(imagePath) {

  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    public_id: imagePath,
    folder: "users"
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    return result.secure_url;
  } catch (error) {
    console.error(error);
  }
}
