import * as yup from 'yup';
import {es} from 'yup-locales';

yup.setLocale(es);

const schema = yup.object().shape({
    nombre: yup.string()
        .trim()
        .required('El nombre es obligatorio')
        .min(3, "El nombre debe tener al menos 3 caracteres"),

    descripcion: yup.string()
        .trim()
        .min(3, "La descripción debe tener al menos 3 caracteres")
        .optional(),

    prioridad: yup.string()
        .oneOf(['baja', 'media', 'alta'], "La prioridad debe ser baja, media o alta")
        .optional()
        .default('media'),

    estado: yup.string()
        .oneOf(['pendiente', 'en_proceso', 'en_revision', 'completada'], "El estado de la tarea deber ser pendiente, en proceso, en revisión o completada")
        .optional()
        .default('pendiente'),

    fechaLimite: yup.date()
        .min(new Date(), 'La fecha debe ser posterior a la actual')
        .optional()
        .nullable(),

    asignadoA: yup.string()
        .optional()
        .nullable(),

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

export const createTareaValidations = async (req, res, next) => {
    try {
        req.curatedBody = await schema.validate(req.body, {abortEarly: false, stripUnknown: true});
        next();
    } catch (error) {
        next(error);
    }
}