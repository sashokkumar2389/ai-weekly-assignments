import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Mail, Phone, MapPin } from 'lucide-react';
export function ContactSection({ email, phoneNumber, location }) {
    const hasInfo = email || phoneNumber || location;
    if (!hasInfo)
        return null;
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-xs font-semibold uppercase tracking-widest text-text-muted", children: "Contact" }), _jsxs("div", { className: "space-y-2", children: [email && (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Mail, { className: "h-4 w-4 text-primary flex-shrink-0" }), _jsx("a", { href: `mailto:${email}`, className: "text-sm text-primary hover:text-accent truncate", children: email })] })), phoneNumber && (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Phone, { className: "h-4 w-4 text-primary flex-shrink-0" }), _jsx("a", { href: `tel:${phoneNumber}`, className: "text-sm text-primary hover:text-accent", children: phoneNumber })] })), location && (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(MapPin, { className: "h-4 w-4 text-primary flex-shrink-0" }), _jsx("span", { className: "text-sm text-text-primary", children: location })] }))] })] }));
}
//# sourceMappingURL=ContactSection.js.map