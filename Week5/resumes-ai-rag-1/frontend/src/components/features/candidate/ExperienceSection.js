import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Briefcase } from 'lucide-react';
export function ExperienceSection({ experience }) {
    if (!experience || experience.length === 0)
        return null;
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xs font-semibold uppercase tracking-widest text-text-muted", children: "Experience" }), _jsx("div", { className: "space-y-4 relative border-l-2 border-primary/20 pl-4", children: experience.map((exp, idx) => (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-primary" }), _jsxs("div", { children: [_jsxs("p", { className: "font-semibold text-text-primary flex items-center gap-2", children: [_jsx(Briefcase, { className: "h-4 w-4 text-primary" }), exp.title] }), _jsx("p", { className: "text-sm text-text-muted", children: exp.company }), exp.duration && _jsx("p", { className: "text-xs text-text-muted", children: exp.duration }), exp.description && (_jsx("p", { className: "text-sm text-text-primary mt-2 leading-relaxed", children: exp.description }))] })] }, idx))) })] }));
}
//# sourceMappingURL=ExperienceSection.js.map