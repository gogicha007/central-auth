import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { LoggingService } from './common/logging/logging.service';
import { applyToHttpLayer } from './common/setup';

async function bootstrap() {
  const logger = new Logger('CentralAuth');

  const app = await NestFactory.create(AppModule);

  const loggingService = app.get(LoggingService);

  app.enableShutdownHooks();
  applyToHttpLayer(app, loggingService);

  const PORT = Number(process.env.PORT ?? 3000);
  process.on('uncaughtException', (error) => {
    loggingService.error('Uncaught Exception', error.stack);
  });

  process.on('unhandledRejection', (reason) => {
    loggingService.error('Unhandled Rejection', JSON.stringify(reason));
  });

  await app.listen(PORT);

  logger.log(`CentralAuth running at port ${PORT}`);
}

void bootstrap();
