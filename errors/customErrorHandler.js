import { ValidationError } from "yup";
import { BadRequestError } from "./BadRequestError.js";
import { SessionRequiredError } from "./SessionRequiredError.js";
import { ForbiddenError } from "./ForbiddenError.js"
import jwt from "jsonwebtoken";

export function customErrorHandler(err, req, res, next) {
  if (res.headersSent) {
      return next(err);
  }

  if(err instanceof ValidationError ) {
      res.status(400).json({message: "validation error", errors: err.errors || []})
  }else if(err instanceof BadRequestError){
      res.status(400).json({message: "validation error", errors: [err.message]})
  }else if(err instanceof SessionRequiredError){
      res.status(401).json({message: err.message})
  }else if(err instanceof jwt.JsonWebTokenError){
    res.status(401).json({message: "invalid session"})
  }else if(err instanceof ForbiddenError){
    res.status(403).json({message: err.message})
  }else{
      console.info(err)
      res.status(500).json({message: 'internal error'})
  }
}
