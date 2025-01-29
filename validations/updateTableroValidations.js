import * as yup from 'yup';
import { es } from 'yup-locales';

yup.setLocale(es);

/**
 * Esquema de validación para la actualización de un tablero.
 * 
 * @constant {yup.ObjectSchema} updateTableroSchema
 */
export const updateTableroSchema = yup.object().shape({
  /**
   * Validación del nombre del tablero.
   * Debe ser una cadena, sin espacios al inicio o final, y es obligatorio.
   */
  nombre: yup.string()
    .trim()
    .required('El nombre del tablero es obligatorio.'),

  /**
   * Validación de la descripción del tablero.
   * Debe ser una cadena, sin espacios al inicio o final.
   */
  descripcion: yup.string()
    .notRequired()
    .trim(),

  /**
   * Validación de la fecha de inicio del proyecto.
   * Debe ser una fecha válida o nula.
   */
  fechaInicio: yup.date()
    .notRequired()
    .nullable(),

  /**
   * Validación de la fecha de finalización del proyecto.
   * Debe ser una fecha válida o nula.
   */
  fechaFin: yup.date()
    .notRequired()
    .nullable(),

  /**
   * Validación del administrador del tablero.
   * Debe ser una cadena que contenga un ObjectId válido y es obligatorio.
   */
  administrador: yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, 'El ID del administrador debe ser un ObjectId válido.')
    .notRequired(),

  /**
   * Validación de los colaboradores del tablero.
   * Debe ser una lista de cadenas que contengan ObjectIds válidos.
   */
  colaboradores: yup.array()
    .of(yup.string().matches(/^[0-9a-fA-F]{24}$/, 'El ID del colaborador debe ser un ObjectId válido.'))
    .notRequired()
    .nullable()
});

/**
 * Middleware para validar la actualización de tableros.
 * 
 * @async
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @throws {Error} Si la validación falla, se pasa el error al siguiente middleware.
 */
export const updateTableroValidations = async (req, res, next) => {
  try {
    req.curatedBody = await updateTableroSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    next();
  } catch (error) {
    next(error);
  }
};