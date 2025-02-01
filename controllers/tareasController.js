import express from "express";
import { createTareaValidations } from '../validations/createTareaValidations.js';
import { tareasRepository } from "../repositories/tareasRepository.js";
import { sessionChecker } from "../security/sessionChecker.js";
import { validateObjectIdFormat } from "../validations/validateObjectIdFormat.js";
import { updateTareaValidations } from "../validations/updateTareaValidations.js";
import { validatePrioridadTareaFormat } from "../validations/validatePrioridadTareaFormat.js";
import { validateEstadoTareaFormat } from "../validations/validateEstadoTareaFormat.js";
import { validateFechaTareaFormat } from "../validations/validateFechaTareaFormat.js";
import { validateAsignadoTareaFormat } from "../validations/validateAsignadoTareaFormat.js";

/**
 * Controlador para gestionar rutas relacionadas con tareas
 * @module tareasController
 * @requires express
 * @requires ../validations/createTareaValidations.js
 * @requires ../repositories/tareasRepository.js
 * @requires ../security/sessionChecker.js
 * @requires ../validations/validateObjectIdFormat.js
 * @requires ../validations/updateTareaValidations.js
 * @requires ../validations/validatePrioridadTareaFormat.js
 * @requires ../validations/validateEstadoTareaFormat.js
 * @requires ../validations/validateFechaTareaFormat.js
 * @requires ../validations/validateAsignadoTareaFormat.js
 */
const tareasController = express.Router();

/**
 * Ruta para crear y listar tareas
 *
 * @name /tareas
 * @function
 */
tareasController.route("/tareas")

    /**
     * Crea una tarea nueva
     *
     * @async
     * @function
     * @param {Object} req - Objeto de solicitud.
     * @param {Object} res - Objeto de respuesta.
     * @param {Object} req.body - Cuerpo de la solicitud.
     * @param {string} req.body.titulo - Título de la tarea.
     * @param {string} req.body.descripcion - Descripción de la tarea.
     * @param {string} req.body.prioridad - Prioridad de la tarea (baja, media, alta).
     * @param {string} req.body.estado - Estado de la tarea (pendiente, en_progreso, completada).
     * @param {string} req.body.fechaLimite - Fecha límite de la tarea en formato ISO 8601.
     * @param {string} req.body.asignado - ID del usuario asignado a la tarea.
     * @param {string} req.body.tablero - ID del tablero al que pertenece la tarea.
     * @returns {Object} 201 - Tarea creada.
     * @returns {Object} 400 - Error de validación.
     * @returns {Object} 401 - No autorizado.
     * @example
     * // Ejemplo de respuesta exitosa:
     * {
     *   "_id": "60c72b2f9b1d8e1a4c8b4567",
     *   "titulo": "Tarea de ejemplo",
     *   "descripcion": "Descripción de la tarea",
     *   "prioridad": "media",
     *   "estado": "pendiente",
     *   "fechaLimite": "2023-10-01T00:00:00.000Z",
     *   "asignado": "60c72b2f9b1d8e1a4c8b4567",
     *   "tablero": "60c72b2f9b1d8e1a4c8b4567"
     * }
     */
    .post(sessionChecker(['administrador', 'usuario'], true), createTareaValidations, async (req, res) => {
        const createItem = await tareasRepository.create(req.curatedBody);

        res.status(201).json(createItem);
    })

    /**
     * Lista todas las tareas
     *
     * @async
     * @function
     * @param {Object} req - Objeto de solicitud.
     * @param {Object} res - Objeto de respuesta.
     * @returns {Object} 200 - Lista de tareas.
     * @returns {Object} 401 - No autorizado.
     * @example
     * // Ejemplo de respuesta exitosa:
     * [
     *   {
     *     "_id": "60c72b2f9b1d8e1a4c8b4567",
     *     "titulo": "Tarea de ejemplo",
     *     "descripcion": "Descripción de la tarea",
     *     "prioridad": "media",
     *     "estado": "pendiente",
     *     "fechaLimite": "2023-10-01T00:00:00.000Z",
     *     "asignado": "60c72b2f9b1d8e1a4c8b4567",
     *     "tablero": "60c72b2f9b1d8e1a4c8b4567"
     *   }
     * ]
     */
    .get(sessionChecker(['administrador'], true), async (req, res) => {
        const itemList = await tareasRepository.list();

        res.json(itemList);
    });

/**
 * Ruta para consultar las tareas de un tablero filtrando por su prioridad
 *
 * @name /tareas/prioridad
 * @function
 */
tareasController.route("/tareas/prioridad")

    /**
     * Listado de las tareas de un tablero filtradas por su prioridad
     *
     * @async
     * @function
     * @param {Object} req - Objeto de solicitud.
     * @param {Object} res - Objeto de respuesta.
     * @param {Object} req.body - Cuerpo de la solicitud.
     * @param {string} req.body.tablero - ID del tablero.
     * @param {string} req.body.prioridad - Prioridad de la tarea (baja, media, alta).
     * @returns {Object} 200 - Lista de tareas filtradas por prioridad.
     * @returns {Object} 400 - Error de validación.
     * @returns {Object} 401 - No autorizado.
     * @example
     * // Ejemplo de respuesta exitosa:
     * [
     *   {
     *     "_id": "60c72b2f9b1d8e1a4c8b4567",
     *     "titulo": "Tarea de ejemplo",
     *     "descripcion": "Descripción de la tarea",
     *     "prioridad": "media",
     *     "estado": "pendiente",
     *     "fechaLimite": "2023-10-01T00:00:00.000Z",
     *     "asignado": "60c72b2f9b1d8e1a4c8b4567",
     *     "tablero": "60c72b2f9b1d8e1a4c8b4567"
     *   }
     * ]
     */
    .post(sessionChecker(['administrador', 'usuario'], true), validatePrioridadTareaFormat(), async (req, res) => {
        const { tablero, prioridad } = req.body;
        const itemList = await tareasRepository.listByPriority(tablero, prioridad);

        res.json(itemList);
    });

/**
 * Ruta para consultar las tareas de un tablero filtrando por su estado
 *
 * @name /tareas/estado
 * @function
 */
tareasController.route("/tareas/estado")

    /**
     * Listado de las tareas de un tablero filtradas por su estado
     *
     * @async
     * @function
     * @param {Object} req - Objeto de solicitud.
     * @param {Object} res - Objeto de respuesta.
     * @param {Object} req.body - Cuerpo de la solicitud.
     * @param {string} req.body.tablero - ID del tablero.
     * @param {string} req.body.estado - Estado de la tarea (pendiente, en_progreso, completada).
     * @returns {Object} 200 - Lista de tareas filtradas por estado.
     * @returns {Object} 400 - Error de validación.
     * @returns {Object} 401 - No autorizado.
     * @example
     * // Ejemplo de respuesta exitosa:
     * [
     *   {
     *     "_id": "60c72b2f9b1d8e1a4c8b4567",
     *     "titulo": "Tarea de ejemplo",
     *     "descripcion": "Descripción de la tarea",
     *     "prioridad": "media",
     *     "estado": "pendiente",
     *     "fechaLimite": "2023-10-01T00:00:00.000Z",
     *     "asignado": "60c72b2f9b1d8e1a4c8b4567",
     *     "tablero": "60c72b2f9b1d8e1a4c8b4567"
     *   }
     * ]
     */
    .post(sessionChecker(['administrador', 'usuario'], true), validateEstadoTareaFormat(), async (req, res) => {
        const { tablero, estado } = req.body;
        const itemList = await tareasRepository.listByState(tablero, estado);

        res.json(itemList);
    });

/**
 * Ruta para consultar las tareas de un tablero filtrando por su usuario asignado
 *
 * @name /tareas/asignado
 * @function
 */
tareasController.route("/tareas/asignado")

    /**
     * Listado de las tareas de un tablero filtradas por su usuario asignado
     *
     * @async
     * @function
     * @param {Object} req - Objeto de solicitud.
     * @param {Object} res - Objeto de respuesta.
     * @param {Object} req.body - Cuerpo de la solicitud.
     * @param {string} req.body.tablero - ID del tablero.
     * @param {string} req.body.asignado - ID del usuario asignado.
     * @returns {Object} 200 - Lista de tareas filtradas por usuario asignado.
     * @returns {Object} 400 - Error de validación.
     * @returns {Object} 401 - No autorizado.
     * @example
     * // Ejemplo de respuesta exitosa:
     * [
     *   {
     *     "_id": "60c72b2f9b1d8e1a4c8b4567",
     *     "titulo": "Tarea de ejemplo",
     *     "descripcion": "Descripción de la tarea",
     *     "prioridad": "media",
     *     "estado": "pendiente",
     *     "fechaLimite": "2023-10-01T00:00:00.000Z",
     *     "asignado": "60c72b2f9b1d8e1a4c8b4567",
     *     "tablero": "60c72b2f9b1d8e1a4c8b4567"
     *   }
     * ]
     */
    .post(sessionChecker(['administrador', 'usuario'], true), validateAsignadoTareaFormat(), async (req, res) => {
        const { tablero, asignado } = req.body;
        const itemList = await tareasRepository.listByUserAsigned(tablero, asignado);

        res.json(itemList);
    });

/**
 * Ruta para consultar las tareas de un tablero filtrando por su fecha límite
 *
 * @name /tareas/fechaLimite
 * @function
 */
tareasController.route("/tareas/fechaLimite")

    /**
     * Listado de las tareas de un tablero filtradas por su fecha límite
     *
     * @async
     * @function
     * @param {Object} req - Objeto de solicitud.
     * @param {Object} res - Objeto de respuesta.
     * @param {Object} req.body - Cuerpo de la solicitud.
     * @param {string} req.body.tablero - ID del tablero.
     * @param {string} req.body.fecha - Fecha límite en formato ISO 8601.
     * @returns {Object} 200 - Lista de tareas filtradas por fecha límite.
     * @returns {Object} 400 - Error de validación.
     * @returns {Object} 401 - No autorizado.
     * @example
     * // Ejemplo de respuesta exitosa:
     * [
     *   {
     *     "_id": "60c72b2f9b1d8e1a4c8b4567",
     *     "titulo": "Tarea de ejemplo",
     *     "descripcion": "Descripción de la tarea",
     *     "prioridad": "media",
     *     "estado": "pendiente",
     *     "fechaLimite": "2023-10-01T00:00:00.000Z",
     *     "asignado": "60c72b2f9b1d8e1a4c8b4567",
     *     "tablero": "60c72b2f9b1d8e1a4c8b4567"
     *   }
     * ]
     */
    .post(sessionChecker(['administrador', 'usuario'], true), validateFechaTareaFormat(), async (req, res) => {
        const { tablero, fecha } = req.body;
        const itemList = await tareasRepository.listByLimitDate(tablero, fecha);

        res.json(itemList);
    });

/**
 * Ruta para gestionar tareas específicas por su ID
 *
 * @name /tareas/:id
 * @function
 */
tareasController.route("/tareas/:id")

    /**
     * Obtiene una tarea por su ID
     *
     * @async
     * @function
     * @param {Object} req - Objeto de solicitud.
     * @param {Object} res - Objeto de respuesta.
     * @param {string} req.params.id - ID de la tarea.
     * @returns {Object} 200 - Tarea encontrada.
     * @returns {Object} 404 - Tarea no encontrada.
     * @returns {Object} 401 - No autorizado.
     * @example
     * // Ejemplo de respuesta exitosa:
     * {
     *   "_id": "60c72b2f9b1d8e1a4c8b4567",
     *   "titulo": "Tarea de ejemplo",
     *   "descripcion": "Descripción de la tarea",
     *   "prioridad": "media",
     *   "estado": "pendiente",
     *   "fechaLimite": "2023-10-01T00:00:00.000Z",
     *   "asignado": "60c72b2f9b1d8e1a4c8b4567",
     *   "tablero": "60c72b2f9b1d8e1a4c8b4567"
     * }
     */
    .get(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), async (req, res) => {
        const itemId = req.params.id;

        const item = await tareasRepository.getOne(itemId);
        if (!item) {
            return res.status(404).json({ message: `Item con id ${itemId} no encontrado` });
        }

        const response = item.toJSON();
        res.json(response);
    })

    /**
     * @description Actualiza una tarea por su ID.
     * @async
     * @function
     * @param {Object} req - El objeto de solicitud de Express.
     * @param {Object} res - El objeto de respuesta de Express.
     * @param {string} req.params.id - El ID de la tarea a actualizar.
     * @param {Object} req.body - El cuerpo de la solicitud con los datos de la tarea a actualizar.
     * @param {string} [req.body.titulo] - El nuevo título de la tarea.
     * @param {string} [req.body.descripcion] - La nueva descripción de la tarea.
     * @param {string} [req.body.prioridad] - La nueva prioridad de la tarea (baja, media, alta).
     * @param {string} [req.body.estado] - El nuevo estado de la tarea (pendiente, en_progreso, completada).
     * @param {string} [req.body.fechaLimite] - La nueva fecha límite de la tarea en formato ISO 8601.
     * @param {string} [req.body.asignado] - El nuevo ID del usuario asignado a la tarea.
     * @param {string} [req.body.tablero] - El nuevo ID del tablero al que pertenece la tarea.
     * @returns {Promise<void>}
     * @throws {Error} Si ocurre un error al actualizar la tarea.
     * @example
     * // Ejemplo de respuesta exitosa (200 OK):
     * {
     *   "_id": "60c72b2f9b1d8e1a4c8b4567",
     *   "titulo": "Tarea de ejemplo actualizada",
     *   "descripcion": "Descripción de la tarea actualizada",
     *   "prioridad": "alta",
     *   "estado": "en_progreso",
     *   "fechaLimite": "2023-10-08T00:00:00.000Z",
     *   "asignado": "60c72b2f9b1d8e1a4c8b4568",
     *   "tablero": "60c72b2f9b1d8e1a4c8b4569"
     * }
     * @example
     * // Ejemplo de respuesta de error (404 Not Found):
     * {
     *   "message": "Item con id 60c72b2f9b1d8e1a4c8b4567 no encontrado"
     * }
     */
    .put(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), updateTareaValidations, async (req, res) => {
        const itemId = req.params.id;

        const item = await tareasRepository.update(itemId, req.curatedBody);
        if (!item) {
            return res.status(404).json({ message: `Item con id ${itemId} no encontrado` });
        }

        const response = item.toJSON();
        res.json(response);
    })

    /**
     * @description Elimina una tarea por su ID.
     * @async
     * @function
     * @param {Object} req - El objeto de solicitud de Express.
     * @param {Object} res - El objeto de respuesta de Express.
     * @param {string} req.params.id - El ID de la tarea a eliminar.
     * @returns {Promise<void>}
     * @throws {Error} Si ocurre un error al eliminar la tarea.
     * @example
     * // Ejemplo de respuesta exitosa (204 No Content):
     * // No se devuelve contenido en el cuerpo de la respuesta.
     * @example
     * // Ejemplo de respuesta de error (404 Not Found):
     * {
     *   "message": "Item con id 60c72b2f9b1d8e1a4c8b4567 no encontrado"
     * }
     */
    .delete(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), async (req, res) => {
        const itemId = req.params.id;
        const item = await tareasRepository.remove(itemId);

        if (!item) {
            return res.status(404).json({ message: `Item con id ${itemId} no encontrado` });
        }

        res.status(204).json();
    });


export { tareasController };