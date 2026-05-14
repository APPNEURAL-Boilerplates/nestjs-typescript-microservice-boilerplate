import 'dotenv/config';
import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RpcExceptionFilter } from './common/filters/rpc-exception.filter';
import { validateEnv } from './config/env.validation';

async function bootstrap(): Promise<void> {
  const env = validateEnv(process.env);
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: env.MICROSERVICE_HOST,
      port: env.MICROSERVICE_PORT
    }
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  app.useGlobalFilters(new RpcExceptionFilter());

  await app.listen();

  logger.log(
    `${env.SERVICE_NAME} listening on tcp://${env.MICROSERVICE_HOST}:${env.MICROSERVICE_PORT}`
  );
}

void bootstrap();
