import {
  ArgumentsHost,
  ExceptionFilter,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LoggingService } from '../logging/logging.service';
import { redact } from '../utils/redact.util';

function hasMessageProperty(
  obj: object,
): obj is { message: string | string[] } {
  return Boolean(
    Object.prototype.hasOwnProperty.call(obj, 'message') &&
    (typeof (obj as { message?: unknown }).message === 'string' ||
      Array.isArray((obj as { message?: unknown }).message)),
  );
}

@Catch()
export class HttpAllExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) { }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    let errorMessage: string;

    if (typeof message === 'string') {
      errorMessage = message;
    } else if (typeof message === 'object' && message !== null) {
      if (hasMessageProperty(message)) {
        errorMessage = Array.isArray(message.message)
          ? message.message.join(', ')
          : message.message;
      } else {
        errorMessage = JSON.stringify(message);
      }
    } else {
      errorMessage = 'Internal Server Error';
    }

    // Preserve field names until sensitive fields have been redacted.
    const logMessage = JSON.stringify(redact(message));
    const path = request.url.split('?')[0];
    this.loggingService.error(
      `Error: ${logMessage} - Request: ${request.method} ${path}`,
    );

    response.status(status).json({
      statusCode: status,
      message: errorMessage,
    });
  }
}
