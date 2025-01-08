import { TableroModel } from './models/tableroModel.js';

/**
 * Crea un nuevo tablero en la base de datos.
 * 
 * @async
 * @function create
 * @param {Object} data - Datos del tablero a crear.
 * @returns {Promise<Object>} El tablero creado.
 */
async function create(data) {

  return await new TableroModel(data).save();
}

/**
 * Lista todos los tableros ordenados por fecha de creación de forma descendente.
 * 
 * @async
 * @function list
 * @returns {Promise<Array<Object>>} Lista de tableros.
 */
async function list() {
  return await TableroModel.find().sort({ createdAt: 'DESC' }).exec();
}

/**
 * Obtiene un tablero por su ID.
 * 
 * @async
 * @function getOne
 * @param {string} id - ID del tablero.
 * @returns {Promise<Object|null>} El tablero encontrado o null si no existe.
 */
async function getOne(id) {
  const params = { _id: id };
  return await TableroModel.findOne(params).exec();
}

/**
 * Elimina un tablero por su ID.
 * 
 * @async
 * @function remove
 * @param {string} id - ID del tablero a eliminar.
 * @returns {Promise<Object|null>} El usuario eliminado o null si no existe.
 */
async function remove(id) {
  return await TableroModel.findOneAndDelete({ _id: id }).exec();
}

/**
 * Actualiza un tablero por su ID con los datos proporcionados.
 * 
 * @async
 * @function update
 * @param {string} id - ID del tablero a actualizar.
 * @param {Object} data - Datos a actualizar.
 * @returns {Promise<Object|null>} El tablero actualizado o null si no existe.
 */
async function update(id, data) {
  return await TableroModel.findOneAndUpdate({ _id: id }, data, { new: true, runValidators: true }).exec();
}

/**
 * Obtiene un tablero por sus colaboradores.
 * 
 * @async
 * @function getByCollaborator
 * @param {string} userId - Id del usuario colaborador.
 * @returns {Promise<Array<Object>|null>} Lista de tableros donde el usuario es colaborador o null si no existe.
 */
async function getByCollaborator(userId) {
    const tableros = await TableroModel.find({ colaboradores: userId }).exec();
    return tableros.length > 0 ? tableros : null;
}

/**
 * Obtiene un tablero por su administrador.
 * 
 * @async
 * @function getByAdministrator
 * @param {string} administratorId - Id del usuario administrador.
 * @returns {Promise<Array<Object>|null>} Lista de tableros donde el usuario es administrador o null si no existe.
 */
async function getByAdministrator(administratorId) {
    const tableros = await TableroModel.find({ aministrador: administratorId }).exec();
    return tableros.length > 0 ? tableros : null;
}

/**
 * Obtiene el administrador del tablero.
 * 
 * @async
 * @function getAdministrator
 * @param {string} tableroId - Id del tablero.
 * @returns {Promise<<Object>|null>} El administrador del proyecto.
 */
async function getAdministrator(tableroId) {
    return await TableroModel.findOne(params).exec();
}

/**
 * Determina si un proyecto es actual basado en sus fechas de inicio y fin.
 * 
 * @function isProyectoActual
 * @param {Date} fechaInicio - Fecha de inicio del proyecto.
 * @param {Date} fechaFin - Fecha de fin del proyecto.
 * @returns {boolean} True si es un proyecto actual, false si está finalizado.
 */
function isProyectoActual(fechaInicio, fechaFin) {
    return fechaFin > fechaInicio;
  }
  

/**
 * Repositorio de tableros que contiene las operaciones principales sobre la base de datos.
 * 
 * @namespace tablerosRepository
 * @property {Function} list - Lista todos los tableros.
 * @property {Function} create - Crea un nuevo tablero.
 * @property {Function} getOne - Obtiene un tablero por su ID.
 * @property {Function} remove - Elimina un tablero por su ID.
 * @property {Function} update - Actualiza un tablero por su ID.
 * @property {Function} getByCollaborator -Lista los tableros del usuario colaborador.
 * @property {Function} getByAdministrator -Lista los tableros del usuario administrador.
 * @property {Function} getAdministrator -Obtiene el administrador del tablero.
 * @property {Function} isProyectoActual -True si es actual o false si ha finalizado.
*/
export const tablerosRepository = {
    list,
    create,
    getOne,
    remove,
    update,
    getByCollaborator,
    getByAdministrator,
    getAdministrator,
    isProyectoActual
  };