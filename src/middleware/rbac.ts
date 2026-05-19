import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '@/utils/api-response.js';

export const authorize = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !requiredRoles.includes(user.role)) {
      return errorResponse(res, 'You do not have permission to perform this action', null, 403);
    }

    next();
  };
};

export const checkScopes = (requiredScopes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const userScopes = user?.scopes || [];

    const hasAllScopes = requiredScopes.every((scope) => userScopes.includes(scope));

    if (!hasAllScopes) {
      return errorResponse(res, 'Insufficient scopes', null, 403);
    }

    next();
  };
};
