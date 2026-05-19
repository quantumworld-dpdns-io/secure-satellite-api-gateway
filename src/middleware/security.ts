import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '@/utils/api-response.js';

export const validateContentType = (req: Request, res: Response, next: NextFunction) => {
  if (
    ['POST', 'PUT', 'PATCH'].includes(req.method) &&
    !req.is('application/json') &&
    Object.keys(req.body || {}).length > 0
  ) {
    return errorResponse(res, 'Content-Type must be application/json', null, 415);
  }
  next();
};

export const ipFilter = (req: Request, res: Response, next: NextFunction) => {
  const deniedIps: string[] = []; // Can be loaded from Redis or DB
  const clientIp = req.ip || req.socket.remoteAddress || '';

  if (deniedIps.includes(clientIp)) {
    return errorResponse(res, 'Access denied', null, 403);
  }
  next();
};
