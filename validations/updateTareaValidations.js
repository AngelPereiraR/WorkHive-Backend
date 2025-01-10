import * as yup from "yup";
import {es} from "yup-locales";

yup.setLocale(es);

/**
 * Esquema de validación para la actualización de tareas
 *
 * @constant {yup.ObjectSchema} schema
 */
const schema = yup.object().shape({

    /**
     * Validación opcional del nombre de la tarea
     * Debe ser una cadena con al menos 3 caracteres si se proporciona
     */
    nombre: yup.string()
        .trim()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .notRequired(),

    /**
     * Validación opcional de la descripción de la tarea
     * Debe ser una cadena con al menos 3 caracteres si se proporciona
     */
    descripcion: yup.string()
        .trim()
        .min(3, "La descripción debe tener al menos 3 caracteres")
        .notRequired(),

    /**
     * Validación opcional de la prioridad de la tarea
     * Si se proporciona, debe ser "baja", "media" o "alta"
     */
    prioridad: yup.string()
        .oneOf(['baja', 'media', 'alta'], "La prioridad debe ser baja, media o alta")
        .notRequired(),

    /**
     * Validación opcional del estado de la tarea
     * Si se proporciona, debe ser "pendiente", "en proceso", "en revisión" o "completada"
     */
    estado: yup.string()
        .oneOf(['pendiente', 'en_proceso', 'en_revision', 'completada'], "El estado de la tarea deber ser pendiente, en proceso, en revisión o completada")
        .notRequired(),

    /**
     * Validación opcional de la fecha límite de la tarea
     * Si se propociona, debe ser posterior a la fecha actual
     */
    fechaLimite: yup.date()
        .min(new Date(), 'La fecha debe ser posterior a la actual')
        .notRequired()
        .nullable(),

    /**
     * Validación opcional del ID del usuario asignado
     * Puede ser nulo
     */
    asignadoA: yup.string()
        .notRequired()
        .nullable(),

    /**
     * Validación opcional del listado de comentarios de la tarea
     */
    comentarios: yup.array()
        .of(yup.object({
            usuario: yup.string()
                .required(),

            mensaje: yup.string()
                .required(),

            fecha: yup.date()
                .default(new Date())
        })).notRequired().min(1),

    tablero: yup.string()
        .notRequired()
});

/**
 * Middleware para validar los datos de actualización de tareas
 *
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @throws {Error} Si la validación falla, se pasa el error al siguiente middleware.
 */
export const updateTareaValidations = async (req, res, next) => {
    try {
        req.curatedBody = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        next();
    } catch (error) {
        next(error);
    }
}