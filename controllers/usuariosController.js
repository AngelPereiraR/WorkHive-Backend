import express from 'express';
import formidable from 'formidable';
import { createUsuarioValidations } from '../validations/createUsuarioValidations.js';
import { usuariosRepository } from '../repositories/usuariosRepository.js';
import { updateUsuarioValidations } from '../validations/updateUsuarioValidations.js';
import { loginUsuarioValidations } from '../validations/loginUsuarioValidations.js';
import { sha512 } from 'js-sha512';
import { validateObjectIdFormat } from '../validations/validateObjectIdFormat.js';
import { createUserToken } from '../utils/createUserToken.js';
import { sessionChecker } from '../security/sessionChecker.js';

/**
 * Controlador para gestionar rutas relacionadas con usuarios.
 * 
 * @module usuariosController
 * @requires express
 * @requires formidable
 * @requires ../validations/createUsuarioValidations
 * @requires ../repositories/usuariosRepository
 * @requires ../validations/updateUsuarioValidations
 * @requires ../validations/loginUsuarioValidations
 * @requires js-sha512
 * @requires ../validations/validateObjectIdFormat
 * @requires ../utils/createUserToken
 * @requires ../security/sessionChecker
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
   * @param {Function} next - Siguiente middleware.
   */
  .post(async (req, res, next) => {
    try {
      const form = formidable({ multiples: true });
      form.parse(req, async (err, fields, files) => {
        req.curatedBody = fields;

        if (files && files.fotoPerfil) {
          req.curatedBody.fotoPerfil = files.fotoPerfil[0].filepath;
        }

        // Convertir campos a string para garantizar consistencia
        ['nombre', 'email', 'password', 'rol'].forEach(field => {
          if (fields[field]) req.curatedBody[field] = fields[field].toString();
        });

        const existingUsuario = await usuariosRepository.getOneByEmailAndPassword(
          req.curatedBody.email,
          sha512(req.curatedBody.password)
        );

        if (existingUsuario) {
          return res.status(400).json({ message: 'Ya hay un usuario existente con ese nombre' });
        }

        const validatedData = await createUsuarioValidations.validate(
          req.curatedBody,
          { abortEarly: false, stripUnknown: true }
        );

        const createdItem = await usuariosRepository.create(validatedData);
        res.status(201).json(createdItem);
      });
    } catch (e) {
      next(e);
    }
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
    const userEmail = req.curatedBody.email;
    const receivedPasswordHash = sha512(req.curatedBody.password);
    const user = await usuariosRepository.getOneByEmailAndPassword(userEmail, receivedPasswordHash);

    if (!user) {
      return res.status(401).json({ message: 'Usuario y/o contraseña incorrectos' });
    }

    delete user.password;

    const responseData = {
      user,
      token: createUserToken(user)
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
    const item = await usuariosRepository.getOne(itemId);

    if (!item) {
      return res.status(404).json({ message: `Usuario con id ${itemId} no encontrado` });
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
   * @param {Function} next - Siguiente middleware.
   */
  .put(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), async (req, res, next) => {
    const itemId = req.params.id;

    try {
      const form = formidable({ multiples: true });
      form.parse(req, async (err, fields, files) => {
        req.curatedBody = fields;

        if (files && files.fotoPerfil) {
          req.curatedBody.fotoPerfil = files.fotoPerfil[0].filepath;
        }

        ['nombre', 'email', 'password', 'rol'].forEach(field => {
          if (fields[field]) req.curatedBody[field] = fields[field].toString();
        });

        const validatedData = await updateUsuarioValidations.validate(
          req.curatedBody,
          { abortEarly: false, stripUnknown: true }
        );

        const updatedItem = await usuariosRepository.update(itemId, validatedData);

        if (!updatedItem) {
          return res.status(404).json({ message: `Usuario con id ${itemId} no encontrado` });
        }

        res.status(201).json(updatedItem);
      });
    } catch (e) {
      next(e);
    }
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
      return res.status(404).json({ message: `Usuario con id ${itemId} no encontrado` });
    }

    res.status(204).json();
  });

export { usuariosController };
