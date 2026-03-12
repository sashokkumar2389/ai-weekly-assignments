import { Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CertificationsSectionProps {
    certifications?: string[];
}

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
    if (!certifications || certifications.length === 0) return null;

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                Certifications
            </h3>
            <div className="flex flex-wrap gap-2">
                {certifications.map((cert, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {cert}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
