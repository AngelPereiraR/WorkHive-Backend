import * as yup from 'yup'
import { es } from 'yup-locales'

yup.setLocale(es)
//estructura de la información que vamos a validar
const schema = yup.object().shape({
  nombre: yup.string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres.')
    .notRequired(),

  email: yup.string()
    .trim()
    .lowercase()
    .email('Debe ser un correo electrónico válido.')
    .notRequired(),

  password: yup.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .matches(/(?=.*[A-Z])/, 'La contraseña debe contener al menos una letra mayúscula.')
    .matches(/(?=.*\d)/, 'La contraseña debe contener al menos un número.')
    .notRequired(),

  rol: yup.string()
    .oneOf(['administrador', 'usuario'], 'El rol debe ser administrador o usuario.')
    .notRequired(),

  fotoPerfil: yup.string()
    .url('La URL de la foto de perfil no es válida.')
    .nullable()
    .notRequired()
});

export const updateUsuarioValidations = async (req, res, next) => {
  try {
    const data = await schema.validate(req.body, { abortEarly: false, stripUnknown: true })

    req.curatedBody = data
    next()
  } catch (e) {
    next(e)
  }
}
