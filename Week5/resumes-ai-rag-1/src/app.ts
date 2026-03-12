import express from 'express';
import { json } from 'body-parser';
import router from './routes/index';
import { requestIdMiddleware } from './middleware/requestIdMiddleware';
import { loggingMiddleware } from './middleware/loggingMiddleware';
import { errorHandler } from './middleware/errorHandler';
import { payloadLimiter } from './middleware/payloadLimiter';

const app = express();

// Middleware setup
app.use(requestIdMiddleware);
app.use(loggingMiddleware);
app.use(json());
app.use(payloadLimiter);

// Setup routes
app.use('/v1', router);

// Error handling middleware
app.use(errorHandler);

export default app;