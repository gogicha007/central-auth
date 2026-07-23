import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable } from 'rxjs';
import { LoggingService } from '../logging/logging.service';

type MulterRequest = Request & {
  file?: { originalname?: string; mimetype?: string; size?: number };
  files?: unknown;
};

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<MulterRequest>();
    const contentType = req.headers['content-type'];
    const isMultipart =
      typeof contentType === 'string' &&
      contentType.toLowerCase().startsWith('multipart/form-data');

    if (!isMultipart) {
      return next.handle();
    }

    const body: unknown = req.body;
    const file = req.file
      ? {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        }
      : undefined;

    this.loggingService.info(
      `Request has multipart body: ${JSON.stringify(body)}, file: ${JSON.stringify(file)}, files: ${JSON.stringify(req.files)}`,
    );

    return next.handle();
  }
}
