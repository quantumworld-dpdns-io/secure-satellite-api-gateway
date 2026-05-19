import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redis from '@/config/redis.js';
import { errorResponse } from '@/utils/api-response.js';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - ioredis type mismatch in rate-limit-redis
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  handler: (req: Request, res: Response) => {
    errorResponse(res, 'Too many requests, please try again later.', null, 429);
  },
});
r.', null, 429);
  },
});
