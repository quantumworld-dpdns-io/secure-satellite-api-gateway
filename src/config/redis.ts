import Redis from 'ioredis';
import { config } from '@/config/index.js';
import logger from '@/utils/logger.js';

const redis = new Redis(config.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

redis.on('connect', () => logger.info('🛑 Connected to Redis'));
redis.on('error', (err) => logger.error('❌ Redis connection error:', err));

export default redis;
