import express, { Request, Response, NextFunction } from 'express';
import { config } from '@/config/index.js';
import logger from '@/utils/logger.js';

const app = express();

app.use(express.json());

// Healthcheck
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Generic error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  res.status(500).json({
    error: config.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
});

export default app;
