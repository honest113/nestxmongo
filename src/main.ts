import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EEnvType } from './constants/env.type';
import * as mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  mongoose.set('debug', true);
  const configService = app.get(ConfigService);
  await app.listen(configService.get(EEnvType.PORT));
}
bootstrap();
