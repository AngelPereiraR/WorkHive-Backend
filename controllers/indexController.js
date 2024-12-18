import express from 'express'

// Obtenemos el sistema de enrutado de express para configurarlo
const indexController = express.Router();

/**
 * Configuración de la ruta base '/' utilizando el enrutador de Express.
 * Se establece que cuando se haga una petición GET, se devolverá un objeto JSON
 * con la versión de la API y un mensaje.
 */
indexController.route('/')
  /**
   * Controlador para la ruta GET en la raíz de la aplicación.
   * Responde con un objeto JSON que contiene la versión de la API y un mensaje de saludo.
   * 
   * @param {Object} req - El objeto de la solicitud de Express.
   * @param {Object} res - El objeto de la respuesta de Express.
   */
  .get((req, res) => {
    const apiVersion = { version: process.env.API_VERSION || '1.0.0', message: "¡¡Hola Mundo!!" };
    res.json(apiVersion);
  });

// Exportamos las rutas de la página principal de mi servicio ya configuradas
// para engancharlas en el punto de entrada (index.js).
export { indexController };
