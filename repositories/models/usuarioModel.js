import { model } from "mongoose"
import { usuarioSchema } from "./schemas/usuarioSchema.js"

export const UsuarioModel = model('usuarios', usuarioSchema)
