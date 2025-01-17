import { isValidObjectId } from "mongoose";
import { BadRequestError } from "../errors/BadRequestError.js";

/**
 * Middleware para validar el formato de un ObjectId de Mongoose.
 * 
 * @function
 * @param {string} [paramName='asignado'] - Nombre del parámetro en los parámetros del body que contiene el ObjectId.
 * @returns {Function} Middleware de validación.
 */
export const validateAsignadoTareaFormat = (paramName = 'asignado') => {
  return (req, res, next) => {
    /**
     * Valor del parámetro de la ruta especificado.
     * @type {string}
     */
    const paramValue = req.body[paramName] || '';

    // Verificamos si el valor es un ObjectId válido
    if (!isValidObjectId(paramValue)) {
      // Enviamos un error BadRequest si no es válido
      next(new BadRequestError(`param_${paramName}_is_not_a_valid_objectid`.toLowerCase()));
    } else {
      // Continuamos al siguiente middleware si es válido
      next();
    }
  };
};

