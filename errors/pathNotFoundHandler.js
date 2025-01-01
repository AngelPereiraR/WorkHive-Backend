/**
 * Middleware para manejar rutas no encontradas.
 * 
 * Este middleware se ejecuta cuando una solicitud no coincide con ninguna de las rutas definidas.
 * Devuelve un error 404 con un mensaje indicando que la URL no fue encontrada.
 * 
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware o controlador de errores.
 */
export function pathNotFoundHandler(req, res, next) {
  try {
    console.info("path not found");

    /**
     * Respuesta JSON con el mensaje de error.
     * @type {Object}
     */
    const response = { message: 'url not found' };

    // Enviamos una respuesta con estado 404
    return res.status(404).json(response);
  } catch (e) {
    // En caso de error, pasamos al siguiente middleware de errores
    next(e);
  }
}

