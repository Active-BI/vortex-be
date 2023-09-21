import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigSwagger } from './helpers/configSwagger/configSwagger';
import { json as expressJson } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(expressJson({ limit: '50mb' }));
  ConfigSwagger(app);
  await app.listen(process.env['PORT']);
}
bootstrap();
