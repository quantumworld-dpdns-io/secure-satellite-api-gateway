import { Request, Response, NextFunction } from 'express';
import prisma from '@/config/db.js';
import { errorResponse } from '@/utils/api-response.js';

export const apiKeyValidator = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || typeof apiKey !== 'string') {
    return errorResponse(res, 'Missing API Key', null, 401);
  }

  // Simplified for now, in a real app we'd hash and compare
  const user = await prisma.user.findFirst({
    where: {
      email: { contains: apiKey.split('-')[0] }, // Mock logic: email-secret
    },
  });

  if (!user) {
    return errorResponse(res, 'Invalid API Key', null, 401);
  }

  (req as any).user = user;
  next();
};
