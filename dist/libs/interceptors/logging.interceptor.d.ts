import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggingService } from '../services/logging.service';
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly loggingService;
    constructor(loggingService: LoggingService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
