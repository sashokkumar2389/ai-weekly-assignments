export const formatDate = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

export const formatScore = (score: number): string => {
    return (Math.round(score * 100) / 100).toFixed(2);
};

export const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
};

export const formatExperience = (years: number | undefined): string => {
    if (!years) return 'N/A';
    if (years < 1) return '< 1 year';
    if (years === 1) return '1 year';
    return `${years.toFixed(1)} years`;
};

export const formatSkills = (skills: string[] | string | undefined): string[] => {
    if (!skills) return [];
    if (typeof skills === 'string') {
        try {
            return JSON.parse(skills);
        } catch {
            return [skills];
        }
    }
    return skills;
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};
