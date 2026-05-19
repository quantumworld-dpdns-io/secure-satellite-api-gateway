import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '@/utils/api-response.js';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export const validateSchema = (schema: object) => {
  const validate = ajv.compile(schema);
  return (req: Request, res: Response, next: NextFunction) => {
    const valid = validate(req.body);
    if (!valid) {
      return errorResponse(res, 'Validation Error', validate.errors, 400);
    }
    next();
  };
};
