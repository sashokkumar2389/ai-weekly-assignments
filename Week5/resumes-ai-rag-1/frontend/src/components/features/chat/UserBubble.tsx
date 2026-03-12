import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils/formatters';

interface UserBubbleProps {
    text: string;
    timestamp: Date;
}

export function UserBubble({ text, timestamp }: UserBubbleProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-end"
        >
            <div className="max-w-md space-y-1">
                <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg px-4 py-3 text-sm">
                    {text}
                </div>
                <p className="text-xs text-text-muted text-right">{formatDate(timestamp)}</p>
            </div>
        </motion.div>
    );
}
