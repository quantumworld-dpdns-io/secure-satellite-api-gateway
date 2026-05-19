import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import Opossum from 'opossum';
import { Request, Response, NextFunction } from 'express';
import logger from '@/utils/logger.js';
import { UpstreamConfig } from '@/config/upstreams.js';
import { errorResponse } from '@/utils/api-response.js';

const circuitOptions = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
};

const circuits = new Map<string, Opossum>();

export const getProxyMiddleware = (config: UpstreamConfig) => {
  if (!circuits.has(config.id)) {
    const breaker = new Opossum(async (req: any) => req, circuitOptions);
    breaker.fallback(() => {
      throw new Error(`Service ${config.id} is currently unavailable (Circuit Open)`);
    });
    circuits.set(config.id, breaker);
  }

  const proxyOptions: Options = {
    target: config.target,
    changeOrigin: true,
    pathRewrite: config.pathRewrite as any,
    on: {
      proxyReq: (proxyReq: any, req: Request) => {
        const requestId = req.headers['x-request-id'];
        if (requestId) proxyReq.setHeader('X-Request-ID', requestId);
        
        const user = (req as any).user;
        if (user) {
          proxyReq.setHeader('X-User-Context', JSON.stringify(user));
        }

        logger.info(`Proxying ${req.method} ${req.url} -> ${config.target}`);
      },
      error: (err: Error, req: Request, res: Response) => {
        logger.error(`Proxy Error (${config.id}):`, err.message);
        errorResponse(res, 'Gateway error connecting to downstream service', err.message, 502);
      },
    },
  };

  return createProxyMiddleware(proxyOptions);
};
