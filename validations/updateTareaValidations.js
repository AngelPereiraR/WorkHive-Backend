import * as yup from "yup";
import {es} from "yup-locales";

yup.setLocale(es);

const schema = yup.object().shape({
    nombre: yup.string()
        .trim()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .notRequired(),

    descripcion: yup.string()
        .trim()
        .min(3, "La descripción debe tener al menos 3 caracteres")
        .notRequired(),

    prioridad: yup.string()
        .oneOf(['baja', 'media', 'alta'], "La prioridad debe ser baja, media o alta")
        .notRequired(),

    estado: yup.string()
        .oneOf(['pendiente', 'en proceso', 'en revisión', 'completada'], "El estado de la tarea deber ser pendiente, en proceso, en revisión o completada")
        .notRequired(),

    fechaLimite: yup.date()
        .min(new Date(), 'La fecha debe ser posterior a la actual')
        .notRequired()
        .nullable(),

    asignadoA: yup.string()
        .notRequired()
        .nullable(),

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

export const updateTareaValidations = async (req, res, next) => {
    try {
        req.curatedBody = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        next();
    } catch (error) {
        next(error);
    }
}