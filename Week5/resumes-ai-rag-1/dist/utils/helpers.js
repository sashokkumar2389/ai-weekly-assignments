"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInput = exports.validateEmail = exports.generateUniqueId = void 0;
const generateUniqueId = () => {
    return `req_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
exports.generateUniqueId = generateUniqueId;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const sanitizeInput = (input) => {
    return input.replace(/[<>]/g, '');
};
exports.sanitizeInput = sanitizeInput;
