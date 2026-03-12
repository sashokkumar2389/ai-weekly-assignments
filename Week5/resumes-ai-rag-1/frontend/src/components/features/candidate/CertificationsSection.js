import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
export function CertificationsSection({ certifications }) {
    if (!certifications || certifications.length === 0)
        return null;
    return (_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-xs font-semibold uppercase tracking-widest text-text-muted", children: "Certifications" }), _jsx("div", { className: "flex flex-wrap gap-2", children: certifications.map((cert, idx) => (_jsxs(Badge, { variant: "secondary", className: "flex items-center gap-1", children: [_jsx(Award, { className: "h-3 w-3" }), cert] }, idx))) })] }));
}
//# sourceMappingURL=CertificationsSection.js.map