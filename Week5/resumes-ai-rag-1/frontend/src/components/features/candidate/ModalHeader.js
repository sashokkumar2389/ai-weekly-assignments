import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function ModalHeader({ name, title, company, onClose }) {
    return (_jsxs("div", { className: "sticky top-0 bg-gradient-to-b from-bg-surface to-bg-surface/80 backdrop-blur-sm p-6 border-b border-white/[0.07] flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "text-2xl font-bold text-text-primary", children: name }), (title || company) && (_jsxs("p", { className: "text-sm text-text-muted mt-1", children: [title && _jsx("span", { children: title }), title && company && _jsx("span", { children: " \u00B7 " }), company && _jsx("span", { children: company })] }))] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: onClose, "aria-label": "Close modal", className: "flex-shrink-0", children: _jsx(X, { className: "h-5 w-5" }) })] }));
}
//# sourceMappingURL=ModalHeader.js.map