import * as yup from 'yup';
import { es } from 'yup-locales';

yup.setLocale(es);

/**
 * Esquema de validación para la creación de un tablero.
 * 
 * @constant {yup.ObjectSchema} createTableroSchema
 */
export const createTableroSchema = yup.object().shape({
  /**
   * Validación del nombre del tablero.
   * Debe ser una cadena, sin espacios al inicio o final, y es obligatorio.
   */
  nombre: yup.string()
    .required('El nombre del tablero es obligatorio.')
    .trim(),

  /**
   * Validación de la descripción del tablero.
   * Debe ser una cadena, sin espacios al inicio o final.
   */
  descripcion: yup.string()
    .trim(),

  /**
   * Validación de la fecha de inicio del proyecto.
   * Debe ser una fecha válida o nula.
   */
  fechaInicio: yup.date()
    .nullable(),

  /**
   * Validación de la fecha de finalización del proyecto.
   * Debe ser una fecha válida o nula.
   */
  fechaFin: yup.date()
    .nullable(),

  /**
   * Validación del administrador del tablero.
   * Debe ser una cadena que contenga un ObjectId válido y es obligatorio.
   */
  administrador: yup.string()
    .required('El administrador del tablero es obligatorio.')
    .matches(/^[0-9a-fA-F]{24}$/, 'El ID del administrador debe ser un ObjectId válido.'),

  /**
   * Validación de los colaboradores del tablero.
   * Debe ser una lista de cadenas que contengan ObjectIds válidos.
   */
  colaboradores: yup.array()
    .of(yup.string().matches(/^[0-9a-fA-F]{24}$/, 'El ID del colaborador debe ser un ObjectId válido.'))
    .nullable()
});

/**
 * Middleware para validar la creación de tableros.
 * 
 * @async
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @throws {Error} Si la validación falla, se pasa el error al siguiente middleware.
 */
export const createTableroValidations = async (req, res, next) => {
  try {
    req.curatedBody = await createTableroSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    next();
  } catch (error) {
    next(error);
  }
};