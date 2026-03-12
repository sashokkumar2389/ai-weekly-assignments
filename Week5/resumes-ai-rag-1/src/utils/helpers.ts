export const generateUniqueId = (): string => {
    return `req_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const sanitizeInput = (input: string): string => {
    return input.replace(/[<>]/g, '');
};