import { model } from "mongoose";
import { tableroSchema } from "./schemas/tableroSchema.js";

/**
 * Modelo de tablero para la base de datos MongoDB.
 * 
 * @module TableroModel
 * @requires mongoose
 * @requires ./schemas/tableroSchema
 */

/**
 * Modelo de Tablero.
 * 
 * Representa la colección "tablero" en la base de datos.
 * 
 * @constant {Model} TableroModel
 */
export const TableroModel = model('tableros', tableroSchema);

