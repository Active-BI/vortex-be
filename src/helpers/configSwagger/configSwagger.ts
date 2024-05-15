import { INestApplication } from '@nestjs/common/interfaces/nest-application.interface';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function ConfigSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Active Portal do Cliente')
    .setDescription('Software de gestão interna da Active Portal do Cliente')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {swaggerOptions: { defaultModelsExpandDepth: -1 },});
}
