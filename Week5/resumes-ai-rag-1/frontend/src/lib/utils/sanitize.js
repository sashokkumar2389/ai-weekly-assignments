export function escapeHtml(unsafe) {
    if (!unsafe)
        return '';
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
export function sanitizeText(text) {
    if (!text)
        return '';
    return escapeHtml(text);
}
export function truncateText(text, maxLength) {
    if (!text)
        return '';
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength).trim() + '...';
}
//# sourceMappingURL=sanitize.js.map