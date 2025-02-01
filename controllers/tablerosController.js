import express from 'express';
import { tablerosRepository } from '../repositories/tablerosRepository.js';
import { usuariosRepository } from '../repositories/usuariosRepository.js';
import { createTableroValidations } from '../validations/createTableroValidations.js';
import { updateTableroValidations } from '../validations/updateTableroValidations.js';
import { validateObjectIdFormat } from '../validations/validateObjectIdFormat.js';
import { sessionChecker } from '../security/sessionChecker.js';

/**
 * Controlador para gestionar rutas relacionadas con tableros.
 * 
 * @module tablerosController
 * @requires express
 * @requires ../repositories/tablerosRepository
 * @requires ../validations/createTableroValidations
 * @requires ../validations/updateTableroValidations
 * @requires ../validations/validateObjectIdFormat
 * @requires ../security/sessionChecker
 * @requires ../errors/ForbiddenError
 */
const tablerosController = express.Router();

/**
 * Ruta para crear y listar tableros.
 * 
 * @name /tableros
 * @function
 */
tablerosController.route('/tableros')
  /**
   * Crea un nuevo tablero.
   * 
   * @async
   * @function
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} req.body - Cuerpo de la solicitud con los datos del tablero.
   * @param {string} req.body.nombre - Nombre del tablero (requerido).
   * @param {string} [req.body.descripcion] - Descripción del tablero.
   * @param {Date} [req.body.fechaInicio] - Fecha de inicio del proyecto.
   * @param {Date} [req.body.fechaFin] - Fecha de finalización del proyecto.
   * @param {string} req.body.administrador - ID del administrador del tablero (requerido).
   * @param {string[]} [req.body.colaboradores] - Lista de IDs de colaboradores.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {Object} - Respuesta con el tablero creado.
   * @example
   * // Respuesta exitosa (201 Created)
   * {
   *   "_id": "64f1a2b3c9e77b001f8e4a1a",
   *   "nombre": "Proyecto X",
   *   "descripcion": "Descripción del proyecto X",
   *   "fechaInicio": "2023-09-01T00:00:00.000Z",
   *   "fechaFin": "2023-12-31T00:00:00.000Z",
   *   "administrador": "64f1a2b3c9e77b001f8e4a1b",
   *   "colaboradores": ["64f1a2b3c9e77b001f8e4a1c"]
   * }
   */
  .post(sessionChecker(['administrador', 'usuario'], true), createTableroValidations, async (req, res) => {
    const createdItem = await tablerosRepository.create({
      ...req.curatedBody,
      administrador: req.tokenData.id
    });
    res.status(201).json(createdItem);
  })

  /**
   * Lista todos los tableros.
   * 
   * @async
   * @function
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {Object[]} - Lista de tableros.
   * @example
   * // Respuesta exitosa (200 OK)
   * [
   *   {
   *     "_id": "64f1a2b3c9e77b001f8e4a1a",
   *     "nombre": "Proyecto X",
   *     "descripcion": "Descripción del proyecto X",
   *     "fechaInicio": "2023-09-01T00:00:00.000Z",
   *     "fechaFin": "2023-12-31T00:00:00.000Z",
   *     "administrador": "64f1a2b3c9e77b001f8e4a1b",
   *     "colaboradores": ["64f1a2b3c9e77b001f8e4a1c"]
   *   }
   * ]
   */
  .get(sessionChecker(['administrador'], true), async (req, res) => {
    const itemList = await tablerosRepository.list();
    res.json(itemList);
  });

/**
 * Ruta para gestionar un tablero específico por su ID.
 * 
 * @name /tableros/:id
 * @function
 */
tablerosController.route('/tableros/:id')
  /**
   * Obtiene un tablero por su ID.
   * 
   * @async
   * @function
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {string} req.params.id - ID del tablero.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {Object} - Tablero encontrado.
   * @example
   * // Respuesta exitosa (200 OK)
   * {
   *   "_id": "64f1a2b3c9e77b001f8e4a1a",
   *   "nombre": "Proyecto X",
   *   "descripcion": "Descripción del proyecto X",
   *   "fechaInicio": "2023-09-01T00:00:00.000Z",
   *   "fechaFin": "2023-12-31T00:00:00.000Z",
   *   "administrador": "64f1a2b3c9e77b001f8e4a1b",
   *   "colaboradores": ["64f1a2b3c9e77b001f8e4a1c"]
   * }
   * @example
   * // Respuesta de error (404 Not Found)
   * {
   *   "message": "Tablero con id 64f1a2b3c9e77b001f8e4a1a no encontrado"
   * }
   */
  .get(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), async (req, res, next) => {
    const itemId = req.params.id;
    const item = await tablerosRepository.getOne(itemId);
    if (!item) {
      return res.status(404).json({ message: `Tablero con id ${itemId} no encontrado` });
    }
    res.json(item);
  })

  /**
   * Actualiza un tablero por su ID.
   * 
   * @async
   * @function
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {string} req.params.id - ID del tablero.
   * @param {Object} req.body - Cuerpo de la solicitud con los datos a actualizar.
   * @param {string} [req.body.nombre] - Nuevo nombre del tablero.
   * @param {string} [req.body.descripcion] - Nueva descripción del tablero.
   * @param {Date} [req.body.fechaInicio] - Nueva fecha de inicio del proyecto.
   * @param {Date} [req.body.fechaFin] - Nueva fecha de finalización del proyecto.
   * @param {string} [req.body.administrador] - Nuevo ID del administrador del tablero.
   * @param {string[]} [req.body.colaboradores] - Nueva lista de IDs de colaboradores.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {Object} - Tablero actualizado.
   * @example
   * // Respuesta exitosa (200 OK)
   * {
   *   "_id": "64f1a2b3c9e77b001f8e4a1a",
   *   "nombre": "Proyecto X Actualizado",
   *   "descripcion": "Nueva descripción",
   *   "fechaInicio": "2023-09-01T00:00:00.000Z",
   *   "fechaFin": "2023-12-31T00:00:00.000Z",
   *   "administrador": "64f1a2b3c9e77b001f8e4a1b",
   *   "colaboradores": ["64f1a2b3c9e77b001f8e4a1c"]
   * }
   * @example
   * // Respuesta de error (404 Not Found)
   * {
   *   "message": "Tablero con id 64f1a2b3c9e77b001f8e4a1a no encontrado"
   * }
   */
  .put(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), updateTableroValidations, async (req, res, next) => {
    const itemId = req.params.id;
    const item = await tablerosRepository.getOne(itemId);
    if (!item) {
      return res.status(404).json({ message: `Tablero con id ${itemId} no encontrado` });
    }
    const updatedItem = await tablerosRepository.update(itemId, req.curatedBody);
    res.json(updatedItem);
  })

  /**
   * Elimina un tablero por su ID.
   * 
   * @async
   * @function
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {string} req.params.id - ID del tablero.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {void} - Respuesta sin contenido.
   * @example
   * // Respuesta exitosa (204 No Content)
   * @example
   * // Respuesta de error (404 Not Found)
   * {
   *   "message": "Tablero con id 64f1a2b3c9e77b001f8e4a1a no encontrado"
   * }
   */
  .delete(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), async (req, res, next) => {
    const itemId = req.params.id;
    const item = await tablerosRepository.getOne(itemId);
    if (!item) {
      return res.status(404).json({ message: `Tablero con id ${itemId} no encontrado` });
    }
    await tablerosRepository.remove(itemId);
    res.status(204).json();
  });

/**
 * Ruta para gestionar colaboradores de un tablero.
 * 
 * @name /tableros/:id/colaboradores
 * @function
 */
tablerosController.route('/tableros/:id/colaboradores')
  /**
   * Añade un colaborador a un tablero.
   * 
   * @async
   * @function
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {string} req.params.id - ID del tablero.
   * @param {Object} req.body - Cuerpo de la solicitud con el ID del colaborador.
   * @param {string} req.body.userId - ID del usuario a añadir como colaborador.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {Object} - Tablero actualizado con el nuevo colaborador.
   * @example
   * // Respuesta exitosa (200 OK)
   * {
   *   "_id": "64f1a2b3c9e77b001f8e4a1a",
   *   "nombre": "Proyecto X",
   *   "descripcion": "Descripción del proyecto X",
   *   "fechaInicio": "2023-09-01T00:00:00.000Z",
   *   "fechaFin": "2023-12-31T00:00:00.000Z",
   *   "administrador": "64f1a2b3c9e77b001f8e4a1b",
   *   "colaboradores": ["64f1a2b3c9e77b001f8e4a1c", "64f1a2b3c9e77b001f8e4a1d"]
   * }
   * @example
   * // Respuesta de error (404 Not Found)
   * {
   *   "message": "Usuario con id 64f1a2b3c9e77b001f8e4a1d no encontrado"
   * }
   */
  .post(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), async (req, res, next) => {
    const tableroId = req.params.id;
    const { userId } = req.body;
    const user = await usuariosRepository.getOne(userId);
    if (!user) {
      return res.status(404).json({ message: `Usuario con id ${userId} no encontrado` });
    }
    const tablero = await tablerosRepository.getOne(tableroId);
    if (!tablero) {
      return res.status(404).json({ message: `Tablero con id ${tableroId} no encontrado` });
    }
    const updatedTablero = await tablerosRepository.addCollaborator(tableroId, userId);
    res.json(updatedTablero);
  })

  /**
   * Elimina un colaborador de un tablero.
   * 
   * @async
   * @function
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {string} req.params.id - ID del tablero.
   * @param {Object} req.body - Cuerpo de la solicitud con el ID del colaborador.
   * @param {string} req.body.userId - ID del usuario a eliminar como colaborador.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {Object} - Tablero actualizado sin el colaborador eliminado.
   * @example
   * // Respuesta exitosa (200 OK)
   * {
   *   "_id": "64f1a2b3c9e77b001f8e4a1a",
   *   "nombre": "Proyecto X",
   *   "descripcion": "Descripción del proyecto X",
   *   "fechaInicio": "2023-09-01T00:00:00.000Z",
   *   "fechaFin": "2023-12-31T00:00:00.000Z",
   *   "administrador": "64f1a2b3c9e77b001f8e4a1b",
   *   "colaboradores": ["64f1a2b3c9e77b001f8e4a1c"]
   * }
   * @example
   * // Respuesta de error (404 Not Found)
   * {
   *   "message": "Usuario con id 64f1a2b3c9e77b001f8e4a1d no encontrado"
   * }
   */
  .delete(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), async (req, res, next) => {
    const tableroId = req.params.id;
    const { userId } = req.body;
    const user = await usuariosRepository.getOne(userId);
    if (!user) {
      return res.status(404).json({ message: `Usuario con id ${userId} no encontrado` });
    }
    const tablero = await tablerosRepository.getOne(tableroId);
    if (!tablero) {
      return res.status(404).json({ message: `Tablero con id ${tableroId} no encontrado` });
    }
    const updatedTablero = await tablerosRepository.removeCollaborator(tableroId, userId);
    res.json(updatedTablero);
  });

/**
 * Ruta para obtener tableros por colaborador.
 * 
 * @name /tableros/colaborador/:userId
 * @function
 */
tablerosController.route('/tableros/colaborador/:userId')
  /**
   * Obtiene tableros por colaborador.
   * 
   * @async
   * @function
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {string} req.params.userId - ID del usuario colaborador.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {Object[]} - Lista de tableros del colaborador.
   * @example
   * // Respuesta exitosa (200 OK)
   * [
   *   {
   *     "_id": "64f1a2b3c9e77b001f8e4a1a",
   *     "nombre": "Proyecto X",
   *     "descripcion": "Descripción del proyecto X",
   *     "fechaInicio": "2023-09-01T00:00:00.000Z",
   *     "fechaFin": "2023-12-31T00:00:00.000Z",
   *     "administrador": "64f1a2b3c9e77b001f8e4a1b",
   *     "colaboradores": ["64f1a2b3c9e77b001f8e4a1c"]
   *   }
   * ]
   */
  .get(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat("userId"), async (req, res) => {
    const userId = req.params.userId;
    const tableros = await tablerosRepository.getByCollaborator(userId);
    res.json(tableros);
  });

/**
 * Ruta para obtener tableros por administrador.
 * 
 * @name /tableros/administrador/:userId
 * @function
 */
tablerosController.route('/tableros/administrador/:userId')
  /**
   * Obtiene tableros por administrador.
   * 
   * @async
   * @function
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {string} req.params.userId - ID del usuario administrador.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {Object[]} - Lista de tableros del administrador.
   * @example
   * // Respuesta exitosa (200 OK)
   * [
   *   {
   *     "_id": "64f1a2b3c9e77b001f8e4a1a",
   *     "nombre": "Proyecto X",
   *     "descripcion": "Descripción del proyecto X",
   *     "fechaInicio": "2023-09-01T00:00:00.000Z",
   *     "fechaFin": "2023-12-31T00:00:00.000Z",
   *     "administrador": "64f1a2b3c9e77b001f8e4a1b",
   *     "colaboradores": ["64f1a2b3c9e77b001f8e4a1c"]
   *   }
   * ]
   */
  .get(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat("userId"), async (req, res) => {
    const userId = req.params.userId;
    const tableros = await tablerosRepository.getByAdministrator(userId);
    res.json(tableros);
  });

/**
 * Ruta para verificar si un tablero es el proyecto actual.
 * 
 * @name /tableros/:id/actual
 * @function
 */
tablerosController.route('/tableros/:id/actual')
  /**
   * Verifica si un tablero es el proyecto actual.
   * 
   * @async
   * @function
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {string} req.params.id - ID del tablero.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {Object} - Respuesta con un booleano que indica si el proyecto es actual.
   * @example
   * // Respuesta exitosa (200 OK)
   * {
   *   "actual": true
   * }
   * @example
   * // Respuesta de error (404 Not Found)
   * {
   *   "message": "Tablero con id 64f1a2b3c9e77b001f8e4a1a no encontrado"
   * }
   */
  .get(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), async (req, res) => {
    const itemId = req.params.id;
    const item = await tablerosRepository.getOne(itemId);
    if (!item) {
      return res.status(404).json({ message: `Tablero con id ${itemId} no encontrado` });
    }
    const actual = tablerosRepository.isProyectoActual(Date.now(), item.fechaFin);
    res.json({ actual });
  });

export { tablerosController };