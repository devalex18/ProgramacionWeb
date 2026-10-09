import { Router } from 'express';
import productRoutes from './products.routes';

const router = Router();
router.use('/', productRoutes);

export default router;