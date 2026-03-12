import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils/formatters';
export function UserBubble({ text, timestamp }) {
    return (_jsx(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3 }, className: "flex justify-end", children: _jsxs("div", { className: "max-w-md space-y-1", children: [_jsx("div", { className: "bg-gradient-to-r from-primary to-accent text-white rounded-lg px-4 py-3 text-sm", children: text }), _jsx("p", { className: "text-xs text-text-muted text-right", children: formatDate(timestamp) })] }) }));
}
//# sourceMappingURL=UserBubble.js.map