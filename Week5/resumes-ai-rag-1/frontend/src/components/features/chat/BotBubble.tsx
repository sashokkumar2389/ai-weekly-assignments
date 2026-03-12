import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils/formatters';

interface BotBubbleProps {
    children: React.ReactNode;
    timestamp: Date;
}

export function BotBubble({ children, timestamp }: BotBubbleProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-start"
        >
            <div className="max-w-2xl space-y-1">
                <div className="bg-bg-card border border-white/[0.07] rounded-lg px-4 py-3 text-sm text-text-primary">
                    {children}
                </div>
                <p className="text-xs text-text-muted">{formatDate(timestamp)}</p>
            </div>
        </motion.div>
    );
}
