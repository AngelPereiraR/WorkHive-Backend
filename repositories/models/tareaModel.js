import {model} from "mongoose";
import {tareaSchema} from "./schemas/tareaSchema.js";

/**
 * Modelo de la tarea para la base de datos MongoDB.
 *
 * @module TareaModel
 * @requires mongoose
 * @requires ./schemas/tareaSchema
 */

/**
 * Modelo de Tarea.
 *
 * Representa la colección "tareas" en la base de datos.
 *
 * @constant {Model} TareaModel
 */
export const TareaModel = model('tarea', tareaSchema);