import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModalHeaderProps {
    name: string;
    title?: string;
    company?: string;
    onClose: () => void;
}

export function ModalHeader({ name, title, company, onClose }: ModalHeaderProps) {
    return (
        <div className="sticky top-0 bg-gradient-to-b from-bg-surface to-bg-surface/80 backdrop-blur-sm p-6 border-b border-white/[0.07] flex items-start justify-between">
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-text-primary">{name}</h2>
                {(title || company) && (
                    <p className="text-sm text-text-muted mt-1">
                        {title && <span>{title}</span>}
                        {title && company && <span> · </span>}
                        {company && <span>{company}</span>}
                    </p>
                )}
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close modal"
                className="flex-shrink-0"
            >
                <X className="h-5 w-5" />
            </Button>
        </div>
    );
}
