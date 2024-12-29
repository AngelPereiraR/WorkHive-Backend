import { isValidObjectId } from "mongoose"
import { BadRequestError } from "../errors/BadRequestError.js"

export const validateObjectIdFormat = (paramName = 'id') => {
  return (req, res, next) => {
    const paramValue = req.params[paramName] || ''
    if(!isValidObjectId(paramValue)){
      next(new BadRequestError(`param_${paramName}_is_not_a_valid_objectid`.toLowerCase()))
    }else{
      next()
    }
  }
}
