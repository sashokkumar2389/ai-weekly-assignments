import { Project } from '@/types/candidate.types';
import { Zap } from 'lucide-react';

interface ProjectsSectionProps {
    projects?: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
    if (!projects || projects.length === 0) return null;

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                Projects
            </h3>
            <div className="space-y-3">
                {projects.map((project, idx) => (
                    <div key={idx} className="flex gap-3">
                        <Zap className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-text-primary">{project.title}</p>
                            <p className="text-xs text-text-muted">{project.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
