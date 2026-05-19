import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
  timestamp: string;
}

export const successResponse = (res: Response, data: any, message = 'Success', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const errorResponse = (res: Response, message = 'Error', error: any = null, status = 500) => {
  return res.status(status).json({
    success: false,
    message,
    error,
    timestamp: new Date().toISOString(),
  });
};
