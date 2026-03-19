import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import { SkillTag } from "@/components/shared/SkillTag";
import { DocumentQAInput } from "./DocumentQAInput";
import { CandidateProfile as ICandidateProfile } from "@/api/types";
import { useState } from "react";

interface CandidateProfileProps {
    profile: ICandidateProfile;
}

export const CandidateProfile = ({ profile }: CandidateProfileProps) => {
    const [showFullResume, setShowFullResume] = useState(false);
    const { candidate } = profile;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {candidate.name}
                </h2>
                <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {candidate.role} @ {candidate.company}
                </p>
                {candidate.location && (
                    <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span>{candidate.location}</span>
                    </p>
                )}
            </div>

            {/* Contact */}
            <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact</h3>
                <div className="space-y-2 pl-1">
                    {candidate.email && (
                        <a
                            href={`mailto:${candidate.email}`}
                            className="flex items-center gap-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                            <Mail className="h-5 w-5 flex-shrink-0" />
                            <span className="break-all">{candidate.email}</span>
                        </a>
                    )}
                    {candidate.phoneNumber && candidate.phoneNumber !== "Not found" && (
                        <a
                            href={`tel:${candidate.phoneNumber}`}
                            className="flex items-center gap-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                            <Phone className="h-5 w-5 flex-shrink-0" />
                            <span>{candidate.phoneNumber}</span>
                        </a>
                    )}
                    {candidate.linkedinProfile && (
                        <a
                            href={candidate.linkedinProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                            <Linkedin className="h-5 w-5 flex-shrink-0" />
                            <span>LinkedIn Profile</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Skills */}
            {candidate.skills && candidate.skills.length > 0 && (
                <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill) => (
                            <SkillTag key={skill} skill={skill} />
                        ))}
                    </div>
                </div>
            )}

            {/* Experience */}
            <div className="space-y-2 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Experience</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {candidate.experience}
                </p>
                {candidate.specialization && (
                    <div className="pt-2">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Specialization:</span>{" "}
                            <span className="text-gray-600 dark:text-gray-400">{candidate.specialization}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Education */}
            {candidate.education && candidate.education.length > 0 && (
                <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h3>
                    <ul className="space-y-2 pl-2">
                        {candidate.education.map((edu, i) => (
                            <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex-shrink-0">•</span>
                                <span>{edu}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Certifications */}
            {candidate.certifications && candidate.certifications.length > 0 && (
                <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Certifications
                    </h3>
                    <ul className="space-y-2 pl-2">
                        {candidate.certifications.map((cert, i) => (
                            <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex-shrink-0">•</span>
                                <span>{cert}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Resume */}
            <div className="space-y-3">
                <button
                    onClick={() => setShowFullResume(!showFullResume)}
                    className="flex items-center gap-1 text-base font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                    <span>{showFullResume ? "▼" : "▶"}</span>
                    <span>View Full Resume</span>
                </button>
                {showFullResume && (
                    <div className="mt-3 max-h-64 overflow-y-auto rounded-lg bg-gray-50 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
                        <pre className="font-mono text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                            {candidate.resumeContent}
                        </pre>
                    </div>
                )}
            </div>

            {/* Document QA */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <DocumentQAInput candidateId={candidate.id} candidateName={candidate.name} />
            </div>
        </div>
    );
};
