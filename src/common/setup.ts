import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAllExceptionFilter } from './filters/exception.filter';
import { LoggingService } from './logging/logging.service';

export function applyToHttpLayer(
  app: INestApplication,
  loggingService: LoggingService,
) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  app.useGlobalFilters(new HttpAllExceptionFilter(loggingService));
}
