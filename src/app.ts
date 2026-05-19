import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import { config } from '@/config/index.js';
import logger from '@/utils/logger.js';
import statusRoutes from '@/routes/status.routes.js';
import { errorResponse } from '@/utils/api-response.js';

const app = express();

// Essential middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request ID middleware
app.use((req, _res, next) => {
  req.headers['x-request-id'] = req.headers['x-request-id'] || uuidv4();
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

// Healthcheck
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
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

export default app;
