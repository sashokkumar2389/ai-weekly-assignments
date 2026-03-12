import { Router, Express } from 'express';
import healthRoutes from './health';
import embeddingRoutes from './embeddings';
import searchRoutes from './search';

const router = Router();

// Setup routes
router.use('/health', healthRoutes);
router.use('/embeddings', embeddingRoutes);
router.use('/search', searchRoutes);

export default router;