"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const env_1 = __importDefault(require("./config/env"));
const index_1 = __importDefault(require("./routes/index"));
const requestIdMiddleware_1 = require("./middleware/requestIdMiddleware");
const loggingMiddleware_1 = require("./middleware/loggingMiddleware");
const errorHandler_1 = require("./middleware/errorHandler");
const payloadLimiter_1 = require("./middleware/payloadLimiter");
const app = (0, express_1.default)();
const port = env_1.default.PORT || 3000;
// CORS configuration
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:3000', process.env.FRONTEND_URL || ''].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    optionsSuccessStatus: 200,
};
// Middleware setup
app.use((0, cors_1.default)(corsOptions));
app.use(requestIdMiddleware_1.requestIdMiddleware);
app.use((0, body_parser_1.json)());
app.use(loggingMiddleware_1.loggingMiddleware);
app.use(payloadLimiter_1.payloadLimiter);
// Routes setup
app.use('/v1', index_1.default);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
