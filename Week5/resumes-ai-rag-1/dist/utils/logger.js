"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(context) {
        this.context = context || 'App';
    }
    formatMessage(level, message, meta) {
        const timestamp = new Date().toISOString();
        return JSON.stringify({
            timestamp,
            level,
            context: this.context,
            message,
            ...(meta && { meta })
        });
    }
    info(message, meta) {
        console.log(this.formatMessage('info', message, meta));
    }
    error(message, meta) {
        console.error(this.formatMessage('error', message, meta));
    }
    warn(message, meta) {
        console.warn(this.formatMessage('warn', message, meta));
    }
    debug(message, meta) {
        console.debug(this.formatMessage('debug', message, meta));
    }
}
exports.Logger = Logger;
exports.default = new Logger();
