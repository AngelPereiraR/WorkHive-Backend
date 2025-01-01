import { model } from "mongoose";
import { usuarioSchema } from "./schemas/usuarioSchema.js";

/**
 * Modelo de usuario para la base de datos MongoDB.
 * 
 * @module UsuarioModel
 * @requires mongoose
 * @requires ./schemas/usuarioSchema
 */

/**
 * Modelo de Usuario.
 * 
 * Representa la colección "usuarios" en la base de datos.
 * 
 * @constant {Model} UsuarioModel
 */
export const UsuarioModel = model('usuarios', usuarioSchema);

