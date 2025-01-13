import { sha512 } from 'js-sha512';
import { UsuarioModel } from './models/usuarioModel.js';
import { uploadImage } from '../utils/uploadImageToCloudinary.js';

/**
 * Crea un nuevo usuario en la base de datos y en Firebase Authentication.
 * Encripta la contraseña del usuario antes de guardarla y opcionalmente sube la imagen de perfil.
 * 
 * @async
 * @function create
 * @param {Object} data - Datos del usuario a crear.
 * @param {string} data.password - Contraseña del usuario que será encriptada.
 * @param {Object} [data.fotoPerfil] - Ruta de la imagen de perfil para subir (opcional).
 * @returns {Promise<Object>} El usuario creado.
 */
async function create(data) {
  data.password = sha512(data.password);

  if (data.fotoPerfil) {
    data.fotoPerfil = await uploadImage(data.fotoPerfil);
  }
  return await new UsuarioModel(data).save();
}

/**
 * Lista todos los usuarios ordenados por fecha de creación de forma descendente.
 * 
 * @async
 * @function list
 * @returns {Promise<Array<Object>>} Lista de usuarios ordenada.
 */
async function list() {
  return await UsuarioModel.find().sort({ createdAt: 'desc' }).exec();
}

/**
 * Obtiene un usuario por su ID.
 * 
 * @async
 * @function getOne
 * @param {string} id - ID único del usuario.
 * @returns {Promise<Object|null>} El usuario encontrado o null si no existe.
 */
async function getOne(id) {
  const params = { _id: id };
  return await UsuarioModel.findOne(params).exec();
}

/**
 * Elimina un usuario por su ID.
 * 
 * @async
 * @function remove
 * @param {string} id - ID único del usuario a eliminar.
 * @returns {Promise<Object|null>} El usuario eliminado o null si no existe.
 */
async function remove(id) {
  return await UsuarioModel.findOneAndDelete({ _id: id }).exec();
}

/**
 * Actualiza un usuario por su ID con los datos proporcionados en la base de datos y en Firebase Authentication.
 * Si se incluye una nueva contraseña, esta será encriptada.
 * Si se incluye una nueva imagen de perfil, será subida antes de actualizar.
 * 
 * @async
 * @function update
 * @param {string} id - ID único del usuario a actualizar.
 * @param {Object} data - Datos del usuario a actualizar.
 * @param {string} [data.password] - Nueva contraseña del usuario (opcional).
 * @param {Object} [data.fotoPerfil] - Nueva imagen de perfil para subir (opcional).
 * @returns {Promise<Object|null>} El usuario actualizado o null si no existe.
 */
async function update(id, data) {
  if (data.password) {
    data.password = sha512(data.password);
  }

  if (data.fotoPerfil) {
    data.fotoPerfil = await uploadImage(data.fotoPerfil);
  }

  try {
    // Actualizar usuario en la base de datos
    const updatedUser = await UsuarioModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updatedUser) {
      return null;
    }

    return updatedUser;
  } catch (error) {
    throw error;
  }
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
  return await UsuarioModel.findOne({ email, password }).exec();
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
