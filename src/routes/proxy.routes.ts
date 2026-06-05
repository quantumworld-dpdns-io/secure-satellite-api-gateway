import { Router } from 'express';
import { upstreams } from '@/config/upstreams.js';
import { getProxyMiddleware } from '@/middleware/proxy.js';
import { authenticate } from '@/middleware/auth.js';
import { abacMiddleware } from '@/middleware/abac.js';
import { validateSchema } from '@/middleware/validator.js';
import { telemetrySchema, missionSchema } from '@/config/schemas.js';

const router = Router();

// Telemetry Proxying (Authenticated + ABAC + Validation)
router.use(
  '/telemetry',
  authenticate,
  abacMiddleware('read', 'telemetry'),
  validateSchema(telemetrySchema),
  getProxyMiddleware(upstreams.telemetry),
);

// Mission Control Proxying (Authenticated + ABAC + Validation)
router.use(
  '/mission',
  authenticate,
  abacMiddleware('read', 'mission'),
  validateSchema(missionSchema),
  getProxyMiddleware(upstreams.mission),
);

export default router;
