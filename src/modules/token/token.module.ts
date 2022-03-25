import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EEnvType } from 'src/constants/env.type';
import { TokenService } from './token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>(EEnvType.JWT_SECRET_KEY),
          signOptions: {
            expiresIn: '1h',
          },
        };
      },
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
