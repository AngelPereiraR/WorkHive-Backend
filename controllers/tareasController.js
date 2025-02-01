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
 * Controlador para gestionar tutas relacionadas con tareas
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
     */
    .get(sessionChecker(['administrador'], true), async (req, res) => {
        const itemList = await tareasRepository.list();

        res.json(itemList);
    })



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
     * @param {Object} res - Objeto de respuesta
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
     * @param {Object} res - Objeto de respuesta
     */
    .post(sessionChecker(['administrador', 'usuario'], true), validateEstadoTareaFormat(), async (req, res) => {
        const { tablero, estado } = req.body;
        const itemList = await tareasRepository.listByState(tablero, estado);

        res.json(itemList);
    })

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
     * @param {Object} res - Objeto de respuesta
     */
    .post(sessionChecker(['administrador', 'usuario'], true), validateAsignadoTareaFormat(), async (req, res) => {
        const { tablero, asignado } = req.body;
        const itemList = await tareasRepository.listByUserAsigned(tablero, asignado);

        res.json(itemList);
    })

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
     * @param {Object} res - Objeto de respuesta
     */
    .post(sessionChecker(['administrador', 'usuario'], true), validateFechaTareaFormat(), async (req, res) => {
        const { tablero, fecha } = req.body;
        const itemList = await tareasRepository.listByLimitDate(tablero, fecha);

        res.json(itemList);
    })

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
     * Actualizar una tarea por su ID
     *
     * @async
     * @function
     * @param {Object} req - Objeto de solicitud.
     * @param {Object} res - Objeto de respuesta.
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
     * Elimina una tarea por su ID
     * @async
     * @function
     * @param {Object} req - Objeto de solicitud.
     * @param {Object} res - Objeto de respuesta.
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