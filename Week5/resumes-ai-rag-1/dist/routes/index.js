"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_1 = __importDefault(require("./health"));
const embeddings_1 = __importDefault(require("./embeddings"));
const search_1 = __importDefault(require("./search"));
const router = (0, express_1.Router)();
// Setup routes
router.use('/health', health_1.default);
router.use('/embeddings', embeddings_1.default);
router.use('/search', search_1.default);
exports.default = router;
