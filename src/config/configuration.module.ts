import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { EEnvType } from 'src/constants/env.type';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: Joi.object({
        [EEnvType.NODE_ENV]: Joi.string().valid('development', 'production', 'test').default('development'),
        [EEnvType.PORT]: Joi.number().default(3000),
        [EEnvType.MONGO_URI]: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigurationModule {}
