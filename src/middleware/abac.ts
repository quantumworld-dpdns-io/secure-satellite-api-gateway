import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '@/utils/api-response.js';

export interface ABACPolicy {
  subject: {
    role: string;
    clearance: number;
  };
  action: 'read' | 'write' | 'delete';
  resource: {
    type: 'telemetry' | 'mission';
    classification: number;
  };
}

export const evaluateABAC = (policy: ABACPolicy): boolean => {
  // Simplified logic: clearance must be >= classification
  if (policy.subject.clearance < policy.resource.classification) {
    return false;
  }

  // Admin can do anything
  if (policy.subject.role === 'ADMIN') {
    return true;
  }

  // Regular user can only read
  if (policy.subject.role === 'USER' && policy.action !== 'read') {
    return false;
  }

  return true;
};

export const abacMiddleware = (action: ABACPolicy['action'], resourceType: ABACPolicy['resource']['type']) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    // Mock user attributes for now, in real app these would be in the JWT or DB
    const subject = {
      role: user.role,
      clearance: user.role === 'ADMIN' ? 3 : 1,
    };

    // Mock resource classification for now
    const resource = {
      type: resourceType,
      classification: 2, // Defaulting to restricted
    };

    const isAllowed = evaluateABAC({ subject, action, resource });

    if (!isAllowed) {
      return errorResponse(res, 'Access denied based on security attributes', null, 403);
    }

    next();
  };
};
