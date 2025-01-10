import {BadRequestError} from "../errors/BadRequestError.js";

export const validatePrioridadTareaFormat = (paramName = 'prioridad') => {
    return (req, res, next) => {
        const paramValue = req.params[paramName] || '';

        if (paramValue === "baja" || paramValue === "media" || paramValue === "alta") {
            next();
        } else {
            next(new BadRequestError(`param_${paramName}_is_not_valid_priority`.toLowerCase()));
        }

    }
};
