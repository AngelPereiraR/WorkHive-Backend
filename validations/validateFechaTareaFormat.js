import { BadRequestError } from "../errors/BadRequestError.js";

/**
 * Middleware para validar el formato de la fecha
 *
 * @function
 * @param {string} [paramName='fecha'] - Nombre del parámetro en los parámetros de la ruta que contiene la fecha
 * @returns {Function} Middleware de validación
 */
export const validateFechaTareaFormat = (paramName = 'fecha') => {
    return (req, res, next) => {
        const paramValue = req.body[paramName] || '';

        if (!isValidDate(paramValue)) {
            next(new BadRequestError(`param_${paramName}_is_not_a_valid_date`.toLowerCase()));
        } else {
            next();
        }
    }
}

/**
 * Validación de la fecha
 * @param {String} fecha Fecha para comprobar
 * @returns {boolean} True si es una fecha válida o False si no es válida
 */
function isValidDate(fecha) {
    // Expresión regular con grupos de captura para mm, dd y yyyy
    const regexFecha = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(\d{4})$/;

    const match = fecha.match(regexFecha);

    if (!match) {
        return false;
    }

    const [, mes, dia, anio] = match; // Extrae mes, día y año de los grupos de captura
    const numDia = parseInt(dia, 10);
    const numMes = parseInt(mes, 10);
    const numAnio = parseInt(anio, 10);

    // Verificar rango de meses
    if (numMes < 1 || numMes > 12) {
        return false;
    }

    // Determinar el número máximo de días según el mes
    const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Ajustar febrero para años bisiestos
    if (numAnio % 400 === 0 || (numAnio % 100 !== 0 && numAnio % 4 === 0)) {
        diasPorMes[1] = 29;
    }

    // Verificar el rango de días
    return numDia > 0 && numDia <= diasPorMes[numMes - 1];
}
