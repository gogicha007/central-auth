import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggingService } from '../logging/logging.service';
import { redact } from '../utils/redact.util';


interface TypedRequestBody<T> extends Request {
  body: T;
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) { }

  use(
    req: TypedRequestBody<Record<string, unknown>>,
    res: Response,
    next: NextFunction,
  ) {
    const { method, body } = req;
    const path = req.originalUrl.split('?')[0]

    this.loggingService.info(
      `Incoming Request: ${method} ${path} - Body: ${JSON.stringify(redact(body))}`,
    );

    const startedAt = Date.now()
    res.once('finish', () => {
      this.loggingService.info(
        `Response: ${method} ${path} - Status: ${res.statusCode} - Duration: ${Date.now() - startedAt}ms`
      )
    })
    next();
  }
}
