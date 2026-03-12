import { Badge } from '@/components/ui/badge';
import { formatSkills } from '@/lib/utils/formatters';

interface SkillsSectionProps {
    skills?: string[] | string;
}

export function SkillsSection({ skills }: SkillsSectionProps) {
    const skillsList = formatSkills(skills);

    if (!skillsList || skillsList.length === 0) return null;

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">Skills</h3>
            <div className="flex flex-wrap gap-2">
                {skillsList.map((skill) => (
                    <Badge key={skill} variant="secondary">
                        {skill}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
