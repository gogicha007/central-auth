import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggingService } from '../libs/services/logging.service';

async function bootstrap() {
  const logger = new Logger('CentralAuth');

  const app = await NestFactory.create(AppModule);

  const loggingService = app.get(LoggingService);

  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const PORT = Number(process.env.PORT ?? 3000);
  process.on('uncaughtException', (error) => {
    loggingService.error('Uncaught Exception', error.stack);
  });

  process.on('undahdledRejection', (reason) => {
    loggingService.error('Unhandled Rejection', JSON.stringify(reason));
  });

  await app.listen(PORT);

  logger.log(`CentralAuth running at port ${PORT}`);
}

void bootstrap();
