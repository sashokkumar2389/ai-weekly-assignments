"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const index_1 = __importDefault(require("./routes/index"));
const requestIdMiddleware_1 = require("./middleware/requestIdMiddleware");
const loggingMiddleware_1 = require("./middleware/loggingMiddleware");
const errorHandler_1 = require("./middleware/errorHandler");
const payloadLimiter_1 = require("./middleware/payloadLimiter");
const app = (0, express_1.default)();
// Middleware setup
app.use(requestIdMiddleware_1.requestIdMiddleware);
app.use(loggingMiddleware_1.loggingMiddleware);
app.use((0, body_parser_1.json)());
app.use(payloadLimiter_1.payloadLimiter);
// Setup routes
app.use('/v1', index_1.default);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
exports.default = app;
