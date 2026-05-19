import app from './app.js';
import { config } from '@/config/index.js';
import logger from '@/utils/logger.js';

const server = app.listen(config.PORT, () => {
  logger.info(`🚀 Secure Satellite API Gateway running on port ${config.PORT} [${config.NODE_ENV}]`);
});

const shutdown = () => {
  logger.info('Gracefully shutting down...');
  server.close(() => {
    logger.info('Closed out remaining connections.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
