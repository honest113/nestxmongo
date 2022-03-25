import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EGuardDecoratorKey } from 'src/constants/guard.constant';
import { UsersService } from 'src/modules/users/users.service';
import { httpUnauthorized } from 'src/share/exception/http-exception';
import { IJwtPayload } from 'src/share/interface/auth.interface';

@Injectable()
export class ActiveGuard implements CanActivate {
  private logger = new Logger(ActiveGuard.name);
  constructor(private reflector: Reflector, private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    this.logger.log('ACTIVE GUARD');
    const isPublic = this.reflector.getAllAndOverride<boolean>(EGuardDecoratorKey.IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest() as { user: IJwtPayload };
    const check = await this.usersService.isActiveUser(user.userId);
    if (!check) {
      httpUnauthorized();
    }
    return true;
  }
}
