import * as yup from 'yup';
import { es } from 'yup-locales';

yup.setLocale(es);

/**
 * Esquema de validación para la actualización de usuarios.
 * 
 * @constant {yup.ObjectSchema} schema
 */
const schema = yup.object().shape({
  /**
   * Validación opcional del nombre del usuario.
   * Debe ser una cadena con al menos 3 caracteres si se proporciona.
   */
  nombre: yup.string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres.')
    .notRequired(),

  /**
   * Validación opcional del correo electrónico.
   * Debe ser una cadena válida en formato de correo electrónico si se proporciona.
   */
  email: yup.string()
    .trim()
    .lowercase()
    .email('Debe ser un correo electrónico válido.')
    .notRequired(),

  /**
   * Validación opcional de la contraseña.
   * Debe tener al menos 8 caracteres, incluir una letra mayúscula y un número si se proporciona.
   */
  password: yup.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .matches(/(?=.*[A-Z])/, 'La contraseña debe contener al menos una letra mayúscula.')
    .matches(/(?=.*\d)/, 'La contraseña debe contener al menos un número.')
    .notRequired(),

  /**
   * Validación opcional del rol del usuario.
   * Si se proporciona, debe ser "administrador" o "usuario".
   */
  rol: yup.string()
    .oneOf(['administrador', 'usuario'], 'El rol debe ser administrador o usuario.')
    .notRequired(),

  /**
   * Validación opcional de la URL de la foto de perfil.
   * Puede ser nula o una URL válida si se proporciona.
   */
  fotoPerfil: yup.string()
    .url('La URL de la foto de perfil no es válida.')
    .nullable()
    .notRequired()
});

/**
 * Middleware para validar los datos de actualización de usuarios.
 * 
 * @async
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @throws {Error} Si la validación falla, se pasa el error al siguiente middleware.
 */
export const updateUsuarioValidations = async (req, res, next) => {
  try {
    // Validamos los datos recibidos según el esquema definido
    const data = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });

    // Guardamos los datos validados en req.curatedBody
    req.curatedBody = data;
    next();
  } catch (e) {
    // Pasamos los errores de validación al siguiente middleware
    next(e);
  }
};

