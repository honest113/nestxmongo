import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from 'src/modules/users/users.module';
import { ActiveGuard } from './active.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [UsersModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ActiveGuard,
    },
    JwtStrategy,
  ],
})
export class GuardModule {}
