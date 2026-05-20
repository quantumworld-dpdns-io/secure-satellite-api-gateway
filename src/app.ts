import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import hpp from 'hpp';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import { v4 as uuidv4 } from 'uuid';
import { config } from '@/config/index.js';
import logger from '@/utils/logger.js';
import prisma from '@/config/db.js';
import redis from '@/config/redis.js';
import statusRoutes from '@/routes/status.routes.js';
import authRoutes from '@/routes/auth.routes.js';
import proxyRoutes from '@/routes/proxy.routes.js';
import { errorResponse } from '@/utils/api-response.js';
import { globalRateLimiter } from '@/middleware/rate-limiter.js';
import { validateContentType } from '@/middleware/security.js';

import { register, httpRequestsTotal, httpRequestDurationMicroseconds } from '@/utils/metrics.js';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@/config/swagger.js';

const app = express();

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Prometheus Metrics Endpoint
app.get('/metrics', async (_req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});

// Essential middlewares
app.use(helmet());
app.use(cors());
app.use(compression());

// Metrics tracking middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    httpRequestsTotal.inc({ method: req.method, route, status: res.statusCode });
    httpRequestDurationMicroseconds.observe({ method: req.method, route, status: res.statusCode }, duration);
  });
  next();
});

// Request ID & Lineage ID middleware
app.use((req, _res, next) => {
  req.headers['x-request-id'] = req.headers['x-request-id'] || uuidv4();
  req.headers['x-lineage-id'] = req.headers['x-lineage-id'] || uuidv4();
  next();
});

// Logging middleware
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// Routes
app.use('/api/v1', statusRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', proxyRoutes);

// Healthcheck
app.get('/health', async (_req: Request, res: Response) => {
  const health = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    services: {
      database: 'DOWN',
      redis: 'DOWN',
    },
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'UP';
  } catch (err) {
    logger.error('Healthcheck DB Error:', err);
  }

  try {
    await redis.ping();
    health.services.redis = 'UP';
  } catch (err) {
    logger.error('Healthcheck Redis Error:', err);
  }

  const isUp = health.services.database === 'UP' && health.services.redis === 'UP';
  res.status(isUp ? 200 : 503).json(health);
});

// Generic error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);
  errorResponse(
    res,
    config.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    null,
    500,
  );
});

export default app;
