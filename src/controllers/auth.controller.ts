import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/async-handler.js';
import redis from '@/config/redis.js';
import { successResponse } from '@/utils/api-response.js';

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (token) {
    // Blacklist token in Redis for 1 hour (or until expiry)
    await redis.set(`blacklist:${token}`, 'true', 'EX', 3600);
  }

  successResponse(res, null, 'Logged out successfully');
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  successResponse(res, user, 'User profile retrieved');
});
