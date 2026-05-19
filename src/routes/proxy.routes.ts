import { Router } from 'express';
import { upstreams } from '@/config/upstreams.js';
import { getProxyMiddleware } from '@/middleware/proxy.js';
import { authenticate } from '@/middleware/auth.js';
import { abacMiddleware } from '@/middleware/abac.js';

const router = Router();

// Telemetry Proxying (Authenticated + ABAC)
router.use(
  '/telemetry',
  authenticate,
  abacMiddleware('read', 'telemetry'),
  getProxyMiddleware(upstreams.telemetry),
);

// Mission Control Proxying (Authenticated + ABAC)
router.use(
  '/mission',
  authenticate,
  abacMiddleware('read', 'mission'),
  getProxyMiddleware(upstreams.mission),
);

export default router;
