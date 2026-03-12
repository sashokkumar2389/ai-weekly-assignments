import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from '@/components/ui/badge';
import { formatSkills } from '@/lib/utils/formatters';
export function SkillsSection({ skills }) {
    const skillsList = formatSkills(skills);
    if (!skillsList || skillsList.length === 0)
        return null;
    return (_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-xs font-semibold uppercase tracking-widest text-text-muted", children: "Skills" }), _jsx("div", { className: "flex flex-wrap gap-2", children: skillsList.map((skill) => (_jsx(Badge, { variant: "secondary", children: skill }, skill))) })] }));
}
//# sourceMappingURL=SkillsSection.js.map