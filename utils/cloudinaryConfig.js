import { v2 as cloudinary } from 'cloudinary';

/**
 * Configura la instancia de Cloudinary con las credenciales necesarias.
 * Las credenciales y configuraciones se obtienen de las variables de entorno:
 * - `CLOUDINARY_CLOUD_NAME`: Nombre del cloud de Cloudinary.
 * - `CLOUDINARY_API_KEY`: Clave de la API de Cloudinary.
 * - `CLOUDINARY_API_SECRET`: Secreto de la API de Cloudinary.
 * - `secure`: Indica si las URLs generadas deben usar HTTPS (valor predeterminado: `true`).
 * 
 * @namespace cloudinaryConfig
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Exporta la instancia configurada de Cloudinary.
 * 
 * @module cloudinary
 * @type {Object}
 */
export { cloudinary };
