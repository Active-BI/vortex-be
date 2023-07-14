import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigSwagger } from './helpers/configSwagger/configSwagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
  });
  ConfigSwagger(app);

  await app.listen(process.env['PORT']);
}
bootstrap();
