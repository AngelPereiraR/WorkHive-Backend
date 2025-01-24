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
  return await TableroModel.find().sort({ createdAt: 'desc' }).exec();
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
 * @returns {Promise<Object|null>} El tablero eliminado o null si no existe.
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
 * Obtiene los colaboradores de todos los tableros en los que un usuario es colaborador.
 * 
 * @async
 * @function getByCollaborator
 * @param {string} userId - Id del usuario colaborador.
 * @returns {Promise<Array<Object>>} Lista de tableros del colaborador.
 */
async function getByCollaborator(userId) {
  return await TableroModel.find({ colaboradores: userId }).exec();
}


/**
 * Agrega un colaborador a un tablero específico.
 * 
 * @async
 * @function addCollaborator
 * @param {string} tableroId - El ID del tablero al que se añadirá el colaborador.
 * @param {string} userId - El ID del usuario que se añadirá como colaborador.
 * @returns {Promise<Object|null>} El tablero actualizado con el nuevo colaborador, o null si no se encuentra el tablero.
 */
async function addCollaborator(tableroId, userId) {
  return await TableroModel.findOneAndUpdate(
    { _id: tableroId, colaboradores: { $ne: userId } },
    { $addToSet: { colaboradores: userId } },
    { new: true, runValidators: true }
  ).exec();
}

/**
 * Elimina un colaborador de un tablero específico.
 * 
 * @async
 * @function removeCollaborator
 * @param {string} tableroId - El ID del tablero del que se eliminará el colaborador.
 * @param {string} userId - El ID del usuario que se eliminará como colaborador.
 * @returns {Promise<Object|null>} El tablero actualizado sin el colaborador eliminado, o null si no se encuentra el tablero.
 */
async function removeCollaborator(tableroId, userId) {
  return await TableroModel.findByIdAndUpdate(
    { _id: tableroId, colaboradores: { $ne: userId } },
    { $pull: { colaboradores: userId } },
    { new: true }
  ).exec();
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
  const tableros = await TableroModel.find({ administrador: administratorId }).exec();
  return tableros.length > 0 ? tableros : [];
}


/**
 * Determina si un proyecto es actual basado en la fecha actual y su fecha de fin.
 * 
 * @function isProyectoActual
 * @param {Date} fechaActual - Fecha actual.
 * @param {Date} fechaFin - Fecha de fin del proyecto.
 * @returns {boolean} True si es un proyecto actual, false si está finalizado.
 */
function isProyectoActual(fechaActual, fechaFin) {
  return fechaFin > fechaActual;
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
 * @property {Function} addCollaborator -Añade un colaborador.
 * @property {Function} removeCollaborator -Elimina un colaborador.
 * @property {Function} getByAdministrator -Lista los tableros del usuario administrador.
 * @property {Function} isProyectoActual -True si es actual o false si ha finalizado.
*/
export const tablerosRepository = {
  list,
  create,
  getOne,
  remove,
  update,
  getByCollaborator,
  addCollaborator,
  removeCollaborator,
  getByAdministrator,
  isProyectoActual
};