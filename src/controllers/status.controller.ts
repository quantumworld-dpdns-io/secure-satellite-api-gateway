import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/async-handler.js';

export const getStatus = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Satellite Gateway Operational' });
});
