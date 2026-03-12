import { Education } from '@/types/candidate.types';
import { BookOpen } from 'lucide-react';

interface EducationSectionProps {
    education?: Education[];
}

export function EducationSection({ education }: EducationSectionProps) {
    if (!education || education.length === 0) return null;

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                Education
            </h3>
            <div className="space-y-3">
                {education.map((edu, idx) => (
                    <div key={idx} className="flex gap-3">
                        <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-text-primary">{edu.degree}</p>
                            <p className="text-xs text-text-muted">{edu.institution}</p>
                            {edu.year && <p className="text-xs text-text-muted">{edu.year}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
