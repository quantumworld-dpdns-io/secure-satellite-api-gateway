import { Router } from 'express';
import * as StatusController from '@/controllers/status.controller.js';

const router = Router();

router.get('/status', StatusController.getStatus);

export default router;
