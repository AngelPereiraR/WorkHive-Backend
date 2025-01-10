import * as yup from 'yup';
import {es} from 'yup-locales';

yup.setLocale(es);

/**
 * Esquema de validación para la creación de tareas
 *
 * @constant {yup.ObjectSchema} schema
 */
const schema = yup.object().shape({

    /**
     * Validación del nombre de la tarea.
     * Debe ser una cadena, sin espacios al inicio o final, con al menos 3 caracteres.
     */
    nombre: yup.string()
        .trim()
        .required('El nombre es obligatorio')
        .min(3, "El nombre debe tener al menos 3 caracteres"),

    /**
     * Validación de la descripción de la tarea
     * Debe ser una cadena, sin espacios al inicio o final, con al menos 3 caracteres.
     */
    descripcion: yup.string()
        .trim()
        .min(3, "La descripción debe tener al menos 3 caracteres")
        .optional(),

    /**
     * Validación de la prioridad de la tarea
     * Debe ser "baja", "media" o "alta"
     */
    prioridad: yup.string()
        .oneOf(['baja', 'media', 'alta'], "La prioridad debe ser baja, media o alta")
        .optional()
        .default('media'),

    /**
     * Validación del estado de la tarea
     * Debe ser "pendiente", "en proceso", "en revisión" o "completada"
     */
    estado: yup.string()
        .oneOf(['pendiente', 'en_proceso', 'en_revision', 'completada'], "El estado de la tarea deber ser pendiente, en proceso, en revisión o completada")
        .optional()
        .default('pendiente'),

    /**
     * Validación de la fecha límite de la tarea
     * Debe ser posterior a la fecha actual
     */
    fechaLimite: yup.date()
        .min(new Date(), 'La fecha debe ser posterior a la actual')
        .optional()
        .nullable(),

    /**
     * Validación del usuario asignado a la tarea
     * Debe ser una cadena que contenga el ID del usuario.
     * Puede ser nulo.
     */
    asignadoA: yup.string()
        .optional()
        .nullable(),

    /**
     * Validación de los comentarios de la tarea
     * Debe ser una lista con al menos un comentario
     */
    comentarios: yup.array()
        .of(yup.object({
            usuario: yup.string()
                .required(),

            mensaje: yup.string()
                .required(),

            fecha: yup.date()
                .default(new Date())
        })).optional().min(1),

    tablero: yup.string()
        .required()

});

/**
 * Moddleware para validar la creación de tareas.
 *
 * @async
 * @function
 * @param {Object} req - Objeto de la solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 * @throws {Error} Si la validación falla, se pasa el error al siguiente middleware
 */
export const createTareaValidations = async (req, res, next) => {
    try {
        req.curatedBody = await schema.validate(req.body, {abortEarly: false, stripUnknown: true});
        next();
    } catch (error) {
        next(error);
    }
}