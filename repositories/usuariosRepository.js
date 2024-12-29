import { sha512 } from 'js-sha512'
import { UsuarioModel } from './models/usuarioModel.js'

async function create(data) {
  data.password = sha512(data.password)

  return await new UsuarioModel(data).save()
}

async function list() {
  return await UsuarioModel.find().sort({ createdAt: 'DESC' }).exec()
}

async function getOne(id, onlyEnabled = true) {
  const params = { _id: id }
  if (onlyEnabled) params.enabled = true
  return await UsuarioModel.findOne(params).exec()
}

async function remove(id) {
  return await UsuarioModel.findOneAndDelete({ _id: id }).exec()
}

async function update(id, data) {
  return await UsuarioModel.findOneAndUpdate({ _id: id }, data, { new: true, runValidators: true }).exec()
}

async function getOneByEmailAndPassword(email, password) {
  return await UsuarioModel.findOne({ email, password, enabled: true }).exec()
}

export const usuariosRepository = {
  list,
  create,
  getOne,
  remove,
  update,
  getOneByEmailAndPassword
}
