import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigSwagger } from './helpers/configSwagger/configSwagger';
import { json as expressJson } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
  });
  app.enableCors({
    origin: 'https://active-pme-app-8b34b51b0e51.herokuapp.com',
    methods: ['POST', 'PATCH', 'UPDATE', 'GET', 'DELETE'],
  });
  app.setGlobalPrefix('api');

  app.use(expressJson({ limit: '50mb' }));
  ConfigSwagger(app);

  await app.listen(process.env['PORT']);
}
bootstrap();
