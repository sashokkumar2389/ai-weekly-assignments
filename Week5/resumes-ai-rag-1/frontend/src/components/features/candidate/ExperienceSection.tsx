import { Experience } from '@/types/candidate.types';
import { Briefcase } from 'lucide-react';

interface ExperienceSectionProps {
    experience?: Experience[];
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
    if (!experience || experience.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                Experience
            </h3>
            <div className="space-y-4 relative border-l-2 border-primary/20 pl-4">
                {experience.map((exp, idx) => (
                    <div key={idx} className="relative">
                        <div className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-primary" />
                        <div>
                            <p className="font-semibold text-text-primary flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-primary" />
                                {exp.title}
                            </p>
                            <p className="text-sm text-text-muted">{exp.company}</p>
                            {exp.duration && <p className="text-xs text-text-muted">{exp.duration}</p>}
                            {exp.description && (
                                <p className="text-sm text-text-primary mt-2 leading-relaxed">{exp.description}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
