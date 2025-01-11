// Modelo Tarea
import { Schema } from 'mongoose';

/**
 * Esquema de Tarea para la base de datos.
 * Representa las tareas asociadas a un tablero en el sistema.
 * 
 * Campos:
 * - nombre: Nombre descriptivo de la tarea.
 * - descripcion: Detalle adicional sobre la tarea.
 * - prioridad: Nivel de importancia de la tarea ('baja', 'media', 'alta').
 * - estado: Estado actual de la tarea ('pendiente', 'en proceso', 'en revisión', 'completada').
 * - fechaLimite: Fecha límite para completar la tarea.
 * - asignadoA: Usuario al que se le ha asignado la tarea.
 * - comentarios: Lista de comentarios asociados a la tarea.
 * - tablero: Tablero al que pertenece la tarea.
 * 
 * Timestamps:
 * - created_at: Fecha de creación del registro.
 * - updated_at: Fecha de última actualización del registro.
 */
export const tareaSchema = new Schema({
  /** Nombre descriptivo de la tarea */
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  /** Detalle adicional sobre la tarea */
  descripcion: {
    type: String,
    trim: true
  },
  /** Nivel de importancia de la tarea */
  prioridad: {
    type: String,
    enum: ['baja', 'media', 'alta'],
    default: 'media'
  },
  /** Estado actual de la tarea */
  estado: {
    type: String,
    enum: ['pendiente', 'en_proceso', 'en_revision', 'completada'],
    default: 'pendiente'
  },
  /** Fecha límite para completar la tarea */
  fechaLimite: {
    type: Date,
    default: null
  },
  /** Usuario al que se le ha asignado la tarea */
  asignadoA: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null
  },
  /** Lista de comentarios asociados a la tarea */
  comentarios: [
    {
      /** Usuario que realizó el comentario */
      usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
      },
      /** Mensaje del comentario */
      mensaje: {
        type: String,
        required: true
      },
      /** Fecha en que se realizó el comentario */
      fecha: {
        type: Date,
        default: Date.now
      }
    }
  ],
  /** Tablero al que pertenece la tarea */
  tablero: {
    type: Schema.Types.ObjectId,
    ref: 'Tablero',
    required: true
  },
},
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);
