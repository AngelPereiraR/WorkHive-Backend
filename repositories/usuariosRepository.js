import { sha512 } from 'js-sha512';
import { UsuarioModel } from './models/usuarioModel.js';

/**
 * Crea un nuevo usuario en la base de datos.
 * 
 * @async
 * @function create
 * @param {Object} data - Datos del usuario a crear.
 * @param {string} data.password - Contraseña del usuario que será encriptada.
 * @returns {Promise<Object>} El usuario creado.
 */
async function create(data) {
  data.password = sha512(data.password);

  return await new UsuarioModel(data).save();
}

/**
 * Lista todos los usuarios ordenados por fecha de creación de forma descendente.
 * 
 * @async
 * @function list
 * @returns {Promise<Array<Object>>} Lista de usuarios.
 */
async function list() {
  return await UsuarioModel.find().sort({ createdAt: 'DESC' }).exec();
}

/**
 * Obtiene un usuario por su ID.
 * 
 * @async
 * @function getOne
 * @param {string} id - ID del usuario.
 * @param {boolean} [onlyEnabled=true] - Indica si solo se deben buscar usuarios habilitados.
 * @returns {Promise<Object|null>} El usuario encontrado o null si no existe.
 */
async function getOne(id, onlyEnabled = true) {
  const params = { _id: id };
  if (onlyEnabled) params.enabled = true;
  return await UsuarioModel.findOne(params).exec();
}

/**
 * Elimina un usuario por su ID.
 * 
 * @async
 * @function remove
 * @param {string} id - ID del usuario a eliminar.
 * @returns {Promise<Object|null>} El usuario eliminado o null si no existe.
 */
async function remove(id) {
  return await UsuarioModel.findOneAndDelete({ _id: id }).exec();
}

/**
 * Actualiza un usuario por su ID con los datos proporcionados.
 * 
 * @async
 * @function update
 * @param {string} id - ID del usuario a actualizar.
 * @param {Object} data - Datos a actualizar.
 * @returns {Promise<Object|null>} El usuario actualizado o null si no existe.
 */
async function update(id, data) {
  return await UsuarioModel.findOneAndUpdate({ _id: id }, data, { new: true, runValidators: true }).exec();
}

/**
 * Obtiene un usuario por su correo electrónico y contraseña.
 * 
 * @async
 * @function getOneByEmailAndPassword
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<Object|null>} El usuario encontrado o null si no existe.
 */
async function getOneByEmailAndPassword(email, password) {
  return await UsuarioModel.findOne({ email, password, enabled: true }).exec();
}

/**
 * Repositorio de usuarios que contiene las operaciones principales sobre la base de datos.
 * 
 * @namespace usuariosRepository
 * @property {Function} list - Lista todos los usuarios.
 * @property {Function} create - Crea un nuevo usuario.
 * @property {Function} getOne - Obtiene un usuario por su ID.
 * @property {Function} remove - Elimina un usuario por su ID.
 * @property {Function} update - Actualiza un usuario por su ID.
 * @property {Function} getOneByEmailAndPassword - Obtiene un usuario por email y contraseña.
 */
export const usuariosRepository = {
  list,
  create,
  getOne,
  remove,
  update,
  getOneByEmailAndPassword
};

