import express from 'express'
import { createUsuarioValidations } from '../validations/createUsuarioValidations.js'
import { usuariosRepository } from '../repositories/usuariosRepository.js'
import { updateUsuarioValidations } from '../validations/updateUsuarioValidations.js'
import { loginUsuarioValidations } from '../validations/loginUsuarioValidations.js'
import { sha512 } from 'js-sha512'
import { validateObjectIdFormat } from '../validations/validateObjectIdFormat.js'
import { ForbiddenError } from '../errors/ForbiddenError.js'

const usuariosController = express.Router()

usuariosController.route('/usuarios')
  .post(createUsuarioValidations, async (req, res) => {

    const createdItem = await usuariosRepository.create(req.curatedBody)

    const response = createdItem.toJSON()
    delete response.password

    res.status(201).json(response)
  })
  .get(async (req, res) => {
    const itemList = await usuariosRepository.list()

    const preparedData = itemList.map((item) => {
      const userItem = item.toJSON()
      delete userItem.password
      return userItem
    })

    res.json(preparedData)
  })

// usuariosController.route('/usuarios/logins')
//   .post(loginUsuarioValidations, async (req, res) => {
//     const userEmail = req.curatedBody.email
//     const receivedPasswordHash = sha512(req.curatedBody.password)
//     const user = await usuariosRepository.getOneByEmailAndPassword(userEmail, receivedPasswordHash)

//     if (!user) {
//       return res.status(401).json({ message: 'usuario y/o contraseña incorrectos' })
//     }

//     const responseData = {
//       jwt: createUsuarioToken(user)
//     }

//     res.status(201).json(responseData)
//   })

usuariosController.route('/usuarios/:id')
  .get(validateObjectIdFormat(), async (req, res) => {
    const itemId = req.params.id
    if (!req.isAdminUsuario && itemId !== req.tokenData.id) {
      next(new ForbiddenError('access not allowed'))
      return
    }
    const item = await usuariosRepository.getOne(itemId)
    if (!item) {
      return res.status(404).json({ message: `item con id ${itemId} no encontrado` })
    }
    const response = item.toJSON()
    delete response.password

    res.json(response)
  })
  .put(validateObjectIdFormat(), updateUsuarioValidations, async (req, res) => {
    const itemId = req.params.id
    if (!req.isAdminUsuario && itemId !== req.tokenData.id) {
      next(new ForbiddenError('access not allowed'))
      return
    }

    const item = await usuariosRepository.update(itemId, req.curatedBody)

    if (!item) {
      return res.status(404).json({ message: `item con id ${itemId} no encontrado` })
    }
    const response = item.toJSON()
    delete response.password

    res.json(response)
  })
  .delete(validateObjectIdFormat(), async (req, res) => {
    const itemId = req.params.id
    const item = await usuariosRepository.remove(itemId)

    if (!item) {
      return res.status(404).json({ message: `item con id ${itemId} no encontrado` })
    }

    res.status(204).json()
  })

export { usuariosController }
