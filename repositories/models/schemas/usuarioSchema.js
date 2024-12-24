// Modelo Usuario
import { Schema } from 'mongoose';
import { genSalt, hash } from 'bcrypt';

/**
 * Esquema de Usuario para la base de datos.
 * Representa la información básica de los usuarios en el sistema.
 * 
 * Campos:
 * - nombre: Nombre completo del usuario.
 * - email: Dirección de correo electrónico única y validada.
 * - password: Contraseña del usuario almacenada en formato cifrado.
 * - rol: Rol del usuario, puede ser 'administrador' o 'usuario'.
 * - fotoPerfil: URL de la foto de perfil del usuario, almacenada en Cloudinary.
 * 
 * Timestamps:
 * - created_at: Fecha de creación del registro.
 * - updated_at: Fecha de última actualización del registro.
 */
export const usuarioSchema = new Schema({
  /** Nombre completo del usuario */
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  /** Dirección de correo electrónico única */
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  /** Contraseña cifrada del usuario */
  password: {
    type: String,
    required: true
  },
  /** Rol del usuario: administrador o usuario */
  rol: {
    type: String,
    enum: ['administrador', 'usuario'],
    default: 'usuario'
  },
  /** URL de la foto de perfil almacenada en Cloudinary */
  fotoPerfil: {
    type: String,
    default: null
  },
},
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

/**
 * Middleware para cifrar contraseñas antes de guardar.
 * 
 * Se ejecuta automáticamente antes de que un registro de usuario sea guardado en la base de datos.
 * Solo se aplica si el campo de contraseña ha sido modificado.
 */
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});
