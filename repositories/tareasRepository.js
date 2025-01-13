import { TareaModel } from "./models/tareaModel.js";

/**
 * Crea una nueva tarea en la base de datos
 *
 * @async
 * @function create
 * @param {Object} data - Datos de la tarea a crear
 * @returns {Promise<Object>} La tarea creada
 */
async function create(data) {
    return await new TareaModel(data).save();
}

/**
 * Lista todas las tereas ordenadas por nombre de forma descendente
 *
 * @async
 * @function list
 * @return {Promise<Array<Object>>} Lista de tareas ordenada.
 */
async function list() {
    return await TareaModel.find().sort({ nombre: "desc" }).exec();
}

/**
 * Lista las tareas de un tablero filtradas por el valor de la prioridad
 *
 * @async
 * @function listByPriority
 * @param {string} tablero - Identificador del tablero
 * @param {string} priority - Prioridad para filtrar
 * @return {Promise<Array<Object>>} Lista de tareas de un tablero con una prioridad determinada
 */
async function listByPriority(tablero, priority) {
    return await TareaModel.find({ tablero: tablero, prioridad: priority }).exec();
}

/**
 * Lista las tareas de un tablero filtradas por el valor del estado
 *
 * @async
 * @function listByState
 * @param {string} tablero - Identificador del tablero
 * @param {string} state - Estado para filtrar
 * @return {Promise<Array<Object>>} Lista de tareas de un tablero con un estado determinado
 */
async function listByState(tablero, state) {
    return await TareaModel.find({ tablero: tablero, estado: state }).exec()
}

/**
 * Lista las tareas de un tablero filtradas por una fecha límite
 *
 * @async
 * @function listByState
 * @param {string} tablero - Identificador del tablero
 * @param {date} date - Fecha límite para filtrar
 * @return {Promise<Array<Object>>} Lista de tareas de un tablero con una fecha límite
 */
async function listByLimitDate(tablero, date) {
    return await TareaModel.find({ tablero: tablero, fechaLimite: date }).exec();
}

/**
 * Lista las tareas de un tablero filtradas por el usuario asignado
 *
 * @async
 * @function listByUserAsigned
 * @param {string} tablero - Identificador del tablero
 * @param {string} id - Usuario asignado para filtrar
 * @return {Promise<Array<Object>>} Lista de tareas de un tablero con un usuario asignado
 */
async function listByUserAsigned(tablero, id) {
    return await TareaModel.find({ tablero: tablero, asignadoA: id }).exec();
}

/**
 * Obtiene una tarea por su ID.
 *
 * @async
 * @function getOne
 * @param {string} id - ID único de la tarea.
 * @returns {Promise<Object|null>} La tarea encontrada o null si no existe.
 */
async function getOne(id) {
    const params = { _id: id };
    return await TareaModel.findOne(params).exec();
}

/**
 * Elimina una tarea por su ID.
 *
 * @async
 * @function remove
 * @param {string} id - ID único de la tarea a eliminar.
 * @returns {Promise<Object|null>} La tarea eliminada o null si no existe.
 */
async function remove(id) {
    return await TareaModel.findOneAndDelete({ _id: id }).exec();
}

/**
 * Actualiza la tarea por su ID con los datos proporcionados.
 *
 * @async
 * @function update
 * @param {string} id - ID único de la tarea a actualizar.
 * @param {Object} data - Datos de la tarea a actualizar.
 * @returns {Promise<Object|null>} La tarea actualizada o null si no existe.
 */
async function update(id, data) {
    return await TareaModel.findOneAndUpdate({ _id: id }, data, { new: true, runValidators: true }).exec();
}

/**
 * Repositorio de tareas que contiene las operaciones principales sobre la base de datos
 *
 * @namespace tareasRepository
 * @property {Function} create - Crea una tarea nueva
 * @property {Function} list - Lista todas las tareas
 * @property {Function} listByPriority - Lista las tareas de un tablero filtrando por su prioridad
 * @property {Function} listByState - Lista las tareas de un tablero filtrando por su estado
 * @property {Function} listByLimitDate - Lista las tareas de un tablero filtrando por su fecha límite
 * @property {Function} listByUserAsigned - Lista las tareas de un tablero filtrando por su usuario asignado
 * @property {Function} getOne - Obtiene una tarea por su ID
 * @property {Function} remove - Elimina una tarea por su ID
 * @property {Function} update - Actualiza una tarea por su ID
 */
export const tareasRepository = {
    create,
    list,
    listByPriority,
    listByState,
    listByLimitDate,
    listByUserAsigned,
    getOne,
    remove,
    update,
}