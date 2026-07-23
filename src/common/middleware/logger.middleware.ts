import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggingService } from '../logging/logging.service';

interface TypedRequestBody<T> extends Request {
  body: T;
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(
    req: TypedRequestBody<Record<string, unknown>>,
    res: Response,
    next: NextFunction,
  ) {
    const { method, originalUrl, query, body } = req;
    this.loggingService.info(
      `Incoming Request: ${method} ${originalUrl} - Query: ${JSON.stringify(query)} - Body: ${JSON.stringify(body)}`,
    );

    const originalSend = res.send;
    res.send = (body: unknown): Response => {
      this.loggingService.info(
        `Response: ${res.statusCode} - Body: ${JSON.stringify(body)}`,
      );
      return originalSend.call(res, body) as Response;
    };
    next();
  }
}
