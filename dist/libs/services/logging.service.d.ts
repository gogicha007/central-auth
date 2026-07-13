export declare class LoggingService {
    private logLevel;
    private logFilePath;
    private maxFileSizeKB;
    constructor();
    private shouldLog;
    private rotateLogFile;
    private writeLog;
    log(level: string, message: string): void;
    error(message: string, trace?: string): void;
    warn(message: string): void;
    info(message: string): void;
    debug(message: string): void;
}
