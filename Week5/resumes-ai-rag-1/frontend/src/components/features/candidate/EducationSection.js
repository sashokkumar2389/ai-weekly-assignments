import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BookOpen } from 'lucide-react';
export function EducationSection({ education }) {
    if (!education || education.length === 0)
        return null;
    return (_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-xs font-semibold uppercase tracking-widest text-text-muted", children: "Education" }), _jsx("div", { className: "space-y-3", children: education.map((edu, idx) => (_jsxs("div", { className: "flex gap-3", children: [_jsx(BookOpen, { className: "h-5 w-5 text-primary flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-text-primary", children: edu.degree }), _jsx("p", { className: "text-xs text-text-muted", children: edu.institution }), edu.year && _jsx("p", { className: "text-xs text-text-muted", children: edu.year })] })] }, idx))) })] }));
}
//# sourceMappingURL=EducationSection.js.map