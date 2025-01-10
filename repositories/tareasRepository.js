import {TareaModel} from "./models/tareaModel.js";

async function create(data) {
    return await new TareaModel(data).save();
}

async function list() {
    return await TareaModel.find().sort({ nombre: "DESC" }).exec();
}

async function listByPriority(tablero, priority) {
    return await TareaModel.find({ tablero: tablero, prioridad: priority }).exec();
}

async function listByState(tablero, state) {
    return await TareaModel.find( { tablero: tablero, estado: state }).exec()
}

async function listByLimitDate(tablero, date) {
    return await TareaModel.find({ tablero: tablero, fechaLimite: date }).exec();
}

async function listByUserAsigned(tablero, id) {
    return await TareaModel.find( { tablero: tablero, asignadoA: id} ).exec();
}

/**
 * Obtiene una tarea por su ID.
 *
 * @async
 * @function getOne
 * @param {string} id - ID único de la tarea.
 * @returns {Promise<Object|null>} La tarea encontrada o null si no existe.
 */
async function getOne(id){
    const params = { _id: id };
    return await TareaModel.findOne(params).exec();
}

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
    return await TareaModel.findOneAndUpdate({ _id: id}, data, { new: true, runValidators: true }).exec();
}

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