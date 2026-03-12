import { Router, Request, Response } from 'express';
import { ResumeRepository } from '../repositories/ResumeRepository';
import { MongoClient } from 'mongodb';
import env from '../config/env';

const router = Router();
const resumeRepository = new ResumeRepository();

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        message: 'Service is running',
        timestamp: new Date().toISOString(),
    });
});

router.get('/db', async (req: Request, res: Response) => {
    try {
        await resumeRepository.connect();
        res.status(200).json({
            status: 'ok',
            message: 'Database connection successful',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(503).json({
            status: 'error',
            message: 'Database connection failed',
            error: message,
            timestamp: new Date().toISOString(),
        });
    }
});

router.get('/diagnostics', async (req: Request, res: Response) => {
    try {
        const client = new MongoClient(env.MONGODB_URI, { useUnifiedTopology: true } as any);
        await client.connect();

        const db = client.db(env.MONGODB_DB_NAME);
        const collection = db.collection(env.MONGODB_COLLECTION);

        // Get collection stats
        const docCount = await collection.countDocuments();
        const sampleDoc = await collection.findOne({});
        const indexes = await collection.indexInformation();

        await client.close();

        res.status(200).json({
            status: 'ok',
            database: env.MONGODB_DB_NAME,
            collection: env.MONGODB_COLLECTION,
            documentCount: docCount,
            sampleDocument: sampleDoc ? {
                _id: sampleDoc._id,
                fields: Object.keys(sampleDoc).slice(0, 15) // Show first 15 fields
            } : null,
            indexes: Object.keys(indexes),
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            status: 'error',
            message: 'Failed to get diagnostics',
            error: message,
            timestamp: new Date().toISOString(),
        });
    }
});

export default router;