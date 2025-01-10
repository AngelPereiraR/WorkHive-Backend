import express, {response} from "express";
import { createTareaValidations } from '../validations/createTareaValidations.js';
import {tareasRepository} from "../repositories/tareasRepository.js";
import {sessionChecker} from "../security/sessionChecker.js";
import {validateObjectIdFormat} from "../validations/validateObjectIdFormat.js";
import {updateTareaValidations} from "../validations/updateTareaValidations.js";
import {validatePrioridadTareaFormat} from "../validations/validatePrioridadTareaFormat.js";
import {validateEstadoTareaFormat} from "../validations/validateEstadoTareaFormat.js";
import {validateFechaTareaFormat} from "../validations/validateFechaTareaFormat.js";


const tareasController = express.Router();

tareasController.route("/tareas")
    .post(sessionChecker(['administrador', 'usuario'], true), createTareaValidations, async (req, res) => {
        const createItem = await tareasRepository.create(req.curatedBody);

        res.status(201).json(createItem);
    })

    .get(sessionChecker(['administrador'], true), async (req, res) => {
        const itemList = await tareasRepository.list();

        res.json(itemList);
    })

tareasController.route("/tareas/:id")
    .get(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), async (req, res) => {
        const itemId = req.params.id;

        const item = await tareasRepository.getOne(itemId);
        if (!item) {
            return res.status(404).json({ message: `Item con id ${itemId} no encontrado` });
        }

        const response = item.toJSON();
        res.json(response);
    })

    .put(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), updateTareaValidations, async (req, res) => {
        const itemId = req.params.id;

        const item = await tareasRepository.update(itemId, req.curatedBody);
        if (!item) {
            return res.status(404).json({ message: `Item con id ${itemId} no encontrado` });
        }

        const response = item.toJSON();
        res.json(response);
    })

    .delete(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), async (req, res) => {
        const itemId = req.params.id;
        const item = await tareasRepository.remove(itemId);

        if (!item) {
            return res.status(404).json({ message: `Item con id ${itemId} no encontrado` });
        }

        res.status(204).json();
    });

tareasController.route("/tareas/prioridad")
    .get(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), validatePrioridadTareaFormat(), async (req, res) => {
        const {tablero, prioridad} = req.body;
        const itemList = await tareasRepository.listByPriority(tablero, prioridad);

        res.json(itemList);
    });

tareasController.route("/tareas/estado")
    .get(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), validateEstadoTareaFormat(), async (req, res) => {
        const {tablero, estado} = req.body;
        const itemList = await tareasRepository.listByState(tablero, estado);

        res.json(itemList);
    })

tareasController.route("/tareas/asigando")
    .get(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), validateObjectIdFormat("usuario"), async (req, res) => {
        const {tablero, asignado} = req.body;
        const itemList = await tareasRepository.listByUserAsigned(tablero, asignado);

        res.json(itemList);
    })

tareasController.route("/tareas/tablero/:id/fechaLimite/:fecha")
    .get(sessionChecker(['administrador', 'usuario'], true), validateObjectIdFormat(), validateFechaTareaFormat(), async (req, res) => {
        const {tablero, fechaLimite} = req.body;
        const itemList = await tareasRepository.listByLimitDate(tablero, convertToDate(fechaLimite));

        res.json(itemList);
    })


export { tareasController };

function convertToDate(fechaString) {
    const [dia, mes, anio] = fechaString.split('-');
    return new Date(anio, mes - 1, dia);
}