"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ResumeRepository_1 = require("../repositories/ResumeRepository");
const mongodb_1 = require("mongodb");
const env_1 = __importDefault(require("../config/env"));
const router = (0, express_1.Router)();
const resumeRepository = new ResumeRepository_1.ResumeRepository();
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Service is running',
        timestamp: new Date().toISOString(),
    });
});
router.get('/db', async (req, res) => {
    try {
        await resumeRepository.connect();
        res.status(200).json({
            status: 'ok',
            message: 'Database connection successful',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(503).json({
            status: 'error',
            message: 'Database connection failed',
            error: message,
            timestamp: new Date().toISOString(),
        });
    }
});
router.get('/diagnostics', async (req, res) => {
    try {
        const client = new mongodb_1.MongoClient(env_1.default.MONGODB_URI, { useUnifiedTopology: true });
        await client.connect();
        const db = client.db(env_1.default.MONGODB_DB_NAME);
        const collection = db.collection(env_1.default.MONGODB_COLLECTION);
        // Get collection stats
        const docCount = await collection.countDocuments();
        const sampleDoc = await collection.findOne({});
        const indexes = await collection.indexInformation();
        await client.close();
        res.status(200).json({
            status: 'ok',
            database: env_1.default.MONGODB_DB_NAME,
            collection: env_1.default.MONGODB_COLLECTION,
            documentCount: docCount,
            sampleDocument: sampleDoc ? {
                _id: sampleDoc._id,
                fields: Object.keys(sampleDoc).slice(0, 15) // Show first 15 fields
            } : null,
            indexes: Object.keys(indexes),
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            status: 'error',
            message: 'Failed to get diagnostics',
            error: message,
            timestamp: new Date().toISOString(),
        });
    }
});
exports.default = router;
