import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggingService } from '../services/logging.service';
interface TypedRequestBody<T> extends Request {
    body: T;
}
export declare class LoggerMiddleware implements NestMiddleware {
    private readonly loggingService;
    constructor(loggingService: LoggingService);
    use(req: TypedRequestBody<Record<string, unknown>>, res: Response, next: NextFunction): void;
}
export {};
