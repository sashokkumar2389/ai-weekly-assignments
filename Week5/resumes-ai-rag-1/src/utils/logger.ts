export class Logger {
    private context: string;

    constructor(context?: string) {
        this.context = context || 'App';
    }

    private formatMessage(level: string, message: string, meta?: any): string {
        const timestamp = new Date().toISOString();
        return JSON.stringify({
            timestamp,
            level,
            context: this.context,
            message,
            ...(meta && { meta })
        });
    }

    info(message: string, meta?: any): void {
        console.log(this.formatMessage('info', message, meta));
    }

    error(message: string, meta?: any): void {
        console.error(this.formatMessage('error', message, meta));
    }

    warn(message: string, meta?: any): void {
        console.warn(this.formatMessage('warn', message, meta));
    }

    debug(message: string, meta?: any): void {
        console.debug(this.formatMessage('debug', message, meta));
    }
}

export default new Logger();