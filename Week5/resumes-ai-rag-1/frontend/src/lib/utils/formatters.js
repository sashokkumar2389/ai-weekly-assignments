export const formatDate = (date) => {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};
export const formatScore = (score) => {
    return (Math.round(score * 100) / 100).toFixed(2);
};
export const formatDuration = (ms) => {
    if (ms < 1000)
        return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
};
export const formatExperience = (years) => {
    if (!years)
        return 'N/A';
    if (years < 1)
        return '< 1 year';
    if (years === 1)
        return '1 year';
    return `${years.toFixed(1)} years`;
};
export const formatSkills = (skills) => {
    if (!skills)
        return [];
    if (typeof skills === 'string') {
        try {
            return JSON.parse(skills);
        }
        catch {
            return [skills];
        }
    }
    return skills;
};
export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength) + '...';
};
//# sourceMappingURL=formatters.js.map