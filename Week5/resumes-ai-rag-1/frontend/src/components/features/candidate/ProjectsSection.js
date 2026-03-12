import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Zap } from 'lucide-react';
export function ProjectsSection({ projects }) {
    if (!projects || projects.length === 0)
        return null;
    return (_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-xs font-semibold uppercase tracking-widest text-text-muted", children: "Projects" }), _jsx("div", { className: "space-y-3", children: projects.map((project, idx) => (_jsxs("div", { className: "flex gap-3", children: [_jsx(Zap, { className: "h-5 w-5 text-accent flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-text-primary", children: project.title }), _jsx("p", { className: "text-xs text-text-muted", children: project.description })] })] }, idx))) })] }));
}
//# sourceMappingURL=ProjectsSection.js.map