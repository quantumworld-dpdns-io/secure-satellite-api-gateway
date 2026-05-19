import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt.js';
import { errorResponse } from '@/utils/api-response.js';
import logger from '@/utils/logger.js';
import redis from '@/config/redis.js';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Missing or invalid authorization header', null, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    // Check if token is blacklisted in Redis
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return errorResponse(res, 'Token has been revoked', null, 401);
    }

    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    logger.error('Authentication Error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired', null, 401);
    }
    return errorResponse(res, 'Invalid token', null, 401);
  }
};
