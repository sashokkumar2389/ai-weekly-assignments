import { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ModalHeader } from './ModalHeader';
import { ContactSection } from './ContactSection';
import { SkillsSection } from './SkillsSection';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { ProjectsSection } from './ProjectsSection';
import { CertificationsSection } from './CertificationsSection';
import { LoadingDots } from '@/components/common/LoadingDots';
import { CandidateProfile } from '@/types/candidate.types';
import { motion } from 'framer-motion';

interface CandidateModalProps {
    isOpen: boolean;
    candidate: CandidateProfile | null;
    isLoading: boolean;
    onClose: () => void;
}

export function CandidateModal({
    isOpen,
    candidate,
    isLoading,
    onClose,
}: CandidateModalProps) {
    useEffect(() => {
        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[88vh] p-0 bg-bg-surface border-white/[0.07] overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-96">
                        <LoadingDots />
                    </div>
                ) : candidate ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col h-full"
                    >
                        <ModalHeader
                            name={candidate.name}
                            title={candidate.title}
                            company={candidate.company}
                            onClose={onClose}
                        />

                        <div className="overflow-y-auto flex-1 p-6 space-y-6">
                            <ContactSection
                                email={candidate.email}
                                phoneNumber={candidate.phoneNumber}
                                location={candidate.location}
                            />

                            <SkillsSection skills={candidate.skills} />

                            <ExperienceSection experience={candidate.experience} />

                            <EducationSection education={candidate.education} />

                            <ProjectsSection projects={candidate.projects} />

                            <CertificationsSection certifications={candidate.certifications} />

                            {candidate.text && (
                                <div className="space-y-3">
                                    <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                                        Resume Text
                                    </h3>
                                    <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                                        {candidate.text.substring(0, 500)}
                                        {candidate.text.length > 500 ? '...' : ''}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
