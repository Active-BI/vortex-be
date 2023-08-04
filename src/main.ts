import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigSwagger } from './helpers/configSwagger/configSwagger';
import { json as expressJson } from 'express';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
  });
  app.enableCors();
  app.setGlobalPrefix('api');

  app.use(expressJson({ limit: '50mb' }));
  ConfigSwagger(app);
  console.log(env['NODE_ENV']);
  await app.listen(process.env['PORT']);
}
bootstrap();
