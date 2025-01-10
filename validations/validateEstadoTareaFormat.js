import {BadRequestError} from "../errors/BadRequestError.js";

/**
 * Middleware para validar el formato del estadp
 *
 * @function
 * @param {string} [paramName='estado'] - Nombre del parámetro en los parámetros de la ruta que contiene el estado
 * @returns {Function} Middleware de validación
 */
export const validateEstadoTareaFormat = (paramName = 'estado') => {
    return (req, res, next) => {
        const paramValue = req.params[paramName] || '';

        if (paramValue === "pendiente" || paramValue === "en_proceso" || paramValue === "en_revision" || paramValue === "completada") {
            next();
        } else {
            next(new BadRequestError(`param_${paramName}_is_not_valid_state`.toLowerCase()));
        }
    }
};