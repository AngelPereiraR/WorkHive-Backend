import {BadRequestError} from "../errors/BadRequestError.js";

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