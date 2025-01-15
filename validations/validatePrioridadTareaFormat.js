import { BadRequestError } from "../errors/BadRequestError.js";

/**
 * Middleware para validar el formato de la prioridad
 *
 * @function
 * @param {string} [paramName='prioridad'] - Nombre del parámetro en los parámetros de la ruta que contiene la prioridad
 * @returns {Function} Middleware de validación
 */
export const validatePrioridadTareaFormat = (paramName = 'prioridad') => {
    return (req, res, next) => {
        const paramValue = req.body[paramName] || '';

        if (paramValue === "baja" || paramValue === "media" || paramValue === "alta") {
            next();
        } else {
            next(new BadRequestError(`param_${paramName}_is_not_valid_priority`.toLowerCase()));
        }

    }
};
