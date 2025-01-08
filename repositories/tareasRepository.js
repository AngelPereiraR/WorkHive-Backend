import {TareaModel} from "./models/tareaModel.js";

async function create(data) {
    return await new TareaModel(data).save();
}

async function list() {
    return await TareaModel.find().sort({nombre: "DESC"}).exec();
}

async function listByPriority(priority) {
    return await TareaModel.find({ _prioridad: priority }).exec();
}

async function listByState(state) {
    return await TareaModel.find( { _estado: state }).exec()
}

async function listByLimitDate(date) {
    return await TareaModel.find({ _fechaLimite: date }).exec();
}

async function listByUserAsigned(id) {
    return await TareaModel.find( { _asignadoA: id} ).exec();
}

async function getOne(id){
    const params = { _id: id };
    return await TareaModel.findOne(params).exec();
}

async function remove(id) {
    return await TareaModel.findOneAndDelete({ _id: id }).exec();
}

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