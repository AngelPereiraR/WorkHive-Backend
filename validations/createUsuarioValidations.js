import * as yup from 'yup'
import { es } from 'yup-locales'

yup.setLocale(es)
//estructura de la información que vamos a validar
const schema = yup.object().shape({
  nombre: yup.string()
    .trim()
    .required('El nombre es obligatorio.')
    .min(3, 'El nombre debe tener al menos 3 caracteres.'),

  email: yup.string()
    .trim()
    .lowercase()
    .required('El correo electrónico es obligatorio.')
    .email('Debe ser un correo electrónico válido.'),

  password: yup.string()
    .required('La contraseña es obligatoria.')
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .matches(/(?=.*[A-Z])/, 'La contraseña debe contener al menos una letra mayúscula.')
    .matches(/(?=.*\d)/, 'La contraseña debe contener al menos un número.'),

  rol: yup.string()
    .oneOf(['administrador', 'usuario'], 'El rol debe ser administrador o usuario.')
    .default('usuario'),

  fotoPerfil: yup.string()
    .url('La URL de la foto de perfil no es válida.')
    .nullable()
});

export const createUsuarioValidations = async (req, res, next) => {
  try {
    const data = await schema.validate(req.body, { abortEarly: false, stripUnknown: true })
    req.curatedBody = data
    next()
  } catch (e) {
    next(e)
  }
}
