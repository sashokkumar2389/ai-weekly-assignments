import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { motion } from 'framer-motion';
export function CandidateModal({ isOpen, candidate, isLoading, onClose, }) {
    useEffect(() => {
        const handleEscapeKey = (e) => {
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
    return (_jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: _jsx(DialogContent, { className: "max-w-2xl max-h-[88vh] p-0 bg-bg-surface border-white/[0.07] overflow-hidden", children: isLoading ? (_jsx("div", { className: "flex items-center justify-center h-96", children: _jsx(LoadingDots, {}) })) : candidate ? (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "flex flex-col h-full", children: [_jsx(ModalHeader, { name: candidate.name, title: candidate.title, company: candidate.company, onClose: onClose }), _jsxs("div", { className: "overflow-y-auto flex-1 p-6 space-y-6", children: [_jsx(ContactSection, { email: candidate.email, phoneNumber: candidate.phoneNumber, location: candidate.location }), _jsx(SkillsSection, { skills: candidate.skills }), _jsx(ExperienceSection, { experience: candidate.experience }), _jsx(EducationSection, { education: candidate.education }), _jsx(ProjectsSection, { projects: candidate.projects }), _jsx(CertificationsSection, { certifications: candidate.certifications }), candidate.text && (_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-xs font-semibold uppercase tracking-widest text-text-muted", children: "Resume Text" }), _jsxs("p", { className: "text-sm text-text-primary leading-relaxed whitespace-pre-wrap", children: [candidate.text.substring(0, 500), candidate.text.length > 500 ? '...' : ''] })] }))] })] })) : null }) }));
}
//# sourceMappingURL=CandidateModal.js.map