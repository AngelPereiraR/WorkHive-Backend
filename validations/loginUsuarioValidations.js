import * as yup from 'yup';
import { es } from 'yup-locales';

yup.setLocale(es);

/**
 * Esquema de validación para el inicio de sesión de usuarios.
 * 
 * @constant {yup.ObjectSchema} schema
 */
const schema = yup.object({
  /**
   * Validación del correo electrónico.
   * Debe ser un string requerido en formato de correo electrónico válido.
   */
  email: yup.string().required().email().label('Email'),

  /**
   * Validación de la contraseña.
   * Debe ser un string requerido con al menos 6 caracteres.
   */
  password: yup.string().required().min(6).label('Contraseña')
});

/**
 * Middleware para validar los datos del inicio de sesión de usuarios.
 * 
 * @async
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @throws {Error} Si la validación falla, se pasa el error al siguiente middleware.
 */
export const loginUsuarioValidations = async (req, res, next) => {
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

