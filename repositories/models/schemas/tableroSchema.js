// Modelo Tablero
import { Schema } from 'mongoose';

/**
 * Esquema de Tablero para la base de datos.
 * Representa un proyecto colaborativo en el sistema.
 * 
 * Campos:
 * - nombre: Nombre del tablero o proyecto.
 * - descripcion: Descripción opcional sobre el tablero.
 * - fechaInicio: Fecha de inicio del proyecto.
 * - fechaFin: Fecha de finalización del proyecto.
 * - administrador: Usuario que administra el tablero.
 * - colaboradores: Lista de usuarios que colaboran en el proyecto.
 * 
 * Timestamps:
 * - created_at: Fecha de creación del registro.
 * - updated_at: Fecha de última actualización del registro.
 */
export const tableroSchema = new Schema({
  /** Nombre del tablero o proyecto */
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  /** Descripción opcional sobre el tablero */
  descripcion: {
    type: String,
    trim: true
  },
  /** Fecha de inicio del proyecto */
  fechaInicio: {
    type: Date,
    default: null
  },
  /** Fecha de finalización del proyecto */
  fechaFin: {
    type: Date,
    default: null
  },
  /** Usuario que administra el tablero */
  administrador: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  /** Lista de usuarios que colaboran en el proyecto */
  colaboradores: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Usuario'
    }
  ],
},
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);