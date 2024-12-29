import * as yup from 'yup'
import { es } from 'yup-locales'

yup.setLocale(es)
//estructura de la información que vamos a validar
const schema = yup.object({
  email: yup.string().required().email().label('Email'),
  password: yup.string().required().min(6).label('Contraseña')
})

export const loginUsuarioValidations = async (req, res, next) => {
  try {
    const data = await schema.validate(req.body, { abortEarly: false, stripUnknown: true })
    req.curatedBody = data
    next()
  } catch (e) {
    next(e)
  }
}
