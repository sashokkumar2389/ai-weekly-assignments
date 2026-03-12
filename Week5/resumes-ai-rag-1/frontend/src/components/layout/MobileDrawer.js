import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useUiStore } from '@/lib/stores/ui.store';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
export function MobileDrawer() {
    const { isSidebarOpen, toggleSidebar, closeSidebar } = useUiStore();
    return (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", size: "icon", className: "md:hidden fixed top-4 left-4 z-40", onClick: toggleSidebar, "aria-label": "Toggle menu", children: isSidebarOpen ? _jsx(X, { className: "h-5 w-5" }) : _jsx(Menu, { className: "h-5 w-5" }) }), _jsx(AnimatePresence, { children: isSidebarOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: closeSidebar, className: "fixed inset-0 bg-black/30 z-30 md:hidden" }), _jsx(motion.div, { initial: { x: -280 }, animate: { x: 0 }, exit: { x: -280 }, className: "fixed left-0 top-0 h-screen z-40 md:hidden", children: _jsx(Sidebar, {}) })] })) })] }));
}
//# sourceMappingURL=MobileDrawer.js.map