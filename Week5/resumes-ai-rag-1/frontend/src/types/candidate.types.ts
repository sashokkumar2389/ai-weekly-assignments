export interface Experience {
    company: string;
    title: string;
    duration?: string;
    description?: string;
}

export interface Education {
    degree: string;
    institution: string;
    year?: string;
}

export interface Project {
    title: string;
    description: string;
}

export interface CandidateProfile {
    _id: string;
    resumeId?: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    location?: string;
    title?: string;
    company?: string;
    education?: Education[];
    experience?: Experience[];
    skills?: string[];
    projects?: Project[];
    certifications?: string[];
    text?: string;
    processedAt?: string;
}
