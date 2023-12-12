import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const logger = new Logger();
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Enable CORS for all routes
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(5000);

  logger.log(`Application listening on port 5000`);
}
bootstrap();
