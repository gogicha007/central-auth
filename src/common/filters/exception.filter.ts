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

    const serverErrorMessage =
      status === HttpStatus.SERVICE_UNAVAILABLE
        ? 'Service Unavailable'
        : 'Internal Server Error';

    const message =
      status >= HttpStatus.INTERNAL_SERVER_ERROR
        ? serverErrorMessage
        : exception instanceof HttpException
          ? exception.getResponse()
          : serverErrorMessage;

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

    const path = request.url.split('?')[0];
    this.loggingService.error(
      `Request failed: ${request.method} ${path} - Status: ${status}`,
    );

    response.status(status).json({
      statusCode: status,
      message: errorMessage,
    });
  }
}
