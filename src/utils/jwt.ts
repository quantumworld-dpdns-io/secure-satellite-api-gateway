import jwt from 'jsonwebtoken';
import { config } from '@/config/index.js';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  scopes?: string[];
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as any,
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
};
