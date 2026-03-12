import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils/formatters';
export function BotBubble({ children, timestamp }) {
    return (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3 }, className: "flex justify-start", children: _jsxs("div", { className: "max-w-2xl space-y-1", children: [_jsx("div", { className: "bg-bg-card border border-white/[0.07] rounded-lg px-4 py-3 text-sm text-text-primary", children: children }), _jsx("p", { className: "text-xs text-text-muted", children: formatDate(timestamp) })] }) }));
}
//# sourceMappingURL=BotBubble.js.map