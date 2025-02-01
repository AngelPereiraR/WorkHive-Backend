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
import isValidToken from '../utils/isValidToken.js';

const invalidTokens = new Set();

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
 * @name POST /usuarios
 * @function
 * @memberof module:usuariosController
 * @inner
 * @param {Object} req.body - Datos del usuario a crear
 * @param {string} req.body.nombre - Nombre del usuario
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {string} req.body.password - Contraseña del usuario
 * @param {string} [req.body.rol='usuario'] - Rol del usuario (administrador o usuario)
 * @param {File} [req.files.fotoPerfil] - Foto de perfil del usuario
 * @returns {Object} 201 - Usuario creado
 * @returns {Object} 400 - Error de validación o usuario existente
 * @example
 * POST /usuarios
 * {
 *   "nombre": "Juan Pérez",
 *   "email": "juan@example.com",
 *   "password": "Contraseña123!",
 *   "rol": "usuario"
 * }
 * 
 * Response: 201 Created
 * {
 *   "_id": "60d5ecb54d6eb31234567890",
 *   "nombre": "Juan Pérez",
 *   "email": "juan@example.com",
 *   "rol": "usuario",
 *   "createdAt": "2023-06-25T12:00:00.000Z",
 *   "updatedAt": "2023-06-25T12:00:00.000Z"
 * }
 */
usuariosController.route('/usuarios')
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
   * @name GET /usuarios
   * @function
   * @memberof module:usuariosController
   * @inner
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   * @returns {Object[]} 200 - Lista de usuarios
   * @example
   * GET /usuarios
   * 
   * Response: 200 OK
   * [
   *   {
   *     "_id": "60d5ecb54d6eb31234567890",
   *     "nombre": "Juan Pérez",
   *     "email": "juan@example.com",
   *     "rol": "usuario",
   *     "createdAt": "2023-06-25T12:00:00.000Z",
   *     "updatedAt": "2023-06-25T12:00:00.000Z"
   *   },
   *   // ... más usuarios
   * ]
   */
  .get(sessionChecker(['administrador', 'usuario'], true), async (req, res) => {
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
 * @name POST /usuarios/logins
 * @function
 * @memberof module:usuariosController
 * @inner
 * @param {Object} req.body - Credenciales de inicio de sesión
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {string} req.body.password - Contraseña del usuario
 * @returns {Object} 201 - Usuario autenticado y token
 * @returns {Object} 401 - Credenciales inválidas
 * @example
 * POST /usuarios/logins
 * {
 *   "email": "juan@example.com",
 *   "password": "Contraseña123!"
 * }
 * 
 * Response: 201 Created
 * {
 *   "user": {
 *     "_id": "60d5ecb54d6eb31234567890",
 *     "nombre": "Juan Pérez",
 *     "email": "juan@example.com",
 *     "rol": "usuario"
 *   },
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 */
usuariosController.route('/usuarios/logins')
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
 * Ruta para gestionar el cierre de sesión de un usuario.
 * 
 * @name POST /usuarios/logout
 * @function
 * @memberof module:usuariosController
 * @inner
 * @param {string} req.headers.authorization - Token de autorización
 * @returns {Object} 200 - Mensaje de sesión cerrada
 * @returns {Object} 401 - Token inválido
 * @example
 * POST /usuarios/logout
 * Headers: { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 * 
 * Response: 200 OK
 * {
 *   "message": "Sesión cerrada correctamente"
 * }
 */
usuariosController.route('/usuarios/logout')
  .post(async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    // Verificar si el token es válido (antes de invalidarlo)
    if (!isValidToken(token, invalidTokens)) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    invalidTokens.add(token);

    res.status(200).json({ message: 'Sesión cerrada correctamente' });
  });

/**
 * Ruta para verificar si el token sigue siendo válido.
 * 
 * @name POST /usuarios/verify-token
 * @function
 * @memberof module:usuariosController
 * @inner
 * @param {string} req.headers.authorization - Token de autorización
 * @returns {Object} 200 - Token válido
 * @returns {Object} 401 - Token inválido o expirado
 * @example
 * POST /usuarios/verify-token
 * Headers: { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 * 
 * Response: 200 OK
 * {
 *   "message": "Token válido"
 * }
 */
usuariosController.route('/usuarios/verify-token')
  .post(async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(400).json({ message: 'Token no proporcionado' });
      }

      // Verificar si el token es válido
      if (!isValidToken(token, invalidTokens) || invalidTokens.has(token)) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
      }

      // Si es válido, devolver una respuesta positiva
      res.status(200).json({ message: 'Token válido' });
    } catch (error) {
      res.status(500).json({ message: 'Error al verificar el token', error: error.message });
    }
  });

/**
 * Ruta para gestionar un usuario específico por su ID.
 * 
 * @name GET /usuarios/:id
 * @function
 * @memberof module:usuariosController
 * @inner
 * @param {string} req.params.id - ID del usuario (ObjectId de MongoDB)
 * @returns {Object} 200 - Datos del usuario
 * @returns {Object} 404 - Usuario no encontrado
 * @example
 * GET /usuarios/60d5ecb54d6eb31234567890
 * 
 * Response: 200 OK
 * {
 *   "_id": "60d5ecb54d6eb31234567890",
 *   "nombre": "Juan Pérez",
 *   "email": "juan@example.com",
 *   "rol": "usuario",
 *   "createdAt": "2023-06-25T12:00:00.000Z",
 *   "updatedAt": "2023-06-25T12:00:00.000Z"
 * }
 */
usuariosController.route('/usuarios/:id')
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
   * @name PUT /usuarios/:id
   * @function
   * @memberof module:usuariosController
   * @inner
   * @param {string} req.params.id - ID del usuario (ObjectId de MongoDB)
   * @param {Object} req.body - Datos del usuario a actualizar
   * @param {string} [req.body.nombre] - Nuevo nombre del usuario
   * @param {string} [req.body.email] - Nuevo correo electrónico del usuario
   * @param {string} [req.body.password] - Nueva contraseña del usuario
   * @param {string} [req.body.rol] - Nuevo rol del usuario
   * @param {File} [req.files.fotoPerfil] - Nueva foto de perfil del usuario
   * @returns {Object} 201 - Usuario actualizado
   * @returns {Object} 404 - Usuario no encontrado
   * @example
   * PUT /usuarios/60d5ecb54d6eb31234567890
   * {
   *   "nombre": "Juan Pérez Actualizado",
   *   "email": "juan.nuevo@example.com"
   * }
   * 
   * Response: 201 Created
   * {
   *   "_id": "60d5ecb54d6eb31234567890",
   *   "nombre": "Juan Pérez Actualizado",
   *   "email": "juan.nuevo@example.com",
   *   "rol": "usuario",
   *   "createdAt": "2023-06-25T12:00:00.000Z",
   *   "updatedAt": "2023-06-25T13:00:00.000Z"
   * }
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
   * @name DELETE /usuarios/:id
   * @function
   * @memberof module:usuariosController
   * @inner
   * @param {string} req.params.id - ID del usuario (ObjectId de MongoDB)
   * @returns {Object} 204 - Usuario eliminado exitosamente (sin contenido)
   * @returns {Object} 404 - Usuario no encontrado
   * @throws {Error} 500 - Error del servidor al intentar eliminar el usuario
   * @example
   * DELETE /usuarios/60d5ecb54d6eb31234567890
   * 
   * Response: 204 No Content
   * 
   * @example
   * DELETE /usuarios/60d5ecb54d6eb31234567890
   * 
   * Response: 404 Not Found
   * {
   *   "message": "Usuario con id 60d5ecb54d6eb31234567890 no encontrado"
   * }
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
