import { cloudinary } from "./cloudinaryConfig.js";

/**
 * Sube una imagen a Cloudinary y devuelve la URL segura de la imagen.
 * 
 * @async
 * @function uploadImage
 * @param {string} imagePath - Ruta local o URL de la imagen que se desea subir.
 * @returns {Promise<string|null>} URL segura de la imagen subida o `null` si ocurre un error.
 * @throws {Error} Registra el error en la consola si la subida falla.
 * 
 * @example
 * import { uploadImage } from './uploadImageToCloudinary.js';
 * 
 * const imageUrl = await uploadImage('./images/avatar.jpg');
 * console.log(imageUrl); // https://res.cloudinary.com/<cloud_name>/users/avatar.jpg
 */
export async function uploadImage(imagePath) {
  const options = {
    use_filename: true,     // Utiliza el nombre original del archivo.
    unique_filename: false, // No genera un nombre único automáticamente.
    overwrite: true,        // Sobrescribe el archivo existente con el mismo nombre.
    public_id: imagePath,   // Define el ID público basado en la ruta proporcionada.
    folder: "users",        // Almacena las imágenes en la carpeta "users".
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    return result.secure_url;
  } catch (error) {
    console.error(error);
    return null; // Retorna null en caso de error.
  }
}
