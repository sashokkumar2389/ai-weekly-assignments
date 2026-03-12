import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import env from './config/env';
import routes from './routes/index';
import { LoggingService } from './services/LoggingService';
import { requestIdMiddleware } from './middleware/requestIdMiddleware';
import { loggingMiddleware } from './middleware/loggingMiddleware';
import { errorHandler } from './middleware/errorHandler';
import { payloadLimiter } from './middleware/payloadLimiter';

const app = express();
const port = env.PORT || 3000;

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:3000', process.env.FRONTEND_URL || ''].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    optionsSuccessStatus: 200,
};

// Middleware setup
app.use(cors(corsOptions));
app.use(requestIdMiddleware);
app.use(json());
app.use(loggingMiddleware);
app.use(payloadLimiter);

// Routes setup
app.use('/v1', routes);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});