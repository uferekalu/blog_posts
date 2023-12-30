/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ExpressAdapter } from '@nestjs/platform-express'
import * as express from 'express'
import { ConfigService } from '@nestjs/config'
import * as path from 'path';

async function bootstrap() {
  const logger = new Logger()
  const server = express()
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server))
  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT') || 5000

  // Enable CORS for all routes
  app.enableCors()

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )

  // Serve static files from the 'images' folder
  app.use('/images', express.static(path.join(__dirname, '..', 'images')));


  await app.listen(port)

  logger.log(`Application listening on port ${port}`)
}
bootstrap()
