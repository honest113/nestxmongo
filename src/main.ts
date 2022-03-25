import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EEnvType } from './constants/env.type';
import * as mongoose from 'mongoose';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  mongoose.set('debug', true);

  const config = new DocumentBuilder()
    .setTitle('API Document')
    .setDescription('The API Description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  await app.listen(configService.get(EEnvType.PORT));
}
bootstrap();
