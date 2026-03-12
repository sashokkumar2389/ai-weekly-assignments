import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactSectionProps {
    email?: string;
    phoneNumber?: string;
    location?: string;
}

export function ContactSection({ email, phoneNumber, location }: ContactSectionProps) {
    const hasInfo = email || phoneNumber || location;

    if (!hasInfo) return null;

    return (
        <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">Contact</h3>
            <div className="space-y-2">
                {email && (
                    <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                        <a href={`mailto:${email}`} className="text-sm text-primary hover:text-accent truncate">
                            {email}
                        </a>
                    </div>
                )}
                {phoneNumber && (
                    <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                        <a href={`tel:${phoneNumber}`} className="text-sm text-primary hover:text-accent">
                            {phoneNumber}
                        </a>
                    </div>
                )}
                {location && (
                    <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-text-primary">{location}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
