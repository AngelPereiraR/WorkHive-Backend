import { ValidationError } from "yup";
import { BadRequestError } from "./BadRequestError.js";
import { SessionRequiredError } from "./SessionRequiredError.js";
import { ForbiddenError } from "./ForbiddenError.js";
import jwt from "jsonwebtoken";

/**
 * Middleware para manejar errores personalizados y globales en la aplicación.
 * 
 * Este middleware captura y gestiona diferentes tipos de errores, devolviendo respuestas específicas según el tipo de error.
 * 
 * @function
 * @param {Error} err - Objeto de error capturado.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware o controlador.
 */
export function customErrorHandler(err, req, res, next) {
  // Si los encabezados de la respuesta ya se enviaron, pasamos el error al siguiente middleware
  if (res.headersSent) {
    return next(err);
  }

  // Manejo de errores de validación de Yup
  if (err instanceof ValidationError) {
    res.status(400).json({ message: "validation error", errors: err.errors || [] });
  }
  // Manejo de errores de solicitud incorrecta
  else if (err instanceof BadRequestError) {
    res.status(400).json({ message: "validation error", errors: [err.message] });
  }
  // Manejo de errores de sesión requerida
  else if (err instanceof SessionRequiredError) {
    res.status(401).json({ message: err.message });
  }
  // Manejo de errores de token JWT inválido
  else if (err instanceof jwt.JsonWebTokenError) {
    res.status(401).json({ message: "invalid session" });
  }
  // Manejo de errores de acceso prohibido
  else if (err instanceof ForbiddenError) {
    res.status(403).json({ message: err.message });
  }
  // Manejo de errores internos no especificados
  else {
    console.info(err);
    res.status(500).json({ message: 'internal error' });
  }
}

