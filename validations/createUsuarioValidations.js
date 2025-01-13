import * as yup from 'yup';
import { es } from 'yup-locales';

yup.setLocale(es);

/**
 * Esquema de validación para la creación de usuarios.
 * 
 * @constant {yup.ObjectSchema} schema
 */
const createUsuarioValidations = yup.object().shape({
  /**
   * Validación del nombre del usuario.
   * Debe ser una cadena, sin espacios al inicio o final, con al menos 3 caracteres.
   */
  nombre: yup.string()
    .required('El nombre es obligatorio.')
    .min(3, 'El nombre debe tener al menos 3 caracteres.'),

  /**
   * Validación del correo electrónico del usuario.
   * Debe ser una cadena válida en formato de correo electrónico.
   */
  email: yup.string()
    .lowercase()
    .required('El correo electrónico es obligatorio.')
    .email('Debe ser un correo electrónico válido.'),

  /**
   * Validación de la contraseña del usuario.
   * Debe tener al menos 8 caracteres, incluir una letra mayúscula y un número.
   */
  password: yup.string()
    .required('La contraseña es obligatoria.')
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .matches(/(?=.*[A-Z])/, 'La contraseña debe contener al menos una letra mayúscula.')
    .matches(/(?=.*\d)/, 'La contraseña debe contener al menos un número.')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/, 'La contraseña debe contener al menos un caracter especial.'),

  /**
   * Validación del rol del usuario.
   * Debe ser "administrador" o "usuario".
   */
  rol: yup.string()
    .oneOf(['administrador', 'usuario'], 'El rol debe ser administrador o usuario.')
    .default('usuario'),

  /**
   * Validación de la URL de la foto de perfil.
   * Puede ser nula o una URL válida.
   */
  fotoPerfil: yup.string('La URL de la foto de perfil no es válida.')
    .nullable()
});



export { createUsuarioValidations }

