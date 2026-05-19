import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import Opossum from 'opossum';
import { Request, Response } from 'express';
import logger from '@/utils/logger.js';
import { UpstreamConfig } from '@/config/upstreams.js';
import { errorResponse } from '@/utils/api-response.js';

const circuitOptions = {
  timeout: 3000, // 3 seconds
  errorThresholdPercentage: 50,
  resetTimeout: 10000, // 10 seconds
};

const circuits = new Map<string, Opossum>();

export const getProxyMiddleware = (config: UpstreamConfig) => {
  if (!circuits.has(config.id)) {
    const breaker = new Opossum(async (proxyReq: any) => proxyReq, circuitOptions);
    breaker.fallback(() => {
      throw new Error(`Service ${config.id} is currently unavailable (Circuit Open)`);
    });
    circuits.set(config.id, breaker);
  }

  const proxyOptions: Options = {
    target: config.target,
    changeOrigin: true,
    pathRewrite: config.pathRewrite,
    logLevel: 'debug',
    onProxyReq: (proxyReq, req: Request) => {
      // Inject Request ID and User context if available
      const requestId = req.headers['x-request-id'];
      if (requestId) proxyReq.setHeader('X-Request-ID', requestId);
      
      const user = (req as any).user;
      if (user) {
        proxyReq.setHeader('X-User-Context', JSON.stringify(user));
      }

      logger.info(`Proxying ${req.method} ${req.url} -> ${config.target}`);
    },
    onError: (err, req, res: Response) => {
      logger.error(`Proxy Error (${config.id}):`, err.message);
      errorResponse(res, 'Gateway error connecting to downstream service', err.message, 502);
    },
  };

  return createProxyMiddleware(proxyOptions);
};
