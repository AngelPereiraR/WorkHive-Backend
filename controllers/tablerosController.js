import express from 'express';
import { tablerosRepository } from '../repositories/tablerosRepository.js';
import { createTableroValidations } from '../validations/createTableroValidations.js';
import { updateTableroValidations } from '../validations/updateTableroValidations.js';
import { validateObjectIdFormat } from '../validations/validateObjectIdFormat.js';
import { sessionChecker } from '../security/sessionChecker.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';

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
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
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
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
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
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   * @param {function} next - Función para pasar al siguiente middleware.
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
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   * @param {function} next - Función para pasar al siguiente middleware.
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
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   * @param {function} next - Función para pasar al siguiente middleware.
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
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   * @param {function} next - Función para pasar al siguiente middleware.
   */
  .post(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), async (req, res, next) => {
    const tableroId = req.params.id;
    const { userId } = req.body;
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
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   * @param {function} next - Función para pasar al siguiente middleware.
   */
  .delete(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), async (req, res, next) => {
    const tableroId = req.params.id;
    const { userId } = req.body;
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
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  .get(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), async (req, res) => {
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
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  .get(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), async (req, res) => {
    const userId = req.params.userId;
    const tableros = await tablerosRepository.getByAdministrator(userId);
    res.json(tableros);
  });

export { tablerosController };
