import Joi from 'joi';
import express from "express"

export const validateBody =  (schema: Joi.Schema) => {
  return (req : express.Request, res: express.Response, next: express.NextFunction) => {
    const result = schema.validate(req.body);
    if(result.error) {
      return res.status(400).json({
        message : result.error.details
      })
    }
    else{
      next();
    }
  }
}
