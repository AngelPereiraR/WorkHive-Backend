import express from 'express';
import { createUsuarioValidations } from '../validations/createUsuarioValidations.js';
import { usuariosRepository } from '../repositories/usuariosRepository.js';
import { updateUsuarioValidations } from '../validations/updateUsuarioValidations.js';
import { loginUsuarioValidations } from '../validations/loginUsuarioValidations.js';
import { sha512 } from 'js-sha512';
import { validateObjectIdFormat } from '../validations/validateObjectIdFormat.js';
import { createUserToken } from '../utils/createUserToken.js';
import { sessionChecker } from '../security/sessionChecker.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';

/**
 * Controlador para gestionar rutas relacionadas con usuarios.
 * 
 * @module usuariosController
 * @requires express
 * @requires ../validations/createUsuarioValidations
 * @requires ../repositories/usuariosRepository
 * @requires ../validations/updateUsuarioValidations
 * @requires ../validations/loginUsuarioValidations
 * @requires js-sha512
 * @requires ../validations/validateObjectIdFormat
 * @requires ../utils/createUserToken
 * @requires ../security/sessionChecker
 * @requires ../errors/ForbiddenError
 */
const usuariosController = express.Router();

/**
 * Ruta para crear y listar usuarios.
 * 
 * @name /usuarios
 * @function
 */
usuariosController.route('/usuarios')
  /**
   * Crea un nuevo usuario.
   * 
   * @async
   * @function
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  .post(createUsuarioValidations, async (req, res) => {
    const createdItem = await usuariosRepository.create(req.curatedBody);

    const response = createdItem.toJSON();
    delete response.password;

    res.status(201).json(response);
  })
  /**
   * Lista todos los usuarios.
   * 
   * @async
   * @function
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  .get(sessionChecker(['administrador'], true), async (req, res) => {
    const itemList = await usuariosRepository.list();

    const preparedData = itemList.map((item) => {
      const usuarioItem = item.toJSON();
      delete usuarioItem.password;
      return usuarioItem;
    });

    res.json(preparedData);
  });

/**
 * Ruta para gestionar logins de usuarios.
 * 
 * @name /usuarios/logins
 * @function
 */
usuariosController.route('/usuarios/logins')
  /**
   * Inicia sesión con un usuario.
   * 
   * @async
   * @function
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  .post(loginUsuarioValidations, async (req, res) => {
    const usuarioEmail = req.curatedBody.email;
    const receivedPasswordHash = sha512(req.curatedBody.password);
    const usuario = await usuariosRepository.getOneByEmailAndPassword(usuarioEmail, receivedPasswordHash);

    if (!usuario) {
      return res.status(401).json({ message: 'usuario y/o contraseña incorrectos' });
    }

    const responseData = {
      jwt: createUserToken(usuario)
    };

    res.status(201).json(responseData);
  });

/**
 * Ruta para gestionar un usuario específico por su ID.
 * 
 * @name /usuarios/:id
 * @function
 */
usuariosController.route('/usuarios/:id')
  /**
   * Obtiene un usuario por su ID.
   * 
   * @async
   * @function
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  .get(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), async (req, res) => {
    const itemId = req.params.id;
    if (!req.isAdminUsuario && itemId !== req.tokenData.id) {
      next(new ForbiddenError('access not allowed'));
      return;
    }
    const item = await usuariosRepository.getOne(itemId);
    if (!item) {
      return res.status(404).json({ message: `item con id ${itemId} no encontrado` });
    }
    const response = item.toJSON();
    delete response.password;

    res.json(response);
  })
  /**
   * Actualiza un usuario por su ID.
   * 
   * @async
   * @function
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  .put(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), updateUsuarioValidations, async (req, res) => {
    const itemId = req.params.id;
    if (!req.isAdminUsuario && itemId !== req.tokenData.id) {
      next(new ForbiddenError('access not allowed'));
      return;
    }

    const item = await usuariosRepository.update(itemId, req.curatedBody);

    if (!item) {
      return res.status(404).json({ message: `item con id ${itemId} no encontrado` });
    }
    const response = item.toJSON();
    delete response.password;

    res.json(response);
  })
  /**
   * Elimina un usuario por su ID.
   * 
   * @async
   * @function
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  .delete(sessionChecker(['administrador'], true), validateObjectIdFormat(), async (req, res) => {
    const itemId = req.params.id;
    const item = await usuariosRepository.remove(itemId);

    if (!item) {
      return res.status(404).json({ message: `item con id ${itemId} no encontrado` });
    }

    res.status(204).json();
  });

export { usuariosController };

